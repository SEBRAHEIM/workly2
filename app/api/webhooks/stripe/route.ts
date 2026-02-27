import { headers } from 'next/headers'
import { getStripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import { createNotification } from '@/utils/notifications'


export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('Stripe-Signature') as string

    let event

    try {
        event = getStripe().webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.error(`[STRIPE WEBHOOK] Verification Failed: ${error.message}`)
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as any
    const supabaseAdmin = createAdminClient()

    if (event.type === 'checkout.session.completed') {
        const projectId = session.metadata.projectId

        try {
            // 1. Update Project Status with Admin Privileges
            const { data: project, error: fetchError } = await supabaseAdmin
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (fetchError || !project) {
                console.error(`[STRIPE WEBHOOK] Project ${projectId} not found`)
                return new NextResponse('Project not found', { status: 404 })
            }

            // 1.5 Fetch Creator and Client details for SMS/WhatsApp alert
            const [{ data: creatorProfile }, { data: clientProfile }] = await Promise.all([
                supabaseAdmin.from('profiles').select('display_name, full_name').eq('id', project.creator_id).single(),
                supabaseAdmin.from('profiles').select('display_name, full_name').eq('id', project.client_id).single()
            ])

            // 2. Update Funds and Status
            const { error: updateError } = await supabaseAdmin
                .from('projects')
                .update({
                    funds_status: 'escrow',
                    status: 'in_progress',
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId)

            if (updateError) throw updateError

            // 3. Record Transaction with Full Detail & Splits
            const gross = session.amount_total / 100
            const worklyFee = Math.round(gross * 0.17 * 100) / 100
            const stripeFee = Math.round((gross * 0.029 + 1) * 100) / 100
            const creatorNet = Math.round((gross - worklyFee - stripeFee) * 100) / 100

            await supabaseAdmin.from('transactions').insert({
                client_id: project.client_id,
                creator_id: project.creator_id,
                project_id: projectId,
                gross_amount: gross,
                workly_fee_amount: worklyFee,
                stripe_fee_amount: stripeFee,
                creator_net_amount: creatorNet,
                amount: gross, // Backwards compatibility for amount column
                status: 'pending',
                type: 'payment',
                stripe_session_id: session.id,
                metadata: {
                    project_title: project.title,
                    customer_email: session.customer_details?.email,
                    payment_intent: session.payment_intent
                }
            })

            // 4. Send Notifications
            await Promise.all([
                createNotification({
                    userId: project.client_id,
                    type: 'success',
                    title: 'Payment Successful',
                    message: `Payment successful for "${project.title}". Work has started!`,
                    link: `/client/projects/${project.id}`
                }),
                createNotification({
                    userId: project.creator_id,
                    type: 'success',
                    title: 'New Paid Order',
                    message: `New Paid Order (Secure Escrow): "${project.title}". You can start working now.`,
                    link: `/creator/requests`
                }),
            ])


            console.log(`[STRIPE WEBHOOK] Successfully processed payment for project ${projectId}`)

        } catch (dbError: any) {
            console.error(`[STRIPE WEBHOOK] Database Error: ${dbError.message}`)
            return new NextResponse('Internal Error', { status: 500 })
        }
    } else if (event.type === 'account.updated') {
        const account = event.data.object as any

        try {
            const isVerified = account.details_submitted && account.charges_enabled && account.payouts_enabled

            if (isVerified) {
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('stripe_account_id', account.id)
                    .single()

                if (profile) {
                    await createNotification({
                        userId: profile.id,
                        type: 'success',
                        title: 'Account Verified',
                        message: "Congratulations! Your Stripe account is fully verified and ready for payouts.",
                        link: "/creator/profile"
                    })
                }

            }
        } catch (accountError: any) {
            console.error(`[STRIPE WEBHOOK] Account Update Error: ${accountError.message}`)
        }
    }

    return new NextResponse('ok', { status: 200 })
}
