'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { createNotification } from '@/utils/notifications'
// import { sendEmail } from '@/utils/send-email' // Keep disabled for now/static

import { containsContactInfo } from '@/utils/content-safety'
import { notifyCreatorOfNewHire } from '@/utils/sms'

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

    // 2. Parallel Data Fetching
    const [userResponse, serviceResponse, creatorResponse] = await Promise.all([
        supabase.auth.getUser(),
        (pricingType === 'fixed' || pricingType === 'packages')
            ? supabase.from('creator_services').select('*').eq('creator_id', creatorId).eq('category_slug', categorySlug).single()
            : Promise.resolve({ data: null, error: null }),
        createAdminClient().from('profiles').select('whatsapp_phone, display_name, full_name').eq('id', creatorId).single()
    ])

    const { data: { user } } = userResponse
    if (!user) {
        return redirect('/login')
    }

    const { data: service } = serviceResponse
    const { data: creatorProfile } = creatorResponse

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

    // 6. Project Creation (Immediate Accepted Status)
    const { data, error } = await supabase
        .from('projects')
        .insert({
            student_id: user.id,
            creator_id: creatorId,
            title: title || 'Untitled Project',
            description: description || '',
            status: 'accepted', // Immediately accepted for payment
            pricing_type: pricingType,
            current_price: initialPrice,
            current_terms: {
                category: categorySlug,
                tier: packageTier || null
            },
            file_url: mainFileUrl,
            file_urls: finalFileUrls,
            waiting_on: null // No negotiation waiting state
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating project:', error)
        return { message: 'Failed to create project: ' + error.message }
    }

    // 7. Non-Blocking Post-creation Tasks
    after(async () => {
        try {
            // Notifications & Events
            await Promise.all([
                createNotification({
                    userId: creatorId,
                    type: 'info',
                    message: `New Order: ${title}`,
                    link: `/creator/requests`
                }),
                supabase.from('project_events').insert({
                    project_id: data.id,
                    type: 'accepted', // Event is acceptance
                    actor_id: user.id,
                    payload: { price: initialPrice, notes: 'Project created at fixed price' }
                })
            ])

            // WhatsApp Notification
            if (creatorProfile?.whatsapp_phone) {
                await notifyCreatorOfNewHire({
                    to: creatorProfile.whatsapp_phone,
                    studentName: (user as any).user_metadata?.full_name || 'A Student',
                    projectTitle: title,
                    tier: packageTier || 'Fixed',
                    price: initialPrice,
                    link: `${process.env.NEXT_PUBLIC_BASE_URL}/creator/requests`
                }).catch(e => console.error('[SMS] Background alert failed:', e))
            }
        } catch (postError) {
            console.error('Error in background tasks:', postError)
        }
    })

    return {
        success: true,
        projectId: data.id,
        projectTitle: title,
        price: initialPrice
    }
}

// Negotiation response removed.

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
