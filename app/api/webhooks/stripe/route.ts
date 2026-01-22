import { headers } from 'next/headers'
import { getStripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'
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
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as any

    if (event.type === 'checkout.session.completed') {
        const supabase = await createClient()
        const projectId = session.metadata.projectId

        // Update Project Status
        const { error } = await supabase
            .from('projects')
            .update({
                funds_status: 'escrow',
                status: 'in_progress'
            })
            .eq('id', projectId)

        if (error) {
            console.error('Error updating project:', error)
            return new NextResponse('Database Error', { status: 500 })
        }

        // Fetch Project to get Creator ID and Title
        const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()

        if (project) {
            // Record Transaction
            await supabase.from('transactions').insert({
                student_id: project.student_id,
                creator_id: project.creator_id,
                project_id: projectId,
                amount: session.amount_total / 100,
                status: 'completed',
                type: 'payment',
                stripe_session_id: session.id,
                metadata: {
                    project_title: project.title
                }
            })

            // Notify Student
            await supabase.from('notifications').insert({
                user_id: project.student_id,
                type: 'success',
                message: `Payment successful for "${project.title}". Work has started!`,
                link: `/student/projects/${project.id}`
            })

            // Notify Creator
            await supabase.from('notifications').insert({
                user_id: project.creator_id,
                type: 'success',
                message: `Escrow secured for "${project.title}". You can start working now.`,
                link: `/creator/projects/${project.id}`
            })
        }
    } else if (event.type === 'account.updated') {
        const account = event.data.object as any
        const supabase = await createClient()

        // Track verification status if needed
        // For now, let's just log if they are verified
        const isVerified = account.details_submitted && account.charges_enabled && account.payouts_enabled

        if (isVerified) {
            // Update profile with verification flag (if we add one)
            // or just notify the user their account is ready
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('stripe_account_id', account.id)
                .single()

            if (profile) {
                await supabase.from('notifications').insert({
                    user_id: profile.id,
                    type: 'success',
                    message: "Congratulations! Your Stripe account is fully verified and ready for payouts.",
                    link: "/creator/profile"
                })
            }
        }
    }

    return new NextResponse('ok', { status: 200 })
}
