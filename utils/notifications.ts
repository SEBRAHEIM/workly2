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
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 16px; color: #1a1a1a;">
                        <div style="margin-bottom: 32px;">
                            <span style="background-color: #0EA5E9; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">Workly Update</span>
                        </div>
                        
                        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; color: #0f172a;">${title || 'New Notification'}</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 32px;">${message}</p>
                        
                        ${link ? `
                            <div style="margin-bottom: 48px;">
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://workly.day'}${link}" 
                                   style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 700; display: inline-block;">
                                    Terminal Access
                                </a>
                            </div>
                        ` : ''}
                        
                        <div style="padding-top: 32px; border-top: 1px solid #f1f5f9; margin-top: 48px;">
                            <p style="font-size: 11px; color: #94a3b8; margin-bottom: 8px; font-weight: 500;">
                                You're receiving this because something important happened on your Workly account.
                            </p>
                            <p style="font-size: 11px; color: #94a3b8;">
                                <strong>Workly Platforms</strong> &bull; Dubai, UAE &bull; <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://workly.day'}/settings" style="color: #0EA5E9; text-decoration: none;">Preference Center</a>
                            </p>
                        </div>
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

