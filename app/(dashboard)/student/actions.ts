'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { createNotification } from '@/utils/notifications'
// import { sendEmail } from '@/utils/send-email' // Keep disabled for now/static

import { containsContactInfo } from '@/utils/content-safety'

import { after } from 'next/server'

export async function createProject(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Extract and Validate Basic Fields (Fast)
    const creatorId = formData.get('creatorId') as string
    const categorySlug = formData.get('categorySlug') as string
    const pricingType = formData.get('pricingType') as string
    const packageTier = formData.get('selectedPackageTier') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const creatorPhone = formData.get('creatorPhone') as string
    const creatorName = formData.get('creatorName') as string

    // 2. Parallel Data Fetching
    // We fetch user and service config in parallel
    const [userResponse, serviceResponse] = await Promise.all([
        supabase.auth.getUser(),
        (pricingType === 'fixed' || pricingType === 'packages')
            ? supabase.from('creator_services').select('*').eq('creator_id', creatorId).eq('category_slug', categorySlug).single()
            : Promise.resolve({ data: null, error: null })
    ])

    const { data: { user } } = userResponse
    if (!user) {
        return redirect('/login')
    }

    const { data: service } = serviceResponse

    // 3. Content Safety Check (Synchronous)
    const titleCheck = containsContactInfo(title)
    const descCheck = containsContactInfo(description)

    if (titleCheck.hasContactInfo) {
        return { message: `Title validation failed: ${titleCheck.reason}` }
    }
    if (descCheck.hasContactInfo) {
        return { message: `Description validation failed: ${descCheck.reason}. Sharing contact info is strictly prohibited.` }
    }

    // 4. File Handling (Parallel)
    const fileUrls = formData.getAll('fileUrls') as string[]
    const files = formData.getAll('files') as File[]
    const finalFileUrls = [...fileUrls]

    if (files && files.length > 0) {
        const uploadPromises = files.filter(f => f.size > 0).map(async (file) => {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const { error: uploadError } = await supabase.storage.from('project-files').upload(fileName, file)
            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(fileName)
                return publicUrl
            }
            return null
        })
        const uploadedUrls = await Promise.all(uploadPromises)
        finalFileUrls.push(...uploadedUrls.filter((url): url is string => url !== null))
    }

    const mainFileUrl = finalFileUrls.length > 0 ? finalFileUrls[0] : null

    // 5. Calculate Initial Price
    let initialPrice = 0
    if (service) {
        if (pricingType === 'fixed') {
            initialPrice = service.base_price || 0
        } else if (pricingType === 'packages' && packageTier) {
            const pkg = service.service_packages?.[packageTier]
            if (pkg) initialPrice = pkg.price || 0
        }
    }

    // 6. Project Creation (The only critical blocking task)
    const { data, error } = await supabase
        .from('projects')
        .insert({
            student_id: user.id,
            creator_id: creatorId,
            title: title || 'Untitled Project',
            description: description || '',
            status: 'requested',
            pricing_type: pricingType,
            current_price: initialPrice,
            current_terms: {
                category: categorySlug,
                tier: packageTier || null
            },
            file_url: mainFileUrl,
            file_urls: finalFileUrls
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating project:', error)
        return { message: 'Failed to create project: ' + error.message }
    }

    // 7. Non-Blocking Post-creation Tasks (Instant response)
    // We use 'after' to ensure the user is redirected IMMEDIATELY
    after(async () => {
        try {
            // Notifications & Events
            await Promise.all([
                createNotification({
                    userId: creatorId,
                    type: 'info',
                    message: `New Request: ${title}`,
                    link: `/creator/requests`
                }),
                supabase.from('project_events').insert({
                    project_id: data.id,
                    type: 'offer_sent',
                    actor_id: user.id,
                    payload: { price: initialPrice, notes: 'Initial Request' }
                })
            ])

            // Email Fallback (Removed redundant profile fetch for now, can add back if needed)
            /*
            if (creatorProfile?.email) {
                const { sendEmail } = await import('@/utils/send-email')
                await sendEmail({
                    to: creatorProfile.email,
                    subject: `New Project Request: ${title}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #efefef; border-radius: 12px;">
                            <h2 style="color: #3E4C37;">New Project Request</h2>
                            <p>You have received a new project request from a student on Workly.</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p><strong>Title:</strong> ${title}</p>
                            <p><strong>Initial Price:</strong> AED ${initialPrice}</p>
                            <br/>
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/creator/requests" 
                               style="display: inline-block; background-color: #3E4C37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                               View Request
                            </a>
                        </div>
                    `
                }).catch(e => console.error('Background email failed:', e))
            }

            // WhatsApp Notification (Removed in favor of Direct Link Option A)
            /* 
            if (creatorProfile?.whatsapp_phone) {
                const { sendWhatsAppNotification } = await import('@/utils/whatsapp')
                await sendWhatsAppNotification({
                    to: creatorProfile.whatsapp_phone,
                    studentName: (user as any).user_metadata?.full_name || 'A Student',
                    projectTitle: title,
                    tier: packageTier || 'Custom',
                    price: initialPrice,
                    link: `${process.env.NEXT_PUBLIC_BASE_URL}/creator/requests`
                }).catch(e => console.error('WhatsApp background failed:', e))
            }
            */
        } catch (postError) {
            console.error('Error in background tasks:', postError)
        }
    })

    // 8. Return Success Data (For Option A WhatsApp Link)
    return {
        success: true,
        projectId: data.id,
        creatorPhone: creatorPhone || null,
        creatorName: creatorName || 'Creator',
        studentName: (user as any).user_metadata?.full_name || 'A Student',
        projectTitle: title,
        price: initialPrice
    }
}

