'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updatePassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!newPassword || newPassword.length < 6) {
        return { error: 'New password must be at least 6 characters long.' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match.' }
    }

    // 1. Verify Current Password
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return { error: 'Unauthorized' }

    if (!currentPassword) {
        return { error: 'Current password is required.' }
    }

    // Attempt to sign in with the current password to verify it
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
    })

    if (signInError) {
        return { error: 'Current password is incorrect.' }
    }

    // 2. Update to New Password
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (updateError) {
        return { error: updateError.message }
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
