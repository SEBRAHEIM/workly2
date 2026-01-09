'use server'

import { getStripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function connectStripeAccount(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // 1. Create a Stripe Express Account
    const account = await getStripe().accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
    })

    // 2. Save the account ID to Supabase
    const { error } = await supabase
        .from('profiles')
        .update({ stripe_account_id: account.id })
        .eq('id', user.id)

    if (error) {
        console.error('Error saving Stripe Account ID:', error)
        return { error: 'Failed to save account ID' }
    }

    // 3. Create an Account Link for onboarding
    const accountLink = await getStripe().accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/creator/wallet/connect`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/creator/wallet`,
        type: 'account_onboarding',
    })

    redirect(accountLink.url)
}
