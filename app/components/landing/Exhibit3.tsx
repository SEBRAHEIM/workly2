'use client'

import { useCallback, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useScrollVar } from './useScrollVar'
import { Screen, SiteFashion, SiteHotel, SitePortfolio, SiteRestaurant, SiteStore, showcase } from './Mockups'
import { WorklyLogo } from './Logo'

const N = showcase.length
const STEP = 360 / N

/* WORLD 5 — Interactive 3D gallery. A ring of live designs that turns with the scroll. */
export function Gallery() {
    const wrap = useRef<HTMLElement>(null)
    const [scrollIdx, setScrollIdx] = useState(0)
    const [offset, setOffset] = useState(0)
    const onProgress = useCallback((p: number) => {
        const i = Math.round(p * (N - 1))
        setScrollIdx((prev) => (prev === i ? prev : i))
    }, [])
    useScrollVar(wrap, 'sticky', onProgress)

    const current = showcase[(((scrollIdx + offset) % N) + N) % N]

    return (
        <section ref={wrap} id="gallery" className="relative -mt-12 h-[320vh] rounded-t-[40px] bg-black text-white motion-reduce:h-auto md:-mt-16 md:rounded-t-[64px]">
            <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden rounded-t-[40px] motion-reduce:relative md:rounded-t-[64px]">
                {/* Spotlight and floor */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(255,255,255,.13),transparent_70%),radial-gradient(ellipse_70%_30%_at_50%_100%,rgba(255,255,255,.06),transparent_70%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(transparent,rgba(255,255,255,.035)),repeating-linear-gradient(90deg,rgba(255,255,255,.05)_0_1px,transparent_1px_80px)] [mask-image:linear-gradient(transparent,#000)]" />

                <div className="relative z-10 flex items-start justify-between px-4 pt-20 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.25em] text-white/50 md:px-10 md:pt-24 md:text-[11px]">
                    <span>The exhibition<br />Hall 05</span>
                    <span className="text-right">{String(N).padStart(2, '0')} concept websites<br />by Workly</span>
                </div>
                <h2 className="relative z-10 mt-4 px-4 text-center text-[clamp(1.9rem,5.4vw,4.6rem)] font-extralight uppercase leading-[0.95] tracking-[0.06em] md:mt-2">
                    One studio.<br /><span className="font-[family-name:var(--font-instrument)] normal-case italic tracking-normal">Endless</span> possibilities.
                </h2>

                {/* The ring, with the Workly mark at its centre */}
                <div className="relative flex-1 [--w:min(62vw,250px)] [perspective:1100px] md:[--w:400px] md:[perspective:1600px]">
                    {/* Floor emblem under the ring */}
                    <div className="pointer-events-none absolute bottom-[2%] left-1/2 -translate-x-1/2 text-white/[.09] [transform:translateX(-50%)_rotateX(68deg)]" aria-hidden>
                        <WorklyLogo className="landing-spin size-56 [animation-duration:60s] md:size-[26rem]" />
                    </div>
                    <div
                        className="absolute left-1/2 top-[44%] transition-transform duration-700 ease-out [transform-style:preserve-3d]"
                        style={{ transform: `translate(-50%, -50%) translateZ(calc(var(--w) * -1.7)) rotateY(calc(var(--p, 0) * ${-(N - 1) * STEP}deg + ${-offset * STEP}deg))` }}
                    >
                        {showcase.map(({ key, Site, url, dark, glow }, i) => (
                            <div
                                key={key}
                                className="absolute left-1/2 top-1/2 w-[var(--w)] [backface-visibility:hidden]"
                                style={{ transform: `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(calc(var(--w) * 1.7))` }}
                            >
                                <div className="[-webkit-box-reflect:below_10px_linear-gradient(transparent_55%,rgba(255,255,255,.22))]">
                                    <Screen url={url} dark={dark} className="aspect-[16/10] rounded-[12px]" >
                                        <Site />
                                    </Screen>
                                </div>
                                <span className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: glow }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Caption and manual controls (touch-friendly, and the way to browse with reduced motion) */}
                <div className="relative z-10 flex items-end justify-between gap-4 px-4 pb-8 md:px-10 md:pb-10">
                    <div className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em]">
                        <span className="text-white/40">{String(showcase.indexOf(current) + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
                        <p className="mt-1 text-[13px] normal-case tracking-normal text-white md:text-base">{current.label} <span className="text-white/40">· {current.brand}</span></p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setOffset((o) => o - 1)} aria-label="Previous design" className="grid size-11 place-items-center rounded-full ring-1 ring-white/25 transition-colors hover:bg-white hover:text-black"><ArrowLeft size={16} /></button>
                        <button onClick={() => setOffset((o) => o + 1)} aria-label="Next design" className="grid size-11 place-items-center rounded-full ring-1 ring-white/25 transition-colors hover:bg-white hover:text-black"><ArrowRight size={16} /></button>
                    </div>
                </div>
            </div>
        </section>
    )
}

function Stamp({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    return (
        <div className={`absolute p-[9px] drop-shadow-[0_18px_22px_rgba(0,0,0,.55)] ${className}`} style={style}>
            <div className="stamp-paper absolute inset-0" />
            <div className="relative overflow-hidden grayscale contrast-[1.12]">{children}</div>
        </div>
    )
}

function Seal({ color, className = '', glyph }: { color: [string, string, string]; className?: string; glyph: React.ReactNode }) {
    return (
        <div
            className={`absolute z-10 grid size-14 place-items-center md:size-20 ${className}`}
            style={{
                borderRadius: '47% 53% 50% 50% / 52% 46% 54% 48%',
                background: `radial-gradient(circle at 34% 30%, ${color[0]}, ${color[1]} 55%, ${color[2]})`,
                boxShadow: `inset -4px -6px 10px rgba(0,0,0,.35), inset 4px 4px 8px rgba(255,255,255,.25), 0 10px 18px rgba(0,0,0,.5)`,
            }}
        >
            <div className="grid size-[72%] place-items-center rounded-full" style={{ boxShadow: `inset 2px 2px 4px rgba(0,0,0,.35), inset -2px -2px 3px rgba(255,255,255,.2)` }}>
                <span className="opacity-70 mix-blend-multiply">{glyph}</span>
            </div>
        </div>
    )
}

const steps = [
    ['Discover', 'Explore what we build and how we work.'],
    ['Request', 'Tell us about the website you need.'],
    ['Consult', 'We review the idea and agree the scope.'],
    ['Quote', 'A proposal with the work, cost and timeline.'],
    ['Build', 'We design and develop every page.'],
    ['Deliver', 'Tested, polished and handed over.'],
    ['Support', 'Updates and improvements when you need them.'],
]

/* WORLD 6 — Bold collage campaign. Black sand, a yellow bar, postage stamps and wax seals. */
export function Collage() {
    const sec = useRef<HTMLElement>(null)
    useScrollVar(sec, 'pass')
    const fly = (x: number, y: number, r: number, rest: number) => ({
        transform: `translate(calc((1 - min(1, var(--p, 1) * 2.4)) * ${x}px), calc((1 - min(1, var(--p, 1) * 2.4)) * ${y}px)) rotate(calc(${rest}deg + (1 - min(1, var(--p, 1) * 2.4)) * ${r}deg))`,
    })

    return (
        <section ref={sec} id="process" className="sand relative scroll-mt-16 overflow-hidden bg-[#0d0d0d] pb-6 pt-20 text-[#f2efe8] md:pb-10 md:pt-28">
            <div className="relative mx-auto max-w-[1300px] px-4 md:px-10">
                <div className="flex items-start justify-between text-[10px] uppercase leading-[1.15] tracking-[0.18em] text-[#f2efe8]/80 md:text-xs">
                    <span>Workly<br />Creative<br />Studio</span>
                    <span className="rounded-full bg-[#f2efe8]/10 px-3 py-1.5 tracking-normal">Campaign 06</span>
                </div>

                {/* Headline: English line over a heavy yellow bar, Arabic set large beside it */}
                <div className="mt-10 grid items-end gap-2 md:mt-14 md:grid-cols-[1.4fr_1fr]">
                    <p className="order-1 text-right font-[family-name:var(--font-kufi)] text-[clamp(4rem,16vw,11rem)] font-bold leading-[0.8] text-[#f5b52e] md:order-2" dir="rtl" lang="ar">رؤيتك</p>
                    <div className="order-2 md:order-1">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#f5b52e] md:text-sm">Websites we&apos;re <b className="italic">falling in love</b> with</p>
                        <div className="mt-2 bg-[#f5b52e] px-3 py-2 font-[family-name:var(--font-anton)] text-[clamp(1.6rem,4.6vw,3.6rem)] uppercase leading-none text-[#0d0d0d]">Your vision. Our creation.</div>
                        <p className="mt-2 font-[family-name:var(--font-kufi)] text-[clamp(1.6rem,4vw,2.8rem)] font-bold text-[#f5b52e]" dir="rtl" lang="ar">إبداعنا</p>
                    </div>
                </div>

                {/* Stamp collage */}
                <div className="relative mx-auto mt-10 h-[540px] w-full max-w-[560px] md:mt-6 md:h-[640px]">
                    <Stamp className="left-[4%] top-[2%] w-[52%]" style={fly(-260, -120, -40, -6)}>
                        <Screen className="aspect-[4/3]"><SiteHotel /></Screen>
                    </Stamp>
                    <Stamp className="left-[50%] top-[9%] w-[44%]" style={fly(240, -160, 35, 5)}>
                        <Screen className="aspect-[4/5]"><SiteRestaurant /></Screen>
                    </Stamp>
                    <Stamp className="left-[0%] top-[40%] w-[46%]" style={fly(-300, 60, 30, 3)}>
                        <Screen className="aspect-[4/5]"><SitePortfolio /></Screen>
                    </Stamp>
                    <Stamp className="left-[42%] top-[50%] w-[54%]" style={fly(280, 120, -30, -4)}>
                        <Screen className="aspect-[4/3]"><SiteStore /></Screen>
                    </Stamp>
                    <Stamp className="left-[16%] top-[74%] w-[50%]" style={fly(-120, 240, 25, 2)}>
                        <Screen className="aspect-[16/9]"><SiteFashion /></Screen>
                    </Stamp>
                    <Seal className="left-[30%] top-[0%]" color={['#d8e07a', '#9aa52c', '#5f6814']} glyph={<WorklyLogo className="size-8 text-[#3d430c] md:size-11" />} />
                    <Seal className="left-[58%] top-[-3%]" color={['#ffb06b', '#e8641f', '#93360a']} glyph={<svg width="22" height="22" viewBox="0 0 24 24" fill="#6b2405"><path d="M12 2l2.6 6.9L22 9.3l-5.7 4.6 2 7.1L12 17l-6.3 4 2-7.1L2 9.3l7.4-.4z" /></svg>} />
                    <Seal className="left-[47%] top-[10%]" color={['#e0605e', '#a31f22', '#5b0d10']} glyph={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a0a0c" strokeWidth="2.6" strokeLinecap="round"><path d="M5 19L19 5M9 5h10v10" /></svg>} />
                </div>

                <div className="mt-6 flex items-center justify-between text-[10px] uppercase leading-[1.15] tracking-[0.15em] text-[#f2efe8]/80 md:text-xs">
                    <span>Concept work<br />for every industry</span>
                    <a href="#contact" aria-label="Start a project" className="grid h-9 w-16 place-items-center rounded-[50%] border border-[#f2efe8]/70 transition-colors hover:bg-[#f5b52e] hover:text-black"><ArrowRight size={16} /></a>
                    <span className="text-right">The season&apos;s<br />websites</span>
                </div>

                {/* Process as perforated tickets */}
                <div className="mt-24 flex items-end justify-between gap-4 md:mt-32">
                    <h3 className="font-[family-name:var(--font-anton)] text-[clamp(2.6rem,8vw,6rem)] uppercase leading-[0.85]">How it<br /><span className="text-[#f5b52e]">works</span></h3>
                    <p className="font-[family-name:var(--font-kufi)] text-3xl font-bold text-[#f5b52e] md:text-5xl" dir="rtl" lang="ar">كيف نعمل</p>
                </div>
                <ol className="-mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-7 md:overflow-visible md:px-0">
                    {steps.map(([t, d], i) => (
                        <li key={t} className={`ticket w-[200px] shrink-0 snap-start bg-[#f2efe8] px-5 py-5 text-[#0d0d0d] transition-transform duration-300 hover:-translate-y-1 md:w-auto ${i % 2 ? 'md:rotate-[1.5deg]' : 'md:-rotate-[1.5deg]'}`}>
                            <span className="font-[family-name:var(--font-anton)] text-5xl leading-none">{String(i + 1).padStart(2, '0')}</span>
                            <div className="my-3 border-t-2 border-dashed border-[#0d0d0d]/25" />
                            <p className="font-[family-name:var(--font-anton)] text-xl uppercase leading-none">{t}</p>
                            <p className="mt-2 text-[12px] leading-snug text-[#0d0d0d]/70">{d}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}

/* Transition 6 → 7: an admission ticket for "your turn" straightens, grows, then floods the page yellow */
export function YellowTransition() {
    const wrap = useRef<HTMLElement>(null)
    const onProgress = useCallback((p: number) => {
        const el = wrap.current
        if (!el) return
        el.style.setProperty('--y', Math.min(1, Math.max(0, (p - 0.05) / 0.6)).toFixed(3))
        el.style.setProperty('--f', Math.min(1, Math.max(0, (p - 0.68) / 0.3)).toFixed(3))
    }, [])
    useScrollVar(wrap, 'sticky', onProgress)

    return (
        <section ref={wrap} className="sand relative h-[200vh] bg-[#0d0d0d] motion-reduce:h-auto">
            <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden motion-reduce:relative">
                {/* The ticket */}
                <div
                    className="relative z-10 w-[min(90vw,1060px)] drop-shadow-[0_30px_40px_rgba(0,0,0,.6)]"
                    style={{ transform: 'rotate(calc(-8deg * (1 - var(--y, 1)))) scale(calc(.78 + .3 * var(--y, 1)))' }}
                >
                    {/* masking tape */}
                    <span className="absolute -left-4 -top-3 z-20 h-8 w-28 -rotate-[28deg] bg-[#f2efe8]/70 md:h-10 md:w-36" />
                    <span className="absolute -bottom-3 -right-4 z-20 h-8 w-28 -rotate-[28deg] bg-[#f2efe8]/70 md:h-10 md:w-36" />

                    <div className="ticket grid grid-cols-[1fr_auto] bg-[#f5b52e] text-[#0d0d0d]">
                        <div className="relative overflow-hidden px-6 py-6 md:px-12 md:py-9">
                            <div className="flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.25em] md:text-xs">
                                <span>Workly · Admit one</span>
                                <span className="hidden sm:inline">Nº 0007 / 2026</span>
                            </div>
                            <p className="mt-3 font-[family-name:var(--font-anton)] text-[clamp(3.6rem,13vw,10.5rem)] uppercase leading-[0.82]">
                                Your <span className="text-transparent [-webkit-text-stroke:2px_#0d0d0d] md:[-webkit-text-stroke:3px_#0d0d0d]">turn.</span>
                            </p>
                            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                                <p className="max-w-xs text-sm leading-snug md:text-base">Good for one custom website, designed and built around your idea.</p>
                                <p className="font-[family-name:var(--font-kufi)] text-3xl font-bold md:text-5xl" dir="rtl" lang="ar">دورك</p>
                            </div>
                            <WorklyLogo className="pointer-events-none absolute -bottom-10 right-28 w-40 rotate-12 text-[#0d0d0d]/[.07] md:right-44 md:w-64" />
                        </div>

                        {/* Stub: perforation, barcode, rotated label */}
                        <div className="relative flex w-16 flex-col items-center justify-between border-l-[3px] border-dashed border-[#0d0d0d]/35 py-5 md:w-40 md:py-8">
                            <span className="absolute -left-[13px] -top-3 size-6 rounded-full bg-[#0d0d0d]" />
                            <span className="absolute -bottom-3 -left-[13px] size-6 rounded-full bg-[#0d0d0d]" />
                            <WorklyLogo className="size-9 md:size-16" />
                            <span className="hidden font-[family-name:var(--font-anton)] text-2xl uppercase md:block">Gate W</span>
                            <span className="h-24 w-8 md:h-20 md:w-24" style={{ background: 'repeating-linear-gradient(90deg,#0d0d0d 0 2px,transparent 2px 4px,#0d0d0d 4px 7px,transparent 7px 9px,#0d0d0d 9px 10px,transparent 10px 13px)' }} />
                        </div>
                    </div>
                </div>

                {/* Flood into the yellow contact world */}
                <div className="pointer-events-none absolute inset-0 z-20 bg-[#f5b52e]" style={{ clipPath: 'circle(calc(var(--f, 0) * 150vmax) at 50% 50%)' }} />
            </div>
        </section>
    )
}
