'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { createNotification } from '@/utils/notifications'
import { containsContactInfo } from '@/utils/content-safety'
import { notifyStudentOfWorkSubmitted } from '@/utils/sms'
import { getStripe } from '@/utils/stripe'
import { headers } from 'next/headers'

// Stripe Connect actions
/*
export async function createStripeOnboardingLink() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_account_id, email')
        .eq('id', user.id)
        .single()

    let accountId = profile?.stripe_account_id

    try {
        if (!accountId) {
            // UAE (AE) specific requirements:
            // 1. Only 'standard' accounts are supported for platforms.
            // 2. 'individual' business type is NOT supported in AE. Must use 'company'.
            const account = await getStripe().accounts.create({
                type: 'standard',
                country: 'AE',
                email: user.email,
                business_type: 'company', // Mandatory for UAE platforms
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_profile: {
                    url: 'https://workly.day',
                    mcc: '7392',
                }
            })
            accountId = account.id
            await supabase.from('profiles').update({ stripe_account_id: accountId }).eq('id', user.id)
        }

        const { url } = await getStripe().accountLinks.create({
            account: accountId,
            refresh_url: 'https://workly.day/creator/profile?stripe_refresh=true',
            return_url: 'https://workly.day/creator/profile?stripe_success=true',
            type: 'account_onboarding',
        })

        return redirect(url)
    } catch (err: any) {
        console.error('[STRIPE CONNECT ERROR]', err)
        // If it's a redirect, we must re-throw it so Next.js handles it
        if (err.message === 'NEXT_REDIRECT') throw err
        return { error: `Stripe error: ${err.message}` }
    }
}
*/


export async function updateBankDetails(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const bank_account_name = formData.get('bank_account_name') as string
    const bank_iban = formData.get('bank_iban') as string
    const bank_name = formData.get('bank_name') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            bank_account_name,
            bank_iban,
            bank_name,
            payout_preference: 'bank'
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating bank details:', error)
        return { error: error.message }
    }

    revalidatePath('/creator/profile')
    return { success: true }
}

export async function updatePayPalDetails(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const paypal_email = formData.get('paypal_email') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            paypal_email,
            payout_preference: 'paypal'
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating PayPal details:', error)
        return { error: error.message }
    }

    revalidatePath('/creator/profile')
    return { success: true }
}

export async function requestPayPalPayout() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, wallet_balance, paypal_email, payout_preference')
        .eq('id', user.id)
        .single()

    if (!profile || profile.payout_preference !== 'paypal' || !profile.paypal_email) {
        return { error: 'PayPal details not set or Payout method not set to PayPal' }
    }

    const balance = profile.wallet_balance || 0
    if (balance <= 0) {
        return { error: 'No funds available to withdraw' }
    }

    try {
        // 1. Log the paypal withdrawal request as 'pending'
        const { error: withdrawalError } = await supabase.from('withdrawals').insert({
            creator_id: user.id,
            amount: balance,
            method: 'paypal',
            status: 'pending',
            details: {
                payout_to: profile.paypal_email,
                request_date: new Date().toISOString()
            }
        })

        if (withdrawalError) throw withdrawalError

        // 2. Deduct from local wallet
        const { error: balanceError } = await supabase
            .from('profiles')
            .update({ wallet_balance: 0 })
            .eq('id', user.id)

        if (balanceError) throw balanceError

        revalidatePath('/creator/wallet')
        return { success: true }
    } catch (err: any) {
        console.error('PayPal payout error:', err)
        return { error: err.message || 'Request failed' }
    }
}

export async function requestManualPayout() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, wallet_balance, bank_iban, bank_name, bank_account_name, payout_preference')
        .eq('id', user.id)
        .single()

    if (!profile || profile.payout_preference !== 'bank' || !profile.bank_iban) {
        return { error: 'Bank details not set or Payout method not set to Manual Bank' }
    }

    const balance = profile.wallet_balance || 0
    if (balance <= 0) {
        return { error: 'No funds available to withdraw' }
    }

    try {
        // 1. Log the manual withdrawal request as 'pending'
        const { error: withdrawalError } = await supabase.from('withdrawals').insert({
            creator_id: user.id,
            amount: balance,
            method: 'bank',
            status: 'pending',
            details: {
                payout_to: profile.bank_iban,
                bank_name: profile.bank_name,
                account_name: profile.bank_account_name,
                request_date: new Date().toISOString()
            }
        })

        if (withdrawalError) throw withdrawalError

        // 2. Deduct from local wallet
        const { error: balanceError } = await supabase
            .from('profiles')
            .update({ wallet_balance: 0 })
            .eq('id', user.id)

        if (balanceError) throw balanceError

        revalidatePath('/creator/wallet')
        return { success: true }
    } catch (err: any) {
        console.error('Manual payout error:', err)
        return { error: err.message || 'Request failed' }
    }
}

