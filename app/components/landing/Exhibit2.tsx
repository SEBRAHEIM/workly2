'use client'

import { useCallback, useId, useRef, useState } from 'react'
import { useScrollVar } from './useScrollVar'
import { Screen, SiteAgency, showcase } from './Mockups'
import { WorklyLogo } from './Logo'

const ramp = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)))

const index = [
    ['E-commerce', 'stores'], ['Fashion &', 'luxury'], ['Restaurants &', 'hospitality'], ['Corporate &', 'business'],
    ['Portfolio', 'sites'], ['Creative', 'agencies'], ['Booking &', 'services'], ['Custom', 'interactive'],
] as const
// Index rows map onto the showcase designs (restaurant and hotel share "hospitality")
const rowSite = ['store', 'luxury', 'hotel', 'corporate', 'portfolio', 'agency', 'booking', 'interactive']

/* WORLD 3 — Experimental editorial. White page, oversized mixed type, an index of what we make. */
export function Editorial() {
    const [active, setActive] = useState<number | null>(null)
    const hover = useRef<HTMLDivElement>(null)

    const follow = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse' || !hover.current) return
        hover.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px)`
    }

    const activeItem = active === null ? null : showcase.find((s) => s.key === rowSite[active])

    return (
        <section id="work" className="relative scroll-mt-16 bg-white px-4 pb-10 pt-16 text-[#0e0e0e] md:px-10 md:pt-24">
            <div className="mx-auto grid max-w-[1300px] gap-8 md:grid-cols-[1.6fr_1fr] md:items-end">
                <h2 className="text-[clamp(3rem,10vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
                    Not just<br />another <span className="font-[family-name:var(--font-instrument)] font-normal italic tracking-[-0.02em]">website.</span>
                </h2>
                <p className="max-w-xs text-[15px] leading-relaxed text-black/70 md:justify-self-end md:pb-4">
                    Every Workly project starts on a blank page. No templates, no themes, no two alike. Here is what we make.
                </p>
            </div>

            <ol className="mx-auto mt-14 max-w-[1300px] border-t border-black md:mt-20" onPointerMove={follow} onPointerLeave={() => setActive(null)}>
                {index.map(([a, b], i) => {
                    const item = showcase.find((s) => s.key === rowSite[i])!
                    return (
                        <li
                            key={a + b}
                            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                            className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-3 border-b border-black/15 py-4 transition-colors md:grid-cols-[4rem_1fr_auto] md:py-5 md:hover:bg-[#0e0e0e] md:hover:text-white"
                        >
                            <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-black/40 transition-colors md:pl-3 md:group-hover:text-white/50">{String(i + 1).padStart(2, '0')}</span>
                            <span className="text-[clamp(1.6rem,5.2vw,4.4rem)] font-semibold leading-none tracking-[-0.045em] transition-transform duration-500 md:group-hover:translate-x-4">
                                {a} <span className="font-[family-name:var(--font-instrument)] font-normal italic tracking-[-0.01em]">{b}</span>
                            </span>
                            <span className="flex items-center gap-3 md:pr-3">
                                <span className="hidden font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-black/40 md:inline md:group-hover:text-white/60">{item.brand}</span>
                                {/* Phones see each design inline */}
                                <Screen dark={item.dark} className="aspect-[16/10] w-24 rounded-md shadow-sm md:hidden"><item.Site /></Screen>
                            </span>
                        </li>
                    )
                })}
            </ol>

            {/* Desktop: the design for the hovered row follows the cursor */}
            <div ref={hover} className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block" aria-hidden>
                <div className={`w-[340px] transition-[opacity,scale] duration-300 ${activeItem ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    {activeItem && (
                        <Screen url={activeItem.url} dark={activeItem.dark} className="aspect-[16/10] rounded-xl shadow-[0_30px_60px_-20px_rgba(0,0,0,.4)]">
                            <activeItem.Site />
                        </Screen>
                    )}
                </div>
            </div>
        </section>
    )
}

/* Transition 3 → 4: the full stop grows into the green studio world */
export function DotTransition() {
    const wrap = useRef<HTMLElement>(null)
    const onProgress = useCallback((p: number) => {
        wrap.current?.style.setProperty('--g', ramp(p, 0.1, 0.85).toFixed(3))
    }, [])
    useScrollVar(wrap, 'sticky', onProgress)

    return (
        <section ref={wrap} className="relative h-[170vh] bg-white motion-reduce:h-auto">
            <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden motion-reduce:relative">
                {/* Soft editorial gradient band */}
                <div className="pointer-events-none absolute inset-x-[-10%] top-[30%] h-[45%] bg-[radial-gradient(ellipse_at_30%_50%,#ffb38a_0%,transparent_55%),radial-gradient(ellipse_at_60%_50%,#ff7eb6_0%,transparent_55%),radial-gradient(ellipse_at_85%_50%,#ffe08a_0%,transparent_55%)] opacity-60 blur-3xl" />
                <p className="relative -translate-y-[10svh] px-4 text-center text-[clamp(3rem,11vw,10rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#0e0e0e]">
                    Different<br /><span className="font-[family-name:var(--font-instrument)] font-normal italic">by design</span>
                </p>
                <div className="absolute left-1/2 top-[84%] z-10 -translate-x-1/2 -translate-y-1/2 text-[#0e0e0e]" style={{ opacity: 'calc(1 - var(--g, 0) * 3)' }}>
                    <WorklyLogo className="size-16 md:size-20" />
                </div>
                <div
                    className="absolute inset-0 bg-[#5bbcf0]"
                    style={{ clipPath: 'circle(calc(var(--g, 0) * 150vmax) at 50% 84%)' }}
                >
                    <div className="grid h-full place-items-center" style={{ opacity: 'calc(var(--g, 0) * 2 - 1)' }}>
                        <StudioMark />
                    </div>
                </div>
            </div>
        </section>
    )
}

