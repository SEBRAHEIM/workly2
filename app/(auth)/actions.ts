'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/utils/send-email'

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Send Welcome & Inbox Guarantee Email
    try {
        await sendEmail({
            to: email,
            subject: 'Important: Your Payout & Notification Guarantee 📩',
            html: `
                <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px;">
                    <h1 style="color: #0ea5e9; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; margin-bottom: 24px;">Welcome to the Studio.</h1>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        To ensure you receive your <strong>Payout Alerts</strong> and <strong>Project Updates</strong> directly in your main inbox, please take one minute to secure this sender.
                    </p>
                    
                    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 16px; border: 1px solid #bae6fd; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #0369a1; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 12px;">📩 Future Notification Guarantee</p>
                        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #0c4a6e; margin-bottom: 16px;">
                            This email is sent from <strong>notifications@workly.day</strong>. All your future payment and project alerts will come from this address. <strong>Mark this email as "Not Junk" now:</strong>
                        </p>
                        
                        <div style="font-size: 13px; color: #0c4a6e; line-height: 1.6;">
                            <p style="margin: 8px 0;"><strong>• Gmail:</strong> Open Spam → Open this email → Click <u>"Report not spam"</u>.</p>
                            <p style="margin: 8px 0;"><strong>• Outlook:</strong> Open Junk → Select this email → Click <u>"Not Junk"</u> in the top bar.</p>
                            <p style="margin: 8px 0;"><strong>• Apple Mail:</strong> Open Junk → Select this email → Click <u>"Move to Inbox"</u>.</p>
                        </div>
                    </div>

                    <p style="font-size: 14px; color: #64748b; margin-bottom: 32px;">
                        Once you've done this, find your separate <strong>Verification Code</strong> (sent from no-reply@workly.day) and enter it to finish your setup.
                    </p>
                    <a href="https://workly.day/verify?email=${encodeURIComponent(email)}" style="display: inline-block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">Return to Verify</a>
                </div>
            `
        })
    } catch (emailError) {
        console.error('[SIGNUP] Welcome email failed:', emailError)
    }

    redirect(`/verify?email=${encodeURIComponent(email)}&type=signup`)
}

export async function resendOtp(email: string, type: 'signup' | 'email_change' = 'signup') {
    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
        type: type as any,
        email,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function verifyOtp(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const token = formData.get('token') as string

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/onboarding')
}

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile) {
            if (profile.role === 'client') {
                redirect('/client')
            } else if (profile.role === 'creator') {
                redirect('/creator')
            }
        } else {
            // User has account but no profile -> Onboarding
            redirect('/onboarding')
        }
    }

    redirect('/')
}

export async function forgotPassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: "Password reset link sent to your email." }
}

export async function updatePassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
        return { error: "Passwords do not match." }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/login?message=Password updated successfully.')
}