export async function respondToOffer(formData: FormData) {
    try {
        const supabase = await createClient()
        const projectId = formData.get('projectId') as string
        const action = formData.get('action') as string // 'accept', 'counter', or 'decline'

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Fetch project
        const { data: project } = await supabase.from('projects').select('title, creator_id, student_id').eq('id', projectId).single()
        if (!project) return { success: false, message: 'Project not found' }

        // SECURITY: Only the Student can respond to offers
        if (project.student_id !== user.id) {
            return { success: false, message: 'Unauthorized' }
        }

        if (action === 'accept') {
            const { error } = await supabase
                .from('projects')
                .update({
                    status: 'accepted', // or 'agreed'
                    waiting_on: null // Deal done
                })
                .eq('id', projectId)

            if (error) {
                console.error('Error accepting project:', error)
                return { success: false, message: 'Database update failed: ' + error.message }
            }

            // EVENT: Log Acceptance
            await supabase.from('project_events').insert({
                project_id: projectId,
                type: 'accepted',
                actor_id: user.id,
                payload: { notes: 'Offer accepted by Student' }
            })

            // Notify Creator
            await createNotification({
                userId: project.creator_id,
                type: 'success',
                message: `Offer Accepted: ${project.title}`,
                link: `/creator/projects/${projectId}`
            })

            revalidatePath(`/student/projects/${projectId}`)
            return { success: true }
        }
        else if (action === 'counter') {
            const priceRaw = formData.get('price')
            const notes = formData.get('notes') as string || ''
            const price = priceRaw ? parseFloat(priceRaw.toString()) : 0

            if (!price || isNaN(price) || price < 0) {
                return { success: false, message: "Invalid price" }
            }

            // 1. Content Safety Check for Counter Notes
            const notesCheck = containsContactInfo(notes)
            if (notesCheck.hasContactInfo) {
                return { success: false, message: `Notes validation failed: ${notesCheck.reason}` }
            }

            // Create counter offer 
            const { error: offerError } = await supabase.from('offers').insert({
                project_id: projectId,
                sender_id: user.id,
                price: price,
                status: 'pending'
            })
            if (offerError) console.error("Offer insert error:", offerError)


            // Update project
            const { error: projError } = await supabase.from('projects')
                .update({
                    status: 'countered', // New status
                    current_price: price,
                    waiting_on: project.creator_id // Now waiting on Creator
                })
                .eq('id', projectId)

            if (projError) {
                console.error('Project update error:', projError)
                return { success: false, message: 'Project update failed: ' + projError.message }
            }

            // EVENT: Log Counter
            await supabase.from('project_events').insert({
                project_id: projectId,
                type: 'counter_sent',
                actor_id: user.id,
                payload: { price: price, notes: notes || 'Counter offer from Student' }
            })

            // Notify Creator
            await createNotification({
                userId: project.creator_id,
                type: 'warning',
                message: `Counter Offer: AED ${price} for ${project.title}`,
                link: `/creator/projects/${projectId}`
            })

            revalidatePath(`/student/projects/${projectId}`)
            return { success: true }
        } else if (action === 'decline') {
            // Soft Close Logic
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
                return { success: false, message: 'Database update failed: ' + error.message }
            }

            // EVENT: Log Decline
            await supabase.from('project_events').insert({
                project_id: projectId,
                type: 'declined',
                actor_id: user.id,
                payload: { notes: 'Offer declined by Student' }
            })

            // Notify Creator
            await createNotification({
                userId: project.creator_id,
                type: 'error',
                message: `Offer Declined: ${project.title}`,
                link: `/creator/requests`
            })

            revalidatePath(`/student/projects/${projectId}`)
            return { success: true }
        }

        return { success: false, message: "Unknown action" }
    } catch (e: any) {
        console.error('Server Action Failed:', e)
        return { success: false, message: e.message || 'Server error occurred' }
    }
}

export async function toggleFavorite(creatorId: string, isFavorite: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: 'Unauthorized' }
    }

    try {
        if (isFavorite) {
            // Add to favorites
            const { error } = await supabase
                .from('favorite_creators')
                .insert({
                    student_id: user.id,
                    creator_id: creatorId
                })

            if (error) {
                // Ignore unique violation (already favored)
                if (error.code !== '23505') throw error
            }
        } else {
            // Remove from favorites
            const { error } = await supabase
                .from('favorite_creators')
                .delete()
                .eq('student_id', user.id)
                .eq('creator_id', creatorId)

            if (error) throw error
        }

        revalidatePath('/student/favorites')
        return { success: true }
    } catch (error: any) {
        console.error('Toggle favorite error:', error)
        return { success: false, message: error.message }
    }
}
