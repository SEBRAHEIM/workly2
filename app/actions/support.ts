'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitSupportTicket(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!subject || subject.trim().length < 5) {
        return { error: 'Please provide a descriptive subject (at least 5 characters).' }
    }

    if (!message || message.trim().length < 10) {
        return { error: 'Please provide more details in your message (at least 10 characters).' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to submit a support ticket.' }
    }

    // 1. Fetch User Identity for the email
    const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, full_name, username')
        .eq('id', user.id)
        .single()

    const userName = profile?.display_name || profile?.full_name || profile?.username || user.email || 'Anonymous User'

    // 2. Insert into DB
    const { error } = await supabase
        .from('support_tickets')
        .insert({
            user_id: user.id,
            subject,
            message,
            status: 'open'
        })

    if (error) {
        console.error('Support ticket submission error:', error)
        return { error: 'Failed to submit your request. Please try again later.' }
    }

    // 3. Send automated email notification
    try {
        const { sendEmail } = await import('@/utils/send-email')
        await sendEmail({
            to: 'workly.day@outlook.com',
            subject: `[Support Ticket] ${subject}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
                    <h2 style="color: #0ea5e9;">New Support Ticket</h2>
                    <p><strong>From:</strong> ${userName} (${user.email})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 10px;">
                        ${message.replace(/\n/g, '<br/>')}
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
                        Workly Support Automation
                    </p>
                </div>
            `
        })
    } catch (emailError) {
        console.error('Failed to send support notification email:', emailError)
        // We don't return error here because the ticket IS in the DB
    }

    return { success: true }
}
