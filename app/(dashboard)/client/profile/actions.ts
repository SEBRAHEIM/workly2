'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateClientIdentity(formData: FormData) {
    const supabase = await createClient()
    const fullName = formData.get('fullName') as string
    const username = formData.get('username') as string
    const displayName = formData.get('displayName') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            username: username,
            display_name: displayName
        })
        .eq('id', user.id)

    if (error) {
        console.error('[SMS DEBUG] Update error:', error)
        return { error: error.message }
    }

    console.log('[SMS DEBUG] Successfully updated client profile')

    revalidatePath('/client/profile')
    return { success: true }
}
