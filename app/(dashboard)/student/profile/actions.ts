'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStudentIdentity(formData: FormData) {
    const supabase = await createClient()
    const smsPhone = formData.get('smsPhone') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    console.log('[SMS DEBUG] Updating student profile for user:', user.id, { smsPhone })

    const { error } = await supabase
        .from('profiles')
        .update({
            whatsapp_phone: smsPhone
        })
        .eq('id', user.id)

    if (error) {
        console.error('[SMS DEBUG] Update error:', error)
        return { error: error.message }
    }

    console.log('[SMS DEBUG] Successfully updated student profile')

    revalidatePath('/student/profile')
    return { success: true }
}
