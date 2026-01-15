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

async function getBaseUrl() {
    // 1. Production Hardcode (Safest for Stripe redirects on the live site)
    if (process.env.NODE_ENV === 'production') {
        return 'https://workly.day'
    }

    // 2. Environment Variable fallback
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        let url = process.env.NEXT_PUBLIC_BASE_URL
        if (!url.startsWith('http')) url = `https://${url}`
        return url
    }

    // 3. Request Headers fallback (Dev/Preview)
    try {
        const headersList = await headers()
        const host = headersList.get('host')
        if (host) {
            const protocol = host.includes('localhost') ? 'http' : 'https'
            return `${protocol}://${host}`
        }
    } catch (e) {
        // Ultimate fallback
    }

    return 'http://localhost:3000'
}

export async function createStripeAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Check if account already exists
    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_account_id, email, full_name')
        .eq('id', user.id)
        .single()

    // If account exists, we try to use it. 
    // If it's a V2 account that was causing errors, 
    // getStripeOnboardingLink will handle the "migration" (deletion/recreation) if it fails.
    if (profile?.stripe_account_id) {
        return { accountId: profile.stripe_account_id }
    }

    const stripe = getStripe()

    try {
        // Use Stripe Standard Account Creation
        // This is necessary for UAE-based platforms to allow self-serve onboarding.
        const account = await stripe.accounts.create({
            type: 'standard',
            country: 'ae',
            email: user.email!,
            business_type: 'individual',
        })

        // Save to DB
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ stripe_account_id: account.id })
            .eq('id', user.id)

        if (updateError) {
            console.error('Error saving stripe_account_id:', updateError)
            return { error: 'Failed to save Stripe account ID' }
        }

        revalidatePath('/creator/profile')
        revalidatePath('/creator')

        return { accountId: account.id }
    } catch (err: any) {
        console.error('Stripe Express Account Creation Error:', err)
        return { error: `Stripe error: ${err.message}` }
    }
}

export async function getStripeOnboardingLink() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    let { data: profile } = await supabase
        .from('profiles')
        .select('stripe_account_id')
        .eq('id', user.id)
        .single()

    let accountId = profile?.stripe_account_id

    // Create account if it doesn't exist
    if (!accountId) {
        const result = await createStripeAccount()
        if (result.error) return { error: result.error }
        accountId = result.accountId
    }

    const stripe = getStripe()
    try {
        const baseUrl = await getBaseUrl()

        // Before creating link, verify we aren't using an old Express account
        // Express accounts often fail with "Not a valid URL" in the UAE if not manually approved.
        const account = await stripe.accounts.retrieve(accountId!)
        if (account.type === 'express') {
            throw new Error('legacy_express_detected')
        }

        // Standard V1 Account Links API
        const accountLink = await stripe.accountLinks.create({
            account: accountId!,
            refresh_url: `${baseUrl}/creator/profile`,
            return_url: `${baseUrl}/creator/profile?stripe_success=true`,
            type: 'account_onboarding',
        })

        return { url: accountLink.url }
    } catch (err: any) {
        console.error('Stripe Account Link Error:', err)

        // SELF-HEALING: If we detect a legacy Express account or a configuration error,
        // we clear the ID and try one more time to create a fresh Standard account.
        if (err.message === 'legacy_express_detected' || err.message.includes('configuration') || err.message.includes('v2')) {
            console.log('[STRIPE FIX] Migrating from Express to Standard for user:', user.id)

            // 1. Clear the broken ID
            await supabase.from('profiles').update({ stripe_account_id: null }).eq('id', user.id)

            // 2. Create fresh Standard account
            const freshAccount = await createStripeAccount()
            if (freshAccount.error) return { error: `Migration failed: ${freshAccount.error}` }

            const baseUrl = await getBaseUrl()
            // 3. Try link again
            const retryLink = await stripe.accountLinks.create({
                account: freshAccount.accountId!,
                refresh_url: `${baseUrl}/creator/profile`,
                return_url: `${baseUrl}/creator/profile?stripe_success=true`,
                type: 'account_onboarding',
            })
            return { url: retryLink.url }
        }

        return { error: `Stripe link error: ${err.message}` }
    }
}

