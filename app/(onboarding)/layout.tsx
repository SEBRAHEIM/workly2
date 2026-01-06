export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gray-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">{children}</div>
        </div>
    )
}
