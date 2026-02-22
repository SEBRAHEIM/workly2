import { createAdminClient } from './supabase/admin'
import { sendEmail } from './send-email'

export async function createNotification({
    userId,
    type = 'info',
    title,
    message,
    link
}: {
    userId: string
    type?: 'info' | 'success' | 'warning' | 'error'
    title?: string
    message: string
    link?: string
}) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.')
        return { error: 'Service role key missing' }
    }

    try {
        const supabase = createAdminClient()

        // 1. Insert into Database
        const { data, error } = await supabase.from('notifications').insert({
            user_id: userId,
            type,
            title: title || (type.charAt(0).toUpperCase() + type.slice(1)),
            message,
            link,
            is_read: false
        }).select().single()

        if (error) {
            console.error('Supabase Notification Insert Error:', error)
            return { error: error.message }
        }

        // 2. Fetch User Email and Send Email Notification (Background task)
        // Note: We don't await this to keep the application responsive, but we do catch errors.
        (async () => {
            try {
                if (!process.env.RESEND_API_KEY) {
                    console.warn('NOTICE: RESEND_API_KEY is missing. Skipping email notification. Please configure this in Vercel/Environment to enable emails.')
                    return
                }

                const { data: userData, error: userError } = await supabase
                    .auth.admin.getUserById(userId)

                if (userError || !userData.user?.email) {
                    console.error('Failed to fetch user email for notification:', userError)
                    return
                }

                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #333;">${title || 'New Notification'}</h2>
                        <p style="font-size: 16px; line-height: 1.5; color: #555;">${message}</p>
                        ${link ? `
                            <div style="margin-top: 30px;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://workly.day'}${link}" 
                                   style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                    View in Workly
                                </a>
                            </div>
                        ` : ''}
                        <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
                        <p style="font-size: 12px; color: #999;">You're receiving this because you have notifications enabled on Workly.</p>
                    </div>
                `

                await sendEmail({
                    to: userData.user.email,
                    subject: title || 'New Notification | Workly',
                    html: emailHtml
                })
            } catch (err) {
                console.error('Failed to send notification email:', err)
            }
        })()

        return { success: true, data }
    } catch (error: any) {
        console.error('Failed to create notification:', error)
        return { error: error?.message || 'Unknown error' }
    }
}

