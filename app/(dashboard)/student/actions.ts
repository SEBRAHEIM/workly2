'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { createNotification } from '@/utils/notifications'
// import { sendEmail } from '@/utils/send-email' // Keep disabled for now/static

import { containsContactInfo } from '@/utils/content-safety'
import { notifyCreatorOfNewHire } from '@/utils/sms'
import { getStripe } from '@/utils/stripe'

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
    const dueDateStr = formData.get('dueDate') as string

    if (!dueDateStr) {
        return { message: 'A due date is required.' }
    }

    const dueDate = new Date(dueDateStr)
    if (isNaN(dueDate.getTime()) || dueDate < new Date()) {
        return { message: 'Invalid or past due date.' }
    }

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

    // 5. Calculate Initial Price, Revisions & Turnaround
    let initialPrice = 0
    let totalRevisions = 0
    let revisionTurnaround = 2
    if (service) {
        if (pricingType === 'fixed') {
            initialPrice = service.base_price || 0
            totalRevisions = 1 // Default for fixed
            revisionTurnaround = 2
        } else if (pricingType === 'packages' && packageTier) {
            const pkg = service.service_packages?.[packageTier]
            if (pkg) {
                initialPrice = pkg.price || 0
                totalRevisions = pkg.revisions || 0
                revisionTurnaround = pkg.turnaround || 2
            }
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
            commission_rate: 0.20,
            current_terms: {
                category: categorySlug,
                tier: packageTier || null
            },
            file_url: mainFileUrl,
            file_urls: finalFileUrls,
            waiting_on: null, // No negotiation waiting state
            due_date: dueDate.toISOString(),
            revisions_total: totalRevisions,
            revisions_used: 0,
            revision_turnaround: revisionTurnaround
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
                supabase.from('project_events').insert({
                    project_id: data.id,
                    type: 'accepted',
                    actor_id: user.id,
                    payload: { price: initialPrice, notes: `Project created and awaiting initial payment. Due: ${dueDate.toISOString()}` }
                })
            ])
        } catch (postError) {
            console.error('Error in background tasks:', postError)
        }
    })

    // 8. Create Stripe Checkout Session (Immediate Redirect)
    if (initialPrice <= 0) {
        return redirect(`/student/projects/${data.id}`)
    }

    let sessionUrl: string | null = null
    try {
        sessionUrl = await createProjectStripeSession(
            data.id,
            title,
            initialPrice,
            user.email!
        )
    } catch (stripeError: any) {
        console.error('[CREATE PROJECT] Stripe Exception:', stripeError)
        const errorMessage = stripeError instanceof Error ? stripeError.message : String(stripeError)
        return {
            message: `Payment initialization failed: ${errorMessage}. Your request was saved, but it's hidden until paid. Please check your projects.`
        }
    }

    if (sessionUrl) {
        redirect(sessionUrl)
    }
}

export async function createProjectStripeSession(projectId: string, title: string, price: number, customerEmail: string) {
    const baseUrl = 'https://workly.day'

    if (price <= 0) {
        throw new Error('Invalid price for payment')
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Payment configuration missing (API Key)')
    }

    const session = await getStripe().checkout.sessions.create({
        customer_email: customerEmail,
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'aed',
                    product_data: {
                        name: title,
                        description: `Payment for project: ${title}`,
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: 1,
            },
        ],
        metadata: {
            projectId: projectId,
        },
        mode: 'payment',
        success_url: `${baseUrl}/student/projects/${projectId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/student/projects/${projectId}?payment=cancelled`,
    })

    return session.url
}

export async function payProject(prevState: any, formData: FormData) {
    const projectId = formData.get('projectId') as string
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('student_id', user.id)
        .single()

    if (error || !project) {
        return { message: 'Project not found' }
    }

    if (project.funds_status === 'escrow') {
        return { message: 'Project is already paid' }
    }

    let sessionUrl: string | null = null
    try {
        sessionUrl = await createProjectStripeSession(
            project.id,
            project.title,
            project.current_price,
            user.email!
        )
    } catch (err: any) {
        console.error('Pay project error:', err)
        return { message: err.message || 'Payment initialization failed' }
    }

    if (sessionUrl) {
        redirect(sessionUrl)
    } else {
        return { message: 'Failed to create payment session' }
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
