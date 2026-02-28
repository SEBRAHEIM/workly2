import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    // Always use the production site URL to ensure cookies are set on the correct domain
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Success: Redirect to the intended page
            const redirectUrl = new URL(next, siteUrl)
            return NextResponse.redirect(redirectUrl)
        }

        // Error exchanging code: Log and redirect to login with error
        console.error('[AUTH CALLBACK] Code exchange error:', error)
        return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent(error.message)}`)
    }

    // No code: Redirect to login
    return NextResponse.redirect(`${siteUrl}/login?error=Invalid session link`)
}
