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

    return { success: true }
}
