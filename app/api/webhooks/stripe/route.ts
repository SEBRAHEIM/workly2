import { headers } from 'next/headers'
import { getStripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

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

            // 3. Record Transaction with Full Detail
            await supabaseAdmin.from('transactions').insert({
                student_id: project.student_id,
                creator_id: project.creator_id,
                project_id: projectId,
                amount: session.amount_total / 100,
                status: 'completed',
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
                supabaseAdmin.from('notifications').insert({
                    user_id: project.student_id,
                    type: 'success',
                    message: `Payment successful for "${project.title}". Work has started!`,
                    link: `/student/projects/${project.id}`
                }),
                supabaseAdmin.from('notifications').insert({
                    user_id: project.creator_id,
                    type: 'success',
                    message: `Escrow secured for "${project.title}". You can start working now.`,
                    link: `/creator/projects/${project.id}`
                })
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
                    await supabaseAdmin.from('notifications').insert({
                        user_id: profile.id,
                        type: 'success',
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
