// Signed-in and auth pages depend on the request (cookies, Supabase), so render them per request rather than at build time
export const dynamic = 'force-dynamic'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="w-full max-w-md px-8">{children}</div>
        </div>
    )
}
