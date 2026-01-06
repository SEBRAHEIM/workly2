import StudentNavbar from '@/app/components/StudentNavbar'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-[#F3F0E9]">
            <StudentNavbar />
            {children}
        </main>
    )
}
