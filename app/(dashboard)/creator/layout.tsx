// Signed-in and auth pages depend on the request (cookies, Supabase), so render them per request rather than at build time
export const dynamic = 'force-dynamic'

import CreatorNavbar from '@/app/components/CreatorNavbar'

export default function CreatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-[#F0F9FF]">
            <CreatorNavbar />
            {children}
        </main>
    )
}
