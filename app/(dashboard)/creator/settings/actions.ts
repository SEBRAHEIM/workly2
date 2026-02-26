'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updatePassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters long.' }
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match.' }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Delete Profile record (this should cascade to services, portfolio, etc. based on migration 24)
    const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

    if (profileError) {
        console.error('Error deleting profile:', profileError)
        return { error: profileError.message }
    }

    // Since we cannot delete the auth.user without service role or a specific RPC,
    // we will sign the user out and redirect them. 
    // In a real production app, you might use a service role action or a DB trigger on profiles to delete the auth user.

    await supabase.auth.signOut()

    redirect('/')
}