/* Rotating circular text around the Workly mark, set in English and Arabic */
function StudioMark({ size = 'size-[260px] md:size-[340px]' }: { size?: string }) {
    const id = useId()
    return (
        <div className={`relative ${size}`}>
            <svg viewBox="0 0 200 200" className="landing-spin absolute inset-0 h-full w-full [animation-duration:30s]">
                <defs><path id={`${id}-en`} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
                <text fill="#0b2540" fontSize="10.5" className="font-[family-name:var(--font-unbounded)] uppercase">
                    <textPath href={`#${id}-en`} textLength="486" lengthAdjust="spacing">Websites · Stores · Apps · Made by Workly ·</textPath>
                </text>
            </svg>
            <WorklyLogo className="absolute inset-[29%] text-[#ffffff]" />
        </div>
    )
}

// Hand-tuned topographic contour lines (deterministic, so server and client match)
function Contours() {
    const rings = Array.from({ length: 16 }, (_, k) => {
        const r = 40 + k * 46
        const pts = Array.from({ length: 48 }, (_, i) => {
            const t = (i / 48) * Math.PI * 2
            const wob = 1 + 0.06 * Math.sin(3 * t + k) + 0.04 * Math.sin(5 * t - k * 0.7) + 0.03 * Math.cos(7 * t + k * 1.3)
            return `${(700 + Math.cos(t) * r * wob * 1.25).toFixed(1)},${(380 + Math.sin(t) * r * wob).toFixed(1)}`
        })
        return `M${pts.join('L')}Z`
    })
    return (
        <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {rings.map((d, i) => <path key={i} d={d} fill="none" stroke="#9ad8f8" strokeWidth="1.2" opacity={0.55 - i * 0.02} />)}
        </svg>
    )
}

const services = [
    { name: 'Website design & development', note: 'Responsive sites built around your goals', shape: 'rounded-tl-full' },
    { name: 'E-commerce stores', note: 'Products, orders and payments online', shape: 'rounded-full' },
    { name: 'Business websites', note: 'Restaurants, tourism, services and more', shape: 'rounded-none' },
    { name: 'Custom web applications', note: 'Systems shaped to how you work', shape: 'rounded-br-full' },
    { name: 'Booking & reservations', note: 'Appointments, classes and experiences', shape: 'rounded-t-full' },
    { name: 'Admin dashboards', note: 'Run content, stock and customers yourself', shape: 'rounded-l-full' },
    { name: 'Maintenance & upgrades', note: 'Updates and new features for existing sites', shape: 'rounded-tr-full' },
]

/* WORLD 4 — Creative graphic studio. Green, lime and cream; contour lines; geometric type. */
export function Studio() {
    return (
        <section id="services" className="relative -mt-px scroll-mt-16 overflow-hidden bg-[#5bbcf0] pb-28 pt-10 font-[family-name:var(--font-unbounded)] text-[#0b2540] md:pb-40">
            <Contours />
            {/* Oversized dark letters behind everything */}
            <WorklyLogo className="pointer-events-none absolute -right-[18vw] top-20 w-[85vw] max-w-[1100px] rotate-12 text-[#4cb0e8] md:top-0 md:w-[70vw]" />

            <div className="relative mx-auto max-w-[1300px] px-4 md:px-10">
                <div className="flex items-start justify-between">
                    <span className="inline-block bg-[#ffffff] px-4 py-2 text-[13px] font-black uppercase tracking-tight text-[#0b2540] [clip-path:polygon(0_0,82%_0,100%_38%,100%_100%,0_100%)] md:text-base">Workly studio</span>
                    <span className="text-right text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#0b2540]/60 md:text-[11px]">What we do<br />07 services</span>
                </div>

                <div className="mt-14 grid items-center gap-10 md:mt-20 md:grid-cols-[1.25fr_1fr]">
                    <h2 className="text-[clamp(2.6rem,7.5vw,6.6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
                        Made to<br /><span className="text-[#ffffff]">stand</span><br />out.
                    </h2>
                    <div className="relative mx-auto md:mx-0">
                        <div className="rotate-[-4deg] transition-transform duration-500 hover:rotate-0">
                            <Screen url="orbit.studio" className="aspect-[16/10] w-[min(86vw,460px)] rounded-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,.55)]"><SiteAgency /></Screen>
                        </div>
                        <span className="absolute -bottom-5 -left-3 rounded-full bg-[#0b2540] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5bbcf0]">Concept · Creative agency</span>
                    </div>
                </div>

                <ul className="mt-20 md:mt-28">
                    {services.map((s, i) => (
                        <li key={s.name} className="group flex items-center gap-4 border-t border-dashed border-[#0b2540]/50 py-5 last:border-b md:gap-8 md:py-7">
                            <span className={`size-8 shrink-0 bg-[#ffffff] transition-transform duration-500 group-hover:rotate-90 md:size-12 ${s.shape} ${i % 3 === 1 ? 'bg-[#0b2540]' : ''}`} />
                            <span className="flex-1 text-[clamp(1.05rem,3.4vw,2.6rem)] font-bold uppercase leading-[1.05] tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2">{s.name}</span>
                            <span className="hidden max-w-[220px] font-[family-name:var(--font-geist-mono)] text-[11px] leading-snug text-[#0b2540]/60 md:block">{s.note}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-20 flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    <StudioMark size="size-[180px]" />
                    <p className="max-w-md text-center text-[clamp(1.2rem,2.6vw,1.9rem)] font-bold uppercase leading-tight tracking-tight md:text-right">
                        Not one style.<br /><span className="text-[#ffffff]">Every</span> style.
                    </p>
                </div>
            </div>
        </section>
    )
}
