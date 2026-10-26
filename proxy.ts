import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

const PROTECTED = ['/creator', '/client', '/hq', '/onboarding']

// Next.js 16 proxy (formerly middleware); runs on the Node.js runtime
export async function proxy(request: NextRequest) {
    try {
        return await updateSession(request)
    } catch (err) {
        // Never take the whole site down because a session refresh failed:
        // public pages still render, protected ones go to login.
        console.error('Session refresh failed:', err)
        if (PROTECTED.some((p) => request.nextUrl.pathname.startsWith(p))) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
