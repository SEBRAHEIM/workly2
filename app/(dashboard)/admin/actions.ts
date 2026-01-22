'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/utils/notifications'

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
    revalidatePath('/admin')
}

export async function suspendUser(userId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' }) // Assuming this column exists
        .eq('id', userId)

    if (error) throw error
    revalidatePath('/admin')
}

export async function cancelProject(projectId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update({ status: 'cancelled', funds_status: 'refunded' })
        .eq('id', projectId)

    if (error) throw error
    revalidatePath('/admin')
}

export async function forceReleaseFunds(projectId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update({ funds_status: 'released', status: 'completed' })
        .eq('id', projectId)

    if (error) throw error
    revalidatePath('/admin')
}

export async function completeWithdrawal(withdrawalId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { data: withdrawal, error: fetchError } = await supabase
        .from('withdrawals')
        .select('*, profiles(full_name, display_name)')
        .eq('id', withdrawalId)
        .single()

    if (fetchError || !withdrawal) throw new Error('Withdrawal not found')

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
        message: `Withdrawal Complete: Your AED ${withdrawal.amount} payout has been sent.`,
        link: '/creator/wallet'
    })

    revalidatePath('/admin')
    revalidatePath('/admin/payouts')
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

    revalidatePath('/admin')
    revalidatePath('/admin/payouts')
    return { success: true }
}

// Helper for notifications within admin actions (since we don't have it imported here)
// Actually I need to import it.