// Decline project remains the same
export async function declineProject(projectId: string) {
    // ...
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Verify creator owns this project context (is the creator_id)
    const { data: project } = await supabase
        .from('projects')
        .select('creator_id, student_id, title, funds_status')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized or Project not found' }
    }

    // Soft Close or Refund
    const isEscrowed = project.funds_status === 'escrow'
    let refundResult = null

    if (isEscrowed) {
        try {
            // Find the transaction to get the payment_intent
            const { data: transaction } = await supabase
                .from('transactions')
                .select('metadata, amount')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            const paymentIntentId = transaction?.metadata?.payment_intent

            if (paymentIntentId) {
                // Trigger Stripe Refund
                await getStripe().refunds.create({
                    payment_intent: paymentIntentId,
                    reason: 'requested_by_customer', // In this case, creator's side refusal
                    metadata: { projectId, studentId: project.student_id }
                })

                // Record Refund Transaction
                await supabase.from('transactions').insert({
                    student_id: project.student_id,
                    creator_id: project.creator_id,
                    project_id: projectId,
                    amount: transaction.amount,
                    status: 'completed',
                    type: 'refund',
                    metadata: { reason: 'Creator declined project', original_payment_intent: paymentIntentId }
                })

                refundResult = 'refunded'
            }
        } catch (refundError: any) {
            console.error('[REFUND ERROR] Failed to automatically refund:', refundError)
            // We don't block the decline, but we should alert admin or log it
        }
    }

    const { error } = await supabase
        .from('projects')
        .update({
            status: 'declined',
            funds_status: refundResult || project.funds_status,
            closed_at: new Date().toISOString(),
            waiting_on: null
        })
        .eq('id', projectId)

    if (error) {
        console.error('Error declining project:', error)
        return { error: 'Failed to decline project' }
    }

    // EVENT: Log Decline
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'declined',
        actor_id: user.id,
        payload: { notes: 'Offer declined by Creator', refunded: !!refundResult }
    })

    // Notify Student
    if (project.student_id) {
        await createNotification({
            userId: project.student_id,
            type: refundResult ? 'info' : 'error',
            title: refundResult ? 'Project Declined & Refunded' : 'Offer Declined',
            message: refundResult
                ? `Project Declined & Refunded: ${project.title}. The amount has been sent back to your original payment method.`
                : `Offer Declined: ${project.title}`,
            link: `/student/projects/${projectId}`
        })

    }

    revalidatePath('/creator/requests')
    revalidatePath(`/student/projects/${projectId}`)
    return { success: true, refunded: !!refundResult }
}

export async function deleteProject(projectId: string) {
    // This function remains for explicit deletions if we still allow them for drafts.
    // For now, aligning with "Soft Close", explicit delete might be restricted even further 
    // or we leave it as is for "Cleaning up". 
    // The previous implementation was a hard delete. 
    // If the user wants "Remove from view" -> Archive.
    // If "Hard Delete" -> Real Delete.
    // I will leave this as real delete for now, but ensure it checks logic.

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Verify creator owns this project context
    const { data: project } = await supabase
        .from('projects')
        .select('creator_id, status')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized or Project not found' }
    }

    // Checking status...
    // Explicitly prevent deleting "done deals" (agreed, in_progress, completed, submitted)
    const protectedStatuses = ['agreed', 'in_progress', 'completed', 'submitted', 'accepted']
    if (protectedStatuses.includes(project.status)) {
        return { error: 'Cannot delete an active project. Contact support if needed.' }
    }

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

    if (error) {
        console.error('Error deleting project:', error)
        return { error: 'Failed to delete project' }
    }

    revalidatePath('/creator/requests')
    return { success: true }
}

