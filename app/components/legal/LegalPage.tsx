import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { WorklyLogo } from '../landing/Logo'
import { landingFonts } from '../landing/fonts'

export type LegalSection = { title: string; content: string; bullets?: string[] }

// Shared layout for Privacy and Terms, in the homepage's editorial style
export default function LegalPage({ kicker, title, accent, intro, sections, updated }: {
    kicker: string
    title: string
    accent: string
    intro: string
    sections: LegalSection[]
    updated: string
}) {
    return (
        <main className={`${landingFonts} min-h-screen bg-white font-[family-name:var(--font-inter)] text-[#0e0e0e]`}>
            <header className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-6 md:px-10">
                <Link href="/" aria-label="Workly home" className="group">
                    <WorklyLogo className="size-10 transition-transform duration-700 group-hover:rotate-[360deg]" />
                </Link>
                <Link href="/" className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] ring-1 ring-black/10 transition-colors hover:bg-[#0e0e0e] hover:text-white">
                    <ArrowLeft size={14} /> Back to Workly
                </Link>
            </header>

            <section className="mx-auto max-w-[1100px] px-4 pb-14 pt-10 md:px-10 md:pt-20">
                <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.3em] text-black/45">{kicker}</p>
                <h1 className="mt-5 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
                    {title}<br /><span className="font-[family-name:var(--font-instrument)] font-normal italic tracking-[-0.02em]">{accent}</span>
                </h1>
                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-black pt-5 md:flex-row">
                    <p className="max-w-md text-[15px] leading-relaxed text-black/65">{intro}</p>
                    <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-black/45">Last updated · {updated}</p>
                </div>
            </section>

            <ol className="mx-auto max-w-[1100px] px-4 pb-24 md:px-10">
                {sections.map((s, i) => (
                    <li key={s.title} className="grid gap-4 border-t border-black/15 py-10 md:grid-cols-[6rem_1fr_1.4fr] md:gap-8">
                        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-black/40">{String(i + 1).padStart(2, '0')}</span>
                        <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1] tracking-[-0.04em]">{s.title}</h2>
                        <div>
                            <p className="text-[15px] leading-relaxed text-black/70">{s.content}</p>
                            {s.bullets && (
                                <ul className="mt-5 space-y-3">
                                    {s.bullets.map((b) => {
                                        const [head, ...rest] = b.split(': ')
                                        return (
                                            <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-black/70">
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#5bbcf0]" />
                                                <span>{rest.length ? <><b className="font-semibold text-[#0e0e0e]">{head}.</b> {rest.join(': ')}</> : b}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    </li>
                ))}
            </ol>

            <footer className="bg-[#0d0d0d] px-4 py-10 text-[#f2efe8] md:px-10">
                <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <p className="text-[clamp(1.4rem,3vw,2.2rem)] font-semibold leading-none tracking-[-0.04em]">Questions? <span className="font-[family-name:var(--font-instrument)] font-normal italic">Ask us.</span></p>
                    <div className="flex gap-6 text-sm text-[#f2efe8]/70">
                        <Link href="/privacy" className="hover:text-[#f5b52e]">Privacy</Link>
                        <Link href="/terms" className="hover:text-[#f5b52e]">Terms</Link>
                        <Link href="/#contact" className="hover:text-[#f5b52e]">Contact</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
