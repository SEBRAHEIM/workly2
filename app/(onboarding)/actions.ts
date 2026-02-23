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
    const isAdmin = user.email === 'workly.day@outlook.com'

    if (!isAdmin && (!role || !['client', 'creator'].includes(role))) {
        return { error: 'Invalid role selected.' }
    }
    if (!username || username.length < 3) {
        return { error: 'Username must be at least 3 characters.' }
    }

    // Role for database
    const finalRole = isAdmin ? 'admin' : role


    // Check if username is taken
    // Note: We should rely on DB constraint, but a check is nice.
    // Actually, let's just try to insert and handle error.

    // Use upsert to handle existing profiles (especially for admins retrying onboarding)
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            role: finalRole,
            username,
            full_name: fullName,
        }, { onConflict: 'id' })

    if (error) {
        if (error.code === '23505') { // unique violation for username
            return { error: 'Username is already taken.' }
        }
        return { error: error.message }
    }

    // Redirect based on role
    if (finalRole === 'admin') {
        redirect('/admin')
    } else if (finalRole === 'client') {
        redirect('/client')
    } else {
        redirect('/creator')
    }
}