// submitOffer removed.

export async function submitWork(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const projectId = formData.get('projectId') as string
    const url = formData.get('url') as string
    const notes = formData.get('notes') as string

    const projectTitle = formData.get('projectTitle') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Content Safety Check
    const notesCheck = containsContactInfo(notes)
    if (notesCheck.hasContactInfo) {
        return { error: `Notes validation failed: ${notesCheck.reason}. Sharing contact info is strictly prohibited.` }
    }

    // 2. Multi-file support (from some forms)
    const submissionFileUrls = formData.getAll('submissionFileUrls') as string[]
    const finalUrl = url || (submissionFileUrls.length > 0 ? submissionFileUrls[0] : null)

    if (!finalUrl && submissionFileUrls.length === 0) {
        return { error: 'Please provide a deliverable link or upload a file.' }
    }

    // 3. Fetch Student Info for internal use (notifications)
    const { data: projectCheck } = await createAdminClient()
        .from('projects')
        .select('student_id, profiles!projects_student_id_fkey(whatsapp_phone, full_name, display_name)')
        .eq('id', projectId)
        .single()

    const finalStudentPhone = projectCheck?.profiles ? (projectCheck.profiles as any).whatsapp_phone : null
    const finalStudentName = projectCheck?.profiles ? ((projectCheck.profiles as any).display_name || (projectCheck.profiles as any).full_name || 'Student') : 'Student'

    // Verify ownership and get student_id/title
    const { data: project } = await supabase
        .from('projects')
        .select('creator_id, student_id, title')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Project not found or Unauthorized' }
    }

    // Update Project
    const { error } = await supabase
        .from('projects')
        .update({
            status: 'submitted',
            submission_url: finalUrl,
            submission_notes: notes || '',
            submission_file_urls: submissionFileUrls,
            revision_notes: null, // Clear notes after submission
            waiting_on: project.student_id, // Now waiting on student to review
            submitted_at: new Date().toISOString()
        })
        .eq('id', projectId)

    if (error) {
        console.error('Error submitting work:', error)
        return { error: 'Failed to submit work' }
    }

    // Log Event
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'work_submitted',
        actor_id: user.id,
        payload: { url: finalUrl, notes: notes || '', files: submissionFileUrls }
    })

    // Notify Student
    if (project.student_id) {
        await createNotification({
            userId: project.student_id,
            type: 'success',
            title: 'Work Submitted',
            message: `Work Submitted: ${project.title}`,
            link: `/student/projects/${projectId}`
        })


        // Background WhatsApp Alert
        if (finalStudentPhone) {
            supabase.from('profiles').select('display_name, full_name').eq('id', user.id).single().then(creatorProfile => {
                const creatorDisplayName = creatorProfile.data?.display_name || creatorProfile.data?.full_name || 'Your Creator';
                notifyStudentOfWorkSubmitted({
                    to: finalStudentPhone,
                    creatorName: creatorDisplayName,
                    projectTitle: project.title,
                    link: `${process.env.NEXT_PUBLIC_BASE_URL}/student/projects/${projectId}`
                }).catch(e => console.error('[WHATSAPP] Student notification failed:', e));
            });
        }
    }

    revalidatePath('/creator/requests')
    return {
        success: true,
        projectId
    }
}

// acceptOffer removed.

export async function startProject(projectId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: project } = await supabase
        .from('projects')
        .select('creator_id, status, student_id, title')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('projects')
        .update({
            status: 'in_progress',
            waiting_on: user.id // Waiting on creator to deliver
        })
        .eq('id', projectId)

    if (error) {
        console.error('Error starting project:', error)
        return { error: 'Failed to start project' }
    }

    // Log Event
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'status_change',
        actor_id: user.id,
        payload: { from: project.status, to: 'in_progress', notes: 'Creator started work' }
    })

    // Notify Student
    if (project.student_id) {
        await createNotification({
            userId: project.student_id,
            type: 'info',
            title: 'Work Started',
            message: `Work started on: ${project.title}`,
            link: `/student/projects/${projectId}`
        })

    }

    revalidatePath('/creator/requests')
    return { success: true }
}

// End of actions
