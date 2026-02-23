'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
