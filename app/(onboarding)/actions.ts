'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function completeOnboarding(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const role = formData.get('role') as string
    const username = formData.get('username') as string
    const fullName = formData.get('fullName') as string

    // Validate inputs
    if (!role || !['student', 'creator'].includes(role)) {
        return { error: 'Invalid role selected.' }
    }
    if (!username || username.length < 3) {
        return { error: 'Username must be at least 3 characters.' }
    }

    // Check if username is taken
    // Note: We should rely on DB constraint, but a check is nice.
    // Actually, let's just try to insert and handle error.

    const { error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            role,
            username,
            full_name: fullName,
        })

    if (error) {
        if (error.code === '23505') { // unique violation
            return { error: 'Username is already taken.' }
        }
        return { error: error.message }
    }

    // Redirect based on role
    if (role === 'student') {
        redirect('/student')
    } else {
        redirect('/creator')
    }
}
