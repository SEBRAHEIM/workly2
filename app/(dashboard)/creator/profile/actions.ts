'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { containsContactInfo } from '@/utils/content-safety'

// Update Basic Profile (Identity + Specializations)
export async function updateCreatorProfile(formData: FormData) {
    return { error: 'Please use specific update actions: updateCreatorIdentity or updateCreatorSpecializations' }
}

export async function updateCreatorIdentity(formData: FormData) {
    const supabase = await createClient()
    const bio = formData.get('bio') as string
    const displayName = formData.get('displayName') as string
    const fullName = formData.get('fullName') as string
    const username = formData.get('username') as string
    const tagline = formData.get('tagline') as string

    const languages = formData.getAll('languages') as string[]

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Content Moderation
    const bioCheck = containsContactInfo(bio)
    const taglineCheck = containsContactInfo(tagline)

    if (bioCheck.hasContactInfo || taglineCheck.hasContactInfo) {
        return { error: `Validation failed: ${bioCheck.reason || taglineCheck.reason}. Sharing contact info is strictly prohibited.` }
    }

    console.log('[SMS DEBUG] Updating profile for user:', user.id)

    const { error } = await supabase
        .from('profiles')
        .update({
            bio,
            display_name: displayName,
            full_name: fullName,
            username: username,
            tagline: tagline,
            languages: languages
        })
        .eq('id', user.id)

    if (error) {
        console.error('[SMS DEBUG] Update error:', error)
        return { error: error.message }
    }

    console.log('[SMS DEBUG] Successfully updated profile')
    console.log('[SMS DEBUG] Service Role Key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    revalidatePath('/creator/profile')
    // Specifically revalidate the paths where this creator's details are shown
    revalidatePath(`/client/creator/${user.id}`)
    revalidatePath(`/client/hire/${user.id}`)

    // Pattern fallback
    revalidatePath('/client/creator/[creatorId]', 'layout')
    revalidatePath('/client/hire/[creatorId]', 'layout')

    return { success: true }
}

export async function updateCreatorSpecializations(formData: FormData) {
    const supabase = await createClient()
    const specializations = formData.getAll('specializations') as string[]

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('profiles')
        .update({ specializations })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/creator/profile')
    return { success: true }
}

// Upload Portfolio Item
export async function uploadPortfolioItem(prevState: any, formData: FormData) {
    try {
        const supabase = await createClient()

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const categorySlug = formData.get('categorySlug') as string
        const file = formData.get('image') as File

        if (!file || file.size === 0) {
            return { error: 'Please select an image to upload.' }
        }

        // Limit file size to 10MB to prevent server-side timeout/memory issues
        if (file.size > 10 * 1024 * 1024) {
            return { error: 'File is too large. Maximum size is 10MB.' }
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { error: 'You must be logged in to upload portfolio items.' }
        }

        // 1. Upload File to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { error: uploadError } = await supabase
            .storage
            .from('portfolio')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Portfolio Upload Storage Error:', uploadError)
            return { error: `Storage error: ${uploadError.message}` }
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('portfolio')
            .getPublicUrl(fileName)

        // 3. Insert Record
        const descCheck = containsContactInfo(description)
        if (descCheck.hasContactInfo) {
            return { error: `Description validation failed: ${descCheck.reason}. Contact info is not allowed in portfolio items.` }
        }

        const { error: dbError } = await supabase
            .from('portfolio_items')
            .insert({
                creator_id: user.id,
                category_slug: categorySlug,
                title,
                description,
                image_url: publicUrl
            })

        if (dbError) {
            console.error('Portfolio Upload Database Error:', dbError)
            return { error: `Database error: ${dbError.message}` }
        }

        revalidatePath('/creator/profile')
        return { success: true, error: '' }
    } catch (e: any) {
        console.error('Portfolio Upload Fatal Error:', e)
        return { error: e.message || 'An unexpected error occurred during upload.' }
    }
}

// Delete Portfolio Item
export async function deletePortfolioItem(itemId: string) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'Unauthorized' }

        // 1. Get the item to find the image URL
        const { data: item, error: fetchError } = await supabase
            .from('portfolio_items')
            .select('image_url, creator_id')
            .eq('id', itemId)
            .single()

        if (fetchError || !item) {
            return { error: 'Item not found.' }
        }

        if (item.creator_id !== user.id) {
            return { error: 'You do not have permission to delete this item.' }
        }

        // 2. Extract storage path from public URL
        // URL format: .../storage/v1/object/public/portfolio/USER_ID/FILENAME
        const urlParts = item.image_url.split('/portfolio/')
        if (urlParts.length > 1) {
            const storagePath = urlParts[1]

            // 3. Delete from Storage
            const { error: storageError } = await supabase
                .storage
                .from('portfolio')
                .remove([storagePath])

            if (storageError) {
                console.error('Storage deletion error:', storageError)
                // We'll continue even if storage delete fails to keep DB clean
            }
        }

        // 4. Delete from Database
        const { error: dbError } = await supabase
            .from('portfolio_items')
            .delete()
            .eq('id', itemId)
            .eq('creator_id', user.id)

        if (dbError) {
            return { error: `Database error: ${dbError.message}` }
        }

        revalidatePath('/creator/profile')
        return { success: true }
    } catch (e: any) {
        console.error('Portfolio Deletion Fatal Error:', e)
        return { error: e.message || 'An unexpected error occurred.' }
    }
}

// Update Creator Pricing
export async function updateCreatorPricing(formData: FormData) {
    const supabase = await createClient()

    // Extract Data
    const categorySlug = formData.get('categorySlug') as string
    const pricingMode = formData.get('pricingMode') as string
    const basePrice = parseInt(formData.get('basePrice') as string) || 0
    const servicePackagesStr = formData.get('servicePackages') as string

    // Validate Mode
    if (!['fixed', 'packages'].includes(pricingMode)) {
        return { error: 'Invalid pricing mode.' }
    }

    let servicePackages: Record<string, any> = {}
    try {
        servicePackages = JSON.parse(servicePackagesStr)
        // Content Moderation
        for (const [key, pkg] of Object.entries(servicePackages)) {
            const titleCheck = containsContactInfo(pkg.title)
            const descCheck = containsContactInfo(pkg.description)
            if (titleCheck.hasContactInfo || descCheck.hasContactInfo) {
                return { error: `Contact info detected in ${key} package. Sharing contact info is strictly prohibited.` }
            }
        }
    } catch (e) {
        return { error: 'Invalid packages data.' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    if (categorySlug) {
        // PER-CATEGORY UPDATE
        const { error } = await supabase
            .from('creator_services')
            .upsert({
                creator_id: user.id,
                category_slug: categorySlug,
                pricing_mode: pricingMode,
                base_price: basePrice,
                service_packages: servicePackages,
                currency: 'AED',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'creator_id, category_slug'
            })

        if (error) {
            console.error('Update Service Error:', error)
            return { error: error.message }
        }
    } else {
        // LEGACY / DEFAULT UPDATE (Fallback to Profile)
        const { error } = await supabase
            .from('profiles')
            .update({
                pricing_mode: pricingMode,
                base_price: basePrice,
                service_packages: servicePackages
            })
            .eq('id', user.id)

        if (error) {
            console.error('Update Pricing Error:', error)
            return { error: error.message }
        }
    }

    revalidatePath('/creator/profile')
    return { success: true }
}
