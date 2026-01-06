import Link from 'next/link'

interface HeroProps {
    hideCta?: boolean
}

export default function Hero({ hideCta = false }: HeroProps) {
    return (
        <section className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#F3F0E9_45%,_#E6E2D6_100%)] opacity-100 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <p className="text-[#333333] text-sm md:text-base tracking-widest uppercase mb-4 opacity-60">
                    For Busy Uni Students
                </p>
                <h1 className="font-serif font-bold text-4xl md:text-6xl text-[#3E4C37] leading-tight mb-6 max-w-3xl">
                    University projects, <br /> done for you.
                </h1>

                {!hideCta && (
                    <Link
                        href="/join"
                        className="bg-[#564D40] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#453D32] transition-colors shadow-lg"
                    >
                        Begin now
                    </Link>
                )}
            </div>
        </section>
    )
}
