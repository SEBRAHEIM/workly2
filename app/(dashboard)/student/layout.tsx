import StudentNavbar from '@/app/components/StudentNavbar'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-[#F3F0E9] pt-24 md:pt-32">
            <StudentNavbar />
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {children}
            </div>
        </main>
    )
}
