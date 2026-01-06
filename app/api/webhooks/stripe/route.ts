import { headers } from 'next/headers'
import { stripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('Stripe-Signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
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

        console.log(`Payment successful for project: ${projectId}`)

        // Update Project Status
        const { error } = await supabase
            .from('projects')
            .update({
                funds_status: 'escrow',
                status: 'in_progress',
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 Days
            })
            .eq('id', projectId)

        if (error) {
            console.error('Error updating project:', error)
            return new NextResponse('Database Error', { status: 500 })
        }

        // Fetch Project to get Creator ID and Title
        const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()

        if (project) {
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
    }

    return new NextResponse('ok', { status: 200 })
}
