'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/utils/notifications'
import { containsContactInfo } from '@/utils/content-safety'

export async function declineProject(projectId: string) {
    // ...
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Verify creator owns this project context (is the creator_id)
    const { data: project } = await supabase
        .from('projects')
        .select('creator_id, student_id, title')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized or Project not found' }
    }

    // Soft Close
    const { error } = await supabase
        .from('projects')
        .update({
            status: 'declined',
            closed_at: new Date().toISOString(),
            waiting_on: null
        })
        .eq('id', projectId)

    if (error) {
        console.error('Error declining project:', error)
        return { error: 'Failed to decline project' }
    }

    // EVENT: Log Decline
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'declined',
        actor_id: user.id,
        payload: { notes: 'Offer declined by Creator' }
    })

    // Notify Student
    if (project.student_id) {
        await createNotification({
            userId: project.student_id,
            type: 'error',
            message: `Offer Declined: ${project.title}`,
            link: `/student/projects/${projectId}`
        })
    }

    revalidatePath('/creator/requests')
    return { success: true }
}

export async function deleteProject(projectId: string) {
    // This function remains for explicit deletions if we still allow them for drafts.
    // For now, aligning with "Soft Close", explicit delete might be restricted even further 
    // or we leave it as is for "Cleaning up". 
    // The previous implementation was a hard delete. 
    // If the user wants "Remove from view" -> Archive.
    // If "Hard Delete" -> Real Delete.
    // I will leave this as real delete for now, but ensure it checks logic.

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Verify creator owns this project context
    const { data: project } = await supabase
        .from('projects')
        .select('creator_id, status')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized or Project not found' }
    }

    // Checking status...
    // Explicitly prevent deleting "done deals" (agreed, in_progress, completed, submitted)
    const protectedStatuses = ['agreed', 'in_progress', 'completed', 'submitted', 'accepted']
    if (protectedStatuses.includes(project.status)) {
        return { error: 'Cannot delete an active project. Contact support if needed.' }
    }

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

    if (error) {
        console.error('Error deleting project:', error)
        return { error: 'Failed to delete project' }
    }

    revalidatePath('/creator/requests')
    return { success: true }
}

export async function submitOffer(formData: FormData) {
    const supabase = await createClient()
    const projectId = formData.get('projectId') as string
    const price = parseFloat(formData.get('price') as string)
    const notes = formData.get('notes') as string || ''

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // 0. Content Safety Check
    const notesCheck = containsContactInfo(notes)
    if (notesCheck.hasContactInfo) {
        return { error: `Notes validation failed: ${notesCheck.reason}. Sharing contact info is strictly prohibited.` }
    }

    // Fetch project to get student_id
    const { data: project } = await supabase
        .from('projects')
        .select('student_id, title')
        .eq('id', projectId)
        .single()

    // 1. Create the Offer
    const { error: offerError } = await supabase
        .from('offers')
        .insert({
            project_id: projectId,
            sender_id: user.id, // The creator sending the offer
            price: price,
            status: 'pending'
        })

    if (offerError) {
        console.error('Error creating offer:', offerError)
        return { error: 'Failed to send offer' }
    }

    // 2. Update Project Status
    const { error: projectError } = await supabase
        .from('projects')
        .update({
            status: 'pending', // Waiting for student response
            current_price: price,
            waiting_on: project?.student_id
        })
        .eq('id', projectId)

    if (projectError) {
        console.error('Error updating project:', projectError)
        return { error: 'Failed to update project status' }
    }

    // EVENT: Log Offer
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'offer_sent',
        actor_id: user.id,
        payload: { price: price, notes: notes || 'Offer from Creator' }
    })

    // Notify Student
    if (project?.student_id) {
        await createNotification({
            userId: project.student_id,
            type: 'warning',
            message: `New Offer: AED ${price} for ${project.title}`,
            link: `/student/projects/${projectId}`
        })
    }

    revalidatePath('/creator/requests')
    return { success: true }
}

export async function submitWork(formData: FormData) {
    const supabase = await createClient()
    const projectId = formData.get('projectId') as string
    const url = formData.get('url') as string
    const notes = formData.get('notes') as string

    if (!url) return { error: 'URL is required' }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Content Safety Check
    const notesCheck = containsContactInfo(notes)
    if (notesCheck.hasContactInfo) {
        return { error: `Notes validation failed: ${notesCheck.reason}. Sharing contact info is strictly prohibited.` }
    }

    // Verify ownership and get student info
    const { data: project } = await supabase
        .from('projects')
        .select('creator_id, student_id, title, profiles!projects_student_id_fkey(whatsapp_phone, full_name)')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized' }
    }

    // Update Project
    const { error } = await supabase
        .from('projects')
        .update({
            status: 'submitted',
            submission_url: url,
            submission_notes: notes,
            waiting_on: project.student_id // Now waiting on student to review
        })
        .eq('id', projectId)

    if (error) {
        console.error('Error submitting work:', error)
        return { error: 'Failed to submit work' }
    }

    // Log Event
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'work_submitted',
        actor_id: user.id,
        payload: { url, notes }
    })

    // Notify Student
    if (project.student_id) {
        await createNotification({
            userId: project.student_id,
            type: 'success',
            message: `Work Submitted: ${project.title}`,
            link: `/student/projects/${projectId}`
        })
    }

    revalidatePath('/creator/requests')
    return {
        success: true,
        projectId,
        studentPhone: studentPhone || null,
        studentName: studentName || 'Student',
        projectTitle: project.title
    }
}

export async function acceptOffer(projectId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Fetch project
    const { data: project } = await supabase
        .from('projects')
        .select('title, student_id, current_price, creator_id')
        .eq('id', projectId)
        .single()

    if (!project || project.creator_id !== user.id) {
        return { error: 'Unauthorized or project not found' }
    }

    const { error } = await supabase
        .from('projects')
        .update({
            status: 'accepted',
            waiting_on: null // Deal done
        })
        .eq('id', projectId)

    if (error) return { error: 'Database update failed' }

    // EVENT: Log Acceptance
    await supabase.from('project_events').insert({
        project_id: projectId,
        type: 'accepted',
        actor_id: user.id,
        payload: { notes: 'Counter-offer accepted by Creator' }
    })

    // Notify Student
    if (project.student_id) {
        await createNotification({
            userId: project.student_id,
            type: 'success',
            message: `Counter-offer Accepted! AED ${project.current_price} for ${project.title}`,
            link: `/student/projects/${projectId}`
        })
    }

    revalidatePath('/creator/requests')
    revalidatePath(`/student/projects/${projectId}`)
    return { success: true }
}
