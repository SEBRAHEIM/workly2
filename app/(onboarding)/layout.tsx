// Signed-in and auth pages depend on the request (cookies, Supabase), so render them per request rather than at build time
export const dynamic = 'force-dynamic'

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>{children}</>
    )
}
