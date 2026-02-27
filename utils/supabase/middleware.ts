import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes pattern
    const isCreatorRoute = request.nextUrl.pathname.startsWith('/creator')
    const isClientRoute = request.nextUrl.pathname.startsWith('/client')
    const isHqRoute = request.nextUrl.pathname.startsWith('/hq')
    const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding')
    const isProtectedRoute = isCreatorRoute || isClientRoute || isHqRoute || isOnboardingRoute

    if (!user && isProtectedRoute) {
        // no user, redirect to login
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // Role-based redirection for authenticated users
    if (user && isProtectedRoute) {
        // Fetch profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role

        // 1. If no profile exists, send to onboarding (unless already there)
        if (!profile && !isOnboardingRoute) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // 2. HQ is strictly for Admins
        if (isHqRoute && role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // 3. Admin visiting Creator or Client dashboard -> Redirect to /hq
        if ((isCreatorRoute || isClientRoute) && role === 'admin') {
            return NextResponse.redirect(new URL('/hq', request.url))
        }

        // 4. Creator dashboard is for Creators ONLY
        if (isCreatorRoute && role !== 'creator') {
            if (role === 'client') return NextResponse.redirect(new URL('/client', request.url))
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // 5. Client dashboard is for Clients ONLY
        if (isClientRoute && role !== 'client') {
            if (role === 'creator') return NextResponse.redirect(new URL('/creator', request.url))
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    return supabaseResponse
}