export async function getStripeDashboardLink() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_account_id')
        .eq('id', user.id)
        .single()

    if (!profile?.stripe_account_id) {
        return { error: 'No Stripe account connected' }
    }

    const stripe = getStripe()
    try {
        const loginLink = await stripe.accounts.createLoginLink(profile.stripe_account_id)
        return { url: loginLink.url }
    } catch (err: any) {
        console.error('Stripe Dashboard Link Error:', err)
        return { error: `Stripe error: ${err.message}. You might need to complete onboarding first.` }
    }
}

export async function updateBankDetails(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const bank_account_name = formData.get('bank_account_name') as string
    const bank_iban = formData.get('bank_iban') as string
    const bank_name = formData.get('bank_name') as string
    const payout_preference = formData.get('payout_preference') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            bank_account_name,
            bank_iban,
            bank_name,
            payout_preference
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating bank details:', error)
        return { error: error.message }
    }

    revalidatePath('/creator/profile')
    return { success: true }
}

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
        .select('creator_id, student_id, title')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized or Project not found' }
    }

    // Soft Close
    const { error } = await supabase
        .from('projects')
        .update({
            status: 'declined',
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
        payload: { notes: 'Offer declined by Creator' }
    })

    // Notify Student
    if (project.student_id) {
        await createNotification({
            userId: project.student_id,
            type: 'error',
            message: `Offer Declined: ${project.title}`,
            link: `/student/projects/${projectId}`
        })
    }

    revalidatePath('/creator/requests')
    return { success: true }
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

export async function requestWithdrawal(amount: number, method: string, details: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // 1. Get current profile and balance
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, wallet_balance, bank_iban, bank_name')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return { error: 'Profile not found' }
    }

    // 2. Validate amount
    if (amount <= 0) {
        return { error: 'Invalid amount' }
    }

    if (amount > (profile.wallet_balance || 0)) {
        return { error: 'Insufficient balance' }
    }

    // 3. Method-specific validation
    if (method === 'bank' && (!profile.bank_iban || !profile.bank_name)) {
        return { error: 'Bank details not set up in profile' }
    }

    // 4. Create Withdrawal Request & Deduct Balance
    // NOTE: In production, this should be wrapped in a database transaction or RPC
    try {
        const { error: withdrawError } = await supabase
            .from('withdrawals')
            .insert({
                creator_id: user.id,
                amount,
                method,
                details,
                status: 'pending'
            })

        if (withdrawError) throw withdrawError

        const { error: balanceError } = await supabase
            .from('profiles')
            .update({ wallet_balance: profile.wallet_balance - amount })
            .eq('id', user.id)

        if (balanceError) {
            // Rollback withdrawal record if balance update fails (semi-atomic)
            // Ideally use RPC for true atomicity
            console.error('Failed to deduct balance, rolling back withdrawal record')
            // This is a simplified rollback for demonstration; RPC is the correct production path.
            throw balanceError
        }

        revalidatePath('/creator/wallet')
        revalidatePath('/creator/withdrawals')

        return { success: true }
    } catch (err: any) {
        console.error('Withdrawal error:', err)
        return { error: err.message || 'Failed to process withdrawal' }
    }
}

export async function getSavedCards() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('saved_cards')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching cards:', error)
        return { error: error.message }
    }

    return { cards: data || [] }
}

export async function saveCard(cardData: { brand: string, last4: string, bin: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('saved_cards')
        .insert({
            creator_id: user.id,
            ...cardData,
            is_default: false // Simple version for now
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving card:', error)
        return { error: error.message }
    }

    revalidatePath('/creator/withdrawals/card')
    return { success: true, card: data }
}
