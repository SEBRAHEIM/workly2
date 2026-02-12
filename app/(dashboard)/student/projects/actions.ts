'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Mock Payment: Moves project to 'escrow'
import { getStripe } from '@/utils/stripe'
import { createNotification } from '@/utils/notifications'
import { containsContactInfo } from '@/utils/content-safety'
import { createAdminClient } from '@/utils/supabase/admin'

// Create Stripe Checkout Session
export async function createCheckoutSession(prevState: any, formData: FormData) {
    const projectId = formData.get('projectId') as string
    const supabase = await createClient()

    // Fetch Project Details for Price
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (!project || !project.current_price) {
        return { error: 'Project or price not found' }
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        return { error: 'User email not found' }
    }

    // Create Checkout Session
    // FORCE PRODUCTION URL to prevent environment variable issues
    const baseUrl = 'https://workly.day'
    let stripeSessionUrl = ''

    try {
        const session = await getStripe().checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'aed',
                        product_data: {
                            name: project.title,
                            description: `Escrow payment for project: ${project.title}`,
                        },
                        unit_amount: Math.round(project.current_price * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                projectId: project.id,
            },
            mode: 'payment',
            automatic_payment_methods: {
                enabled: true,
            },
            success_url: `${baseUrl}/student/projects/${project.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/student/projects/${project.id}?payment=cancelled`,
        } as any)

        if (!session.url) {
            console.error('[CHECKOUT] Stripe session created but no URL returned.')
            return { error: 'Failed to create checkout session' }
        }

        stripeSessionUrl = session.url
    } catch (stripeError: any) {
        console.error('[CHECKOUT] Stripe Exception:', stripeError)
        return { error: `Payment system error: ${stripeError instanceof Error ? stripeError.message : String(stripeError)}` }
    }

    if (stripeSessionUrl) {
        redirect(stripeSessionUrl)
    }
}

// Release Funds: Moves funds from Escrow to Creator Wallet (and triggers Payout)
export async function releaseFunds(projectId: string, _amountArgsIgnored: number, _creatorIdArgsIgnored: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // 1. Fetch Project & Verify Ownership + State
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (!project) throw new Error('Project not found')

    // SECURITY: Only the Student can release funds
    if (project.student_id !== user.id) {
        throw new Error('Unauthorized: Only the student can release funds.')
    }

    const creatorId = project.creator_id
    const amount = project.current_price || 0
    let transferSuccess = false

    // Handle Escrow Release logic: Internal Wallet Model
    if (project.funds_status === 'escrow') {
        const commissionRate = project.commission_rate || 0.20
        const commissionAmount = amount * commissionRate
        const creatorEarnings = amount - commissionAmount

        // Use ADMIN client to update creator wallet (Student doesn't have permissions)
        const adminSupabase = createAdminClient()
        const { data: creator, error: fetchError } = await adminSupabase
            .from('profiles')
            .select('wallet_balance, completed_projects')
            .eq('id', creatorId)
            .single()

        if (fetchError) {
            console.error('[RELEASE FUNDS] Error fetching creator:', fetchError)
            return { error: 'Failed to verify creator account' }
        }

        if (creator) {
            // Update Statistics and Wallet Balance
            const newCompletedCount = (creator.completed_projects || 0) + 1
            let newLevel = 1

            if (newCompletedCount >= 50) newLevel = 5
            else if (newCompletedCount >= 32) newLevel = 4
            else if (newCompletedCount >= 20) newLevel = 3
            else if (newCompletedCount >= 3) newLevel = 2

            const { error: balanceError } = await adminSupabase
                .from('profiles')
                .update({
                    wallet_balance: (creator.wallet_balance || 0) + creatorEarnings,
                    completed_projects: newCompletedCount,
                    level: newLevel
                })
                .eq('id', creatorId)

            if (balanceError) {
                console.error('[RELEASE FUNDS] Balance update failed:', balanceError)
                return { error: 'Financial transfer failed. Please contact support.' }
            }

            transferSuccess = true
        }
    }

    // 2. Update Project Status (Regardless of payment, mark as completed)
    const { error: projectError } = await supabase
        .from('projects')
        .update({
            funds_status: transferSuccess ? 'released' : (project.funds_status === 'escrow' ? 'failed_release' : project.funds_status),
            status: 'completed',
            waiting_on: null,
            commission_amount: amount * (project.commission_rate || 0.20),
            net_earnings: amount - (amount * (project.commission_rate || 0.20))
        })
        .eq('id', projectId)

    if (projectError) return { error: 'Failed to update project' }

    // EVENT: Log Completion
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'completed',
        actor_id: user.id,
        payload: { notes: 'Project approved and completed by Student' }
    })

    // Notify Creator
    await createNotification({
        userId: project.creator_id,
        type: 'success',
        message: `Project Completed: ${project.title}`,
        link: `/creator/requests`
    })

    revalidatePath(`/student/projects/${projectId}`)
}

export async function requestRevision(projectId: string, notes: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // 1. Content Safety Check
    const notesCheck = containsContactInfo(notes)
    if (notesCheck.hasContactInfo) {
        return { error: `Validation failed: ${notesCheck.reason}. Sharing contact info is strictly prohibited.` }
    }

    // 1. Fetch Project
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (!project) throw new Error('Project not found')
    if (project.student_id !== user.id) throw new Error('Unauthorized')

    // 2. Check Revision Limit
    const revisionsUsed = project.revisions_used || 0
    const revisionsTotal = project.revisions_total || 0
    if (revisionsUsed >= revisionsTotal) {
        return { error: 'No revisions remaining for this package.' }
    }

    // 3. Calculate Deadline
    const turnaround = project.revision_turnaround || 2
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + turnaround)

    // 4. Update Status
    const { error } = await supabase
        .from('projects')
        .update({
            status: 'revision_requested',
            revision_notes: notes,
            revisions_used: revisionsUsed + 1,
            revision_due_date: dueDate.toISOString(),
            waiting_on: project.creator_id // Back to creator
        })
        .eq('id', projectId)

    if (error) return { error: 'Failed to request revision' }

    // 3. Log Event
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'revision_requested',
        actor_id: user.id,
        payload: { notes }
    })

    // 4. Notify Creator
    await createNotification({
        userId: project.creator_id,
        type: 'warning',
        message: `Revision Requested: ${project.title}`,
        link: `/creator/requests` // Or project view
    })

    revalidatePath(`/student/projects/${projectId}`)
    return { success: true }
}

export async function reportProject(projectId: string, reason: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Content Safety
    const reasonCheck = containsContactInfo(reason)
    if (reasonCheck.hasContactInfo) {
        return { error: `Validation failed: ${reasonCheck.reason}` }
    }

    // 2. Update Project with report
    const { error } = await supabase
        .from('projects')
        .update({
            reported_issue: reason
        })
        .eq('id', projectId)
        .eq('student_id', user.id)

    if (error) return { error: 'Failed to submit report' }

    // 3. Log Event
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'message_sent', // Generic for now
        actor_id: user.id,
        payload: { report: reason, note: 'PROJECT REPORTED BY STUDENT' }
    })

    // 4. Notification for admin could be added here
    // For now, it's just in the DB as requested

    revalidatePath(`/student/projects/${projectId}`)
    return { success: true }
}
