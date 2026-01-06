'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitWork(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const projectId = formData.get('projectId') as string

    const submissionFileUrls = formData.getAll('submissionFileUrls') as string[]
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized', success: false }

    const { data: project } = await supabase.from('projects').select('creator_id').eq('id', projectId).single()
    if (!project) return { error: 'Project not found', success: false }

    if (project.creator_id !== user.id) {
        return { error: 'Unauthorized: Only the creator can submit work.', success: false }
    }

    const { error } = await supabase
        .from('projects')
        .update({
            status: 'submitted',
            submission_file_urls: submissionFileUrls
        })
        .eq('id', projectId)

    if (error) {
        return { error: 'Failed to submit work. Please try again.', success: false }
    }

    // Notify Student (Email)
    // In a real implementation, we would fetch the student's email and send a notification here.

    revalidatePath(`/creator/projects/${projectId}`)
    return { success: true, error: '' }
}
