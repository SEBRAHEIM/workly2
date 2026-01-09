'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Mock Payment: Moves project to 'escrow'
import { getStripe } from '@/utils/stripe'
import { createNotification } from '@/utils/notifications'
import { containsContactInfo } from '@/utils/content-safety'

// Create Stripe Checkout Session
export async function createCheckoutSession(formData: FormData) {
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
    const session = await getStripe().checkout.sessions.create({
        customer_email: user.email, // Enables auto-email receipt from Stripe
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'aed',
                    product_data: {
                        name: project.title,
                        description: `Escrow payment for project: ${project.title}`,
                    },
                    unit_amount: Math.round(project.current_price * 100), // Stripe expects cents
                },
                quantity: 1,
            },
        ],
        metadata: {
            projectId: project.id,
        },
        mode: 'payment',
        // Pass a receipt flag to trigger the UI
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/student/projects/${project.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/student/projects/${project.id}?payment=cancelled`,
    })

    if (!session.url) {
        return { error: 'Failed to create checkout session' }
    }

    redirect(session.url)
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

    // Handle Escrow Release logic only if funds are actually in escrow
    if (project.funds_status === 'escrow') {
        const commissionRate = 0.17
        const platformFee = amount * commissionRate
        const creatorEarnings = amount - platformFee

        // 3. Fetch Creator Profile to determine payout method
        const { data: creator } = await supabase
            .from('profiles')
            .select('wallet_balance, completed_projects, stripe_account_id')
            .eq('id', creatorId)
            .single()

        if (creator) {
            // --- STRIPE CONNECT TRANSFER ---
            if (creator.stripe_account_id) {
                try {
                    // Must convert to cents for Stripe
                    const amountInCents = Math.round(creatorEarnings * 100)

                    await getStripe().transfers.create({
                        amount: amountInCents,
                        currency: 'aed',
                        destination: creator.stripe_account_id,
                        description: `Payout for Project ${projectId}`,
                    })
                    console.log('Stripe Transfer Successful')
                    transferSuccess = true
                } catch (err) {
                    console.error('Stripe Transfer Failed:', err)
                }
            }

            // Update Statistics
            const newCompletedCount = (creator.completed_projects || 0) + 1
            let newLevel = 1

            // Leveling Logic (Hardcoded Thresholds)
            if (newCompletedCount >= 50) newLevel = 5
            else if (newCompletedCount >= 32) newLevel = 4
            else if (newCompletedCount >= 20) newLevel = 3
            else if (newCompletedCount >= 3) newLevel = 2
            else newLevel = 1

            await supabase
                .from('profiles')
                .update({
                    wallet_balance: (creator.wallet_balance || 0) + creatorEarnings,
                    completed_projects: newCompletedCount,
                    level: newLevel
                })
                .eq('id', creatorId)
        }
    }

    // 2. Update Project Status (Regardless of payment, mark as completed)
    const { error: projectError } = await supabase
        .from('projects')
        .update({
            funds_status: transferSuccess ? 'released' : (project.funds_status === 'escrow' ? 'failed_release' : project.funds_status),
            status: 'completed',
            waiting_on: null
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

    // 2. Update Status
    const { error } = await supabase
        .from('projects')
        .update({
            status: 'revision_requested',
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
