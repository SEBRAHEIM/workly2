'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Calculates the financial split for a gross amount.
 * Workly: 17%
 * Stripe: 2.9% + 1.00 AED
 */
export async function calculateSplit(gross: number) {
    const worklyFee = Math.round(gross * 0.17 * 100) / 100
    const stripeFeeValue = Math.round((gross * 0.029 + 1) * 100) / 100
    const creatorNet = Math.round((gross - worklyFee - stripeFeeValue) * 100) / 100

    return {
        gross,
        worklyFee,
        stripeFee: stripeFeeValue,
        creatorNet
    }
}

/**
 * Records a financial transaction for a project.
 */
export async function recordTransaction(projectId: string) {
    const supabase = await createClient()

    // Fetch project details
    const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (fetchError || !project) throw new Error('Project not found')

    const split = await calculateSplit(project.current_price || 0)

    const { error: insertError } = await supabase
        .from('transactions')
        .insert({
            project_id: projectId,
            student_id: project.student_id,
            creator_id: project.creator_id,
            gross_amount: split.gross,
            workly_fee_amount: split.worklyFee,
            stripe_fee_amount: split.stripeFee,
            creator_net_amount: split.creatorNet,
            status: 'pending'
        })

    if (insertError) throw insertError

    revalidatePath('/hq')
}

/**
 * Creates a payout batch for a specific creator.
 */
export async function createPayoutBatch(creatorId: string, transactionIds: string[]) {
    const supabase = await createClient()

    // Aggregate totals
    const { data: txs, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .in('id', transactionIds)

    if (txError || !txs) throw txError

    const totals = txs.reduce((acc, tx) => ({
        totalGross: acc.totalGross + Number(tx.gross_amount),
        totalNet: acc.totalNet + Number(tx.creator_net_amount),
        totalWorkly: acc.totalWorkly + Number(tx.workly_fee_amount),
        totalStripe: acc.totalStripe + Number(tx.stripe_fee_amount)
    }), { totalGross: 0, totalNet: 0, totalWorkly: 0, totalStripe: 0 })

    // Create batch
    const { data: batch, error: batchError } = await supabase
        .from('payout_batches')
        .insert({
            period_start: txs.reduce((min, tx) => new Date(tx.created_at) < new Date(min) ? tx.created_at : min, txs[0].created_at),
            period_end: txs.reduce((max, tx) => new Date(tx.created_at) > new Date(max) ? tx.created_at : max, txs[0].created_at),
            total_gross: totals.totalGross,
            total_creator_net: totals.totalNet,
            total_workly_fee: totals.totalWorkly,
            total_stripe_fee: totals.totalStripe,
            status: 'draft'
        })
        .select()
        .single()

    if (batchError) throw batchError

    // Link transactions to batch
    const { error: updateError } = await supabase
        .from('transactions')
        .update({ payout_batch_id: batch.id })
        .in('id', transactionIds)

    if (updateError) throw updateError

    revalidatePath('/hq')
    return batch
}

/**
 * Marks a payout batch as paid.
 */
export async function markBatchPaid(batchId: string) {
    const supabase = await createClient()

    // Update batch
    const { error: batchError } = await supabase
        .from('payout_batches')
        .update({ status: 'paid' })
        .eq('id', batchId)

    if (batchError) throw batchError

    // Update transactions
    const { error: txError } = await supabase
        .from('transactions')
        .update({ status: 'paid' })
        .eq('payout_batch_id', batchId)

    if (txError) throw txError

    revalidatePath('/hq')
}
