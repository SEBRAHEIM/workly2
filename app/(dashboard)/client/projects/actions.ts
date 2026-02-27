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
            success_url: `${baseUrl}/client/projects/${project.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/client/projects/${project.id}?payment=cancelled`,
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

    // SECURITY: Only the Client can release funds
    if (project.client_id !== user.id) {
        throw new Error('Unauthorized: Only the client can release funds.')
    }

    const creatorId = project.creator_id
    const amount = project.current_price || 0
    let transferSuccess = false

    const commissionRate = project.commission_rate || 0.20
    const commissionAmount = amount * commissionRate
    const creatorEarnings = amount - commissionAmount

    // Handle Escrow Release logic: Internal Wallet Model
    if (project.funds_status === 'escrow') {
        // Use ADMIN client to update creator wallet (Client doesn't have permissions)
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

            // 1.1 Update or Create Transaction entry for ledger
            await adminSupabase
                .from('transactions')
                .update({
                    status: 'paid',
                    workly_fee_amount: commissionAmount,
                    creator_net_amount: creatorEarnings,
                    updated_at: new Date().toISOString()
                })
                .eq('project_id', projectId)
                .eq('type', 'payment')

            transferSuccess = true
        }
    } else if (project.status === 'completed') {
        transferSuccess = true
    }

    // 2. Update Project Status (Regardless of payment, mark as completed)
    const { error: projectError } = await supabase
        .from('projects')
        .update({
            funds_status: transferSuccess ? 'released' : (project.funds_status === 'escrow' ? 'failed_release' : project.funds_status),
            status: 'completed',
            waiting_on: null,
            commission_amount: commissionAmount,
            net_earnings: creatorEarnings
        })
        .eq('id', projectId)

    if (projectError) return { error: 'Failed to update project' }

    // EVENT: Log Completion
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'completed',
        actor_id: user.id,
        payload: { notes: 'Project approved and completed by Client' }
    })

    // Notify Creator via Unified Notification System
    if (transferSuccess) {
        await createNotification({
            userId: project.creator_id,
            type: 'success',
            title: 'Project Completed & Funds Released',
            message: `Your work on "${project.title}" has been approved. AED ${creatorEarnings.toFixed(2)} has been added to your wallet.`,
            link: `/creator/wallet`,
            customEmailHtml: `
                <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px;">
                    <h1 style="color: #0ea5e9; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; margin-bottom: 24px;">Earnings Released.</h1>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Great news! The client for project <strong>"${project.title}"</strong> has approved your work and released the funds.
                    </p>
                    <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em;">Amount Received</p>
                        <p style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900; color: #0ea5e9;">AED ${creatorEarnings.toFixed(2)}</p>
                    </div>
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 32px;">
                        The funds are now available in your wallet for withdrawal.
                    </p>
                    <a href="https://workly.day/creator/wallet" style="display: inline-block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">View Wallet</a>
                </div>
            `
        })
    }

    revalidatePath(`/client/projects/${projectId}`)
}

export async function requestRevision(projectId: string, notes: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const notesCheck = containsContactInfo(notes)
    if (notesCheck.hasContactInfo) {
        return { error: `Validation failed: ${notesCheck.reason}. Sharing contact info is strictly prohibited.` }
    }

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (!project) throw new Error('Project not found')
    if (project.client_id !== user.id) throw new Error('Unauthorized')

    const revisionsUsed = project.revisions_used || 0
    const revisionsTotal = project.revisions_total || 0
    if (revisionsUsed >= revisionsTotal) {
        return { error: 'No revisions remaining for this package.' }
    }

    const turnaround = project.revision_turnaround || 2
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + turnaround)

    const { error } = await supabase
        .from('projects')
        .update({
            status: 'revision_requested',
            revision_notes: notes,
            revisions_used: revisionsUsed + 1,
            revision_due_date: dueDate.toISOString(),
            waiting_on: project.creator_id
        })
        .eq('id', projectId)

    if (error) return { error: 'Failed to request revision' }

    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'revision_requested',
        actor_id: user.id,
        payload: { notes }
    })

    await createNotification({
        userId: project.creator_id,
        type: 'warning',
        title: 'Revision Requested',
        message: `Revision requested: ${project.title}`,
        link: `/creator/projects/${projectId}`
    })

    revalidatePath(`/client/projects/${projectId}`)
    return { success: true }
}

export async function reportProject(projectId: string, reason: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const reasonCheck = containsContactInfo(reason)
    if (reasonCheck.hasContactInfo) {
        return { error: `Validation failed: ${reasonCheck.reason}` }
    }

    const { error } = await supabase
        .from('projects')
        .update({
            reported_issue: reason
        })
        .eq('id', projectId)
        .eq('client_id', user.id)

    if (error) return { error: 'Failed to submit report' }

    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'message_sent',
        actor_id: user.id,
        payload: { report: reason, note: 'PROJECT REPORTED BY CLIENT' }
    })

    revalidatePath(`/client/projects/${projectId}`)
    return { success: true }
}

export async function submitReview(projectId: string, rating: number, comment: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (!project) throw new Error('Project not found')
    if (project.client_id !== user.id) throw new Error('Unauthorized')
    if (project.status !== 'completed') throw new Error('Project must be completed to leave a review')

    const { error } = await supabase
        .from('reviews')
        .insert({
            project_id: projectId,
            client_id: user.id,
            creator_id: project.creator_id,
            rating: rating,
            comment: comment.trim() || null
        })

    if (error) {
        if (error.code === '23505') return { error: 'You have already reviewed this project.' }
        return { error: 'Failed to submit review' }
    }

    revalidatePath(`/client/projects/${projectId}`)
    revalidatePath(`/client/creator/${project.creator_id}`)
    return { success: true }
}
