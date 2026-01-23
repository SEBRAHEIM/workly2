'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/utils/notifications'
import { getStripe } from '@/utils/stripe'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== 'workly.day@outlook.com') {
        throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }
}

export async function verifyUser(userId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true }) // Assuming this column exists or we might need to add it
        .eq('id', userId)

    if (error) throw error
    revalidatePath('/hq')
}

export async function suspendUser(userId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' }) // Assuming this column exists
        .eq('id', userId)

    if (error) throw error
    revalidatePath('/hq')
}

export async function cancelProject(projectId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update({ status: 'cancelled', funds_status: 'refunded' })
        .eq('id', projectId)

    if (error) throw error
    revalidatePath('/hq')
}

export async function forceReleaseFunds(projectId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update({ funds_status: 'released', status: 'completed' })
        .eq('id', projectId)

    if (error) throw error
    revalidatePath('/hq')
}

export async function completeWithdrawal(withdrawalId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { data: withdrawal, error: fetchError } = await supabase
        .from('withdrawals')
        .select('*, profiles(id, full_name, display_name, email, stripe_account_id)')
        .eq('id', withdrawalId)
        .single()

    if (fetchError || !withdrawal) throw new Error('Withdrawal not found')
    if (withdrawal.status !== 'pending') throw new Error('Withdrawal is already processed')

    // Handle Stripe Transfer if needed
    if (withdrawal.method === 'stripe') {
        const creatorProfile = withdrawal.profiles
        if (!creatorProfile?.stripe_account_id) {
            throw new Error('Creator has no Stripe account connected')
        }

        try {
            await getStripe().transfers.create({
                amount: Math.round(withdrawal.amount * 100),
                currency: 'aed',
                destination: creatorProfile.stripe_account_id,
                description: `Workly payout: Approved by Admin`,
                metadata: {
                    withdrawalId: withdrawal.id,
                    creatorId: withdrawal.creator_id
                }
            })
        } catch (stripeError: any) {
            console.error('[STRIPE TRANSFER ERROR]', stripeError)
            throw new Error(`Stripe Transfer failed: ${stripeError.message}`)
        }
    }

    const { error } = await supabase
        .from('withdrawals')
        .update({ status: 'completed' })
        .eq('id', withdrawalId)

    if (error) throw error

    // Notify Creator
    const creatorName = withdrawal.profiles?.display_name || withdrawal.profiles?.full_name || 'Creator'
    await createNotification({
        userId: withdrawal.creator_id,
        type: 'success',
        message: `Withdrawal Approved: Your AED ${withdrawal.amount} payout has been processed.`,
        link: '/creator/wallet'
    })

    revalidatePath('/hq')
    return { success: true }
}

export async function rejectWithdrawal(withdrawalId: string, reason: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { data: withdrawal, error: fetchError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', withdrawalId)
        .single()

    if (fetchError || !withdrawal) throw new Error('Withdrawal not found')
    if (withdrawal.status !== 'pending') throw new Error('Withdrawal is not pending')

    // 1. Mark as rejected
    const { error: updateError } = await supabase
        .from('withdrawals')
        .update({
            status: 'rejected',
            details: { ...withdrawal.details, rejection_reason: reason }
        })
        .eq('id', withdrawalId)

    if (updateError) throw updateError

    // 2. Refund Wallet Balance
    const { data: creatorProfile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', withdrawal.creator_id)
        .single()

    if (creatorProfile) {
        await supabase
            .from('profiles')
            .update({ wallet_balance: (creatorProfile.wallet_balance || 0) + withdrawal.amount })
            .eq('id', withdrawal.creator_id)
    }

    // Notify Creator
    await createNotification({
        userId: withdrawal.creator_id,
        type: 'error',
        message: `Withdrawal Rejected: ${reason}. Funds returned to wallet.`,
        link: '/creator/wallet'
    })

    revalidatePath('/hq')
    return { success: true }
}

// Helper for notifications within admin actions (since we don't have it imported here)
// Actually I need to import it.

export async function hqLogin(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 1. Strict Email Check BEFORE attempting login (Safety layer)
    if (email !== 'workly.day@outlook.com') {
        return { error: 'Access Denied: Specialized HQ clearance required.' }
    }

    // 2. Authenticate
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Authentication failed. Please check your credentials.' }
    }

    // 3. Final Verification and Role Sync
    const { data: { user } } = await supabase.auth.getUser()

    if (user && user.email === 'workly.day@outlook.com') {
        // Fetch current profile
        let { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // If no profile exists or role is wrong, fix it automatically
        if (!profile || profile.role !== 'admin') {
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    role: 'admin',
                    full_name: 'Workly Admin',
                    is_verified: true
                })

            if (upsertError) {
                console.error('[HQ LOGIN] Profile Sync Error:', upsertError)
                return { error: 'Security profile synchronization failed.' }
            }
        }

        redirect('/hq')
    }

    return { error: 'Unauthorized Sector. HQ access restricted.' }
}
