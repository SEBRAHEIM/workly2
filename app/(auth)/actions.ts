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
        options: {
            // We don't need emailRedirectTo because we are using OTP
            // But good to set it just in case
        },
    })

    if (error) {
        return { error: error.message }
    }

    redirect(`/verify?email=${encodeURIComponent(email)}`)
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
            if (profile.role === 'student') {
                redirect('/student')
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
