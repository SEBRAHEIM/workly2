import { createAdminClient } from './supabase/admin'

export async function createNotification({
    userId,
    type = 'info',
    message,
    link
}: {
    userId: string
    type?: 'info' | 'success' | 'warning' | 'error'
    message: string
    link?: string
}) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.')
        return { error: 'Service role key missing' }
    }

    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase.from('notifications').insert({
            user_id: userId,
            type,
            message,
            link,
            is_read: false
        }).select()

        if (error) {
            console.error('Supabase Notification Insert Error:', error)
            return { error: error.message }
        }

        return { success: true, data }
    } catch (error: any) {
        console.error('Failed to create notification:', error)
        return { error: error?.message || 'Unknown error' }
    }
}
