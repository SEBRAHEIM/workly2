'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== 'workly.day@outlook.com') {
        throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }
}

export async function verifyUser(userId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true }) // Assuming this column exists or we might need to add it
        .eq('id', userId)

    if (error) throw error
    revalidatePath('/admin')
}

export async function suspendUser(userId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' }) // Assuming this column exists
        .eq('id', userId)

    if (error) throw error
    revalidatePath('/admin')
}

export async function cancelProject(projectId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update({ status: 'cancelled', funds_status: 'refunded' })
        .eq('id', projectId)

    if (error) throw error
    revalidatePath('/admin')
}

export async function forceReleaseFunds(projectId: string) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update({ funds_status: 'released', status: 'completed' })
        .eq('id', projectId)

    if (error) throw error
    revalidatePath('/admin')
}
