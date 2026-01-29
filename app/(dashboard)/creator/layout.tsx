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
