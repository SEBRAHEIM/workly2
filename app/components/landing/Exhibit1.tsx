'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { useScrollVar } from './useScrollVar'
import { Screen, SiteAgency, SiteBooking, SiteHotel, SiteLuxury, SiteStore } from './Mockups'
import { WorklyLogo } from './Logo'

const ramp = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)))

/* WORLD 1 — Cinematic. A dark stage of floating websites; the centre screen grows into world 2. */
export function Cinematic() {
    const wrap = useRef<HTMLElement>(null)
    const onProgress = useCallback((p: number) => {
        const el = wrap.current
        if (!el) return
        el.style.setProperty('--a', ramp(p, 0, 0.35).toFixed(3)) // headline lifts away
        el.style.setProperty('--e', ramp(p, 0.15, 0.8).toFixed(3)) // centre screen expands
        el.style.setProperty('--c', ramp(p, 0.42, 0.72).toFixed(3)) // screen content becomes world 2
    }, [])
    useScrollVar(wrap, 'sticky', onProgress)

    // The screens start just below the call-to-action, whatever the viewport height
    const intro = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = intro.current
        const root = wrap.current
        if (!el || !root) return
        const place = () => root.style.setProperty('--st', `${el.offsetTop + el.offsetHeight + 32}px`)
        place()
        const ro = new ResizeObserver(place)
        ro.observe(el)
        window.addEventListener('resize', place)
        return () => { ro.disconnect(); window.removeEventListener('resize', place) }
    }, [])

    const move = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.setAttribute('style', `--mx:${((e.clientX - r.left) / r.width - 0.5).toFixed(3)};--my:${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`)
    }

    const side = [
        { Site: SiteLuxury, url: 'maisonvera.com', dark: true, x: -1, glow: 'rgba(201,169,106,.35)' },
        { Site: SiteHotel, url: 'sahraretreat.ae', dark: false, x: 1, glow: 'rgba(232,140,93,.35)' },
        { Site: SiteAgency, url: 'orbit.studio', dark: false, x: -2, glow: 'rgba(255,90,31,.3)' },
        { Site: SiteStore, url: 'stride.ae', dark: false, x: 2, glow: 'rgba(198,255,61,.25)' },
    ]

    return (
        <section ref={wrap} id="top" style={{ ['--cw' as string]: 'max(220px, min(76vw, 540px, calc((100svh - var(--st, 64svh) - 32px) / 0.625)))' }} className="cine-wrap relative h-[240vh] bg-[#050505] motion-reduce:h-auto">
            <div onPointerMove={move} className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative motion-reduce:h-[100svh]">
                {/* Lighting: a warm key light from above and a cool floor bounce */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(255,214,170,.20),transparent_65%),radial-gradient(ellipse_60%_35%_at_50%_105%,rgba(120,150,255,.14),transparent_70%)]" />
                <div className="grain pointer-events-none absolute inset-0 opacity-[.07]" />
                <div className="pointer-events-none absolute left-1/2 top-[38%] w-[min(120vw,1100px)] -translate-x-1/2 -translate-y-1/2 text-white/[.045]" aria-hidden>
                    <div className="landing-spin [animation-duration:90s]">
                        <WorklyLogo className="w-full" />
                    </div>
                </div>

                {/* Headline */}
                <div ref={intro} className="relative z-10 flex flex-col items-center px-4 pt-[max(96px,19svh)] text-center text-white md:pt-[max(96px,12svh)]" style={{ transform: 'translateY(calc(var(--a, 0) * -30svh))', opacity: 'calc(1 - var(--a, 0) * 1.4)' }}>
                    <h1 className="font-[family-name:var(--font-fraunces)] text-[clamp(2.3rem,min(7vw,9.5svh),6.2rem)] font-light leading-[0.92] tracking-[-0.035em]">
                        Your idea deserves<br />a <em className="font-normal">website.</em>
                    </h1>
                    <p className="mt-5 max-w-md text-sm text-white/60 md:text-base">We design and build websites, online stores and web apps. No two alike.</p>
                    <div className="mt-7 flex items-center gap-3">
                        <a href="#contact" className="group flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm text-black transition-transform hover:scale-[1.03]">
                            Start a project <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
                        </a>
                        <a href="#gallery" className="rounded-full px-5 py-3 text-sm text-white/80 ring-1 ring-white/20 transition-colors hover:bg-white/10">See the work</a>
                    </div>
                </div>

                {/* Stage: a curved wall of screens */}
                <div className="absolute inset-x-0 bottom-0 [perspective:1600px]" style={{ top: 'var(--st, 64svh)' }}>
                    {side.map(({ Site, url, dark, x, glow }) => (
                        <div
                            key={url}
                            className={`absolute left-1/2 top-0 w-[calc(var(--cw)*0.74)] ${Math.abs(x) === 2 ? 'hidden lg:block' : ''}`}
                            style={{
                                transform: `translateX(calc(-50% + var(--cw) * ${x * 0.86} + var(--e, 0) * ${x * 70}vw + var(--mx, 0) * ${-x * 14}px)) translateY(calc(var(--cw) * ${Math.abs(x) * 0.05} + var(--my, 0) * -10px)) rotateY(${-x * 24}deg) scale(${1 - Math.abs(x) * 0.08})`,
                                opacity: 'calc(1 - var(--e, 0) * 1.6)',
                                ['--glow' as string]: glow,
                            }}
                        >
                            <Screen url={url} dark={dark} className="aspect-[16/10] rounded-[14px] shadow-[0_40px_120px_-20px_var(--glow)]">
                                <Site />
                            </Screen>
                        </div>
                    ))}
                </div>

                {/* Centre screen: grows to fill the viewport and becomes world 2 */}
                <div
                    className="absolute left-1/2 z-20 overflow-hidden shadow-[0_50px_140px_-30px_rgba(201,192,255,.45)]"
                    style={{
                        top: 'calc(var(--st, 64svh) * (1 - var(--e, 0)))',
                        width: 'calc(var(--cw) + (100vw - var(--cw)) * var(--e, 0))',
                        height: 'calc(var(--cw) * 0.625 + (100svh - var(--cw) * 0.625) * var(--e, 0))',
                        transform: 'translateX(-50%) translateY(calc(var(--my, 0) * -8px * (1 - var(--e, 0))))',
                        borderRadius: 'calc(16px * (1 - var(--e, 0)))',
                    }}
                >
                    {/* The design keeps its proportions while the window around it grows */}
                    <div className="absolute inset-0 bg-[#eef0ff]" />
                    <Screen url="formapilates.ae" className="absolute inset-x-0 top-1/2 aspect-[16/10] -translate-y-1/2">
                        <SiteBooking />
                    </Screen>
                    <div className="absolute inset-0 flex items-center justify-center bg-[#eef0ff] px-6 text-center" style={{ opacity: 'var(--c, 0)' }}>
                        <p className="font-[family-name:var(--font-manrope)] text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#1b1740]">
                            Different<br />by design.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* WORLD 2 — Contemporary digital. A site being assembled from floating interface parts. */
export function Digital() {
    const sec = useRef<HTMLElement>(null)
    useScrollVar(sec, 'pass')
    const [brief, setBrief] = useState('')

    const send = (e: React.FormEvent) => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('workly:idea', { detail: brief }))
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }

    const depth = (n: number) => ({ transform: `translateY(calc((var(--p, .5) - .5) * ${n}px))` })

    return (
        <section ref={sec} className="world-digital-bg relative overflow-hidden pb-28 pt-10 font-[family-name:var(--font-manrope)] text-[#1b1740] md:pb-36">
            <div className="mx-auto max-w-[1200px] px-4 text-center md:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5b4fd6]">Whatever you imagine</p>
                <h2 className="mx-auto mt-4 max-w-4xl text-[clamp(2.2rem,6vw,4.8rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                    We build it. Page by page, detail by detail.
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-sm text-[#1b1740]/65 md:text-base">Share the idea in plain words. We design the pages, the features and every detail around it.</p>
            </div>

            <div className="relative mx-auto mt-14 h-[480px] max-w-[1100px] px-4 md:mt-20 md:h-[600px]">
                {/* The site under construction */}
                <div className="absolute left-1/2 top-6 w-[min(92vw,680px)] -translate-x-1/2 md:top-10" style={depth(-30)}>
                    <Screen url="formapilates.ae" className="aspect-[16/10] rounded-[18px] shadow-[0_40px_90px_-30px_rgba(60,40,160,.45)]">
                        <SiteBooking />
                    </Screen>
                    <span className="digital-cursor pointer-events-none absolute left-[18%] top-[70%] z-30 hidden md:block">
                        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#1b1740" stroke="#fff" strokeWidth="1.5" /></svg>
                    </span>
                    <span className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#1b1740] px-4 py-2 text-xs text-white shadow-lg">
                        <span className="text-[#d9f99d]">+</span> Add section
                    </span>
                </div>

                {/* Brief card (functional: hands the text to the contact form) */}
                <form onSubmit={send} className="art-float absolute bottom-0 left-4 right-4 z-20 rounded-[20px] bg-white/85 p-3 shadow-[0_20px_50px_-20px_rgba(60,40,160,.4)] backdrop-blur md:bottom-auto md:left-0 md:right-auto md:top-0 md:w-72" style={depth(40)}>
                    <label htmlFor="brief" className="flex items-center justify-between px-1 text-[11px] font-semibold text-[#5b4fd6]">Your brief <span className="font-normal text-[#1b1740]/40">sent to our team</span></label>
                    <div className="mt-2 flex items-end gap-2">
                        <textarea
                            id="brief"
                            rows={2}
                            value={brief}
                            onChange={(e) => setBrief(e.target.value)}
                            placeholder="A booking website for my pilates studio, with class schedules…"
                            className="flex-1 resize-none rounded-xl bg-[#f3f1ff] p-2.5 text-[13px] leading-snug outline-none placeholder:text-[#1b1740]/40 focus:ring-2 focus:ring-[#5b4fd6]"
                        />
                        <button aria-label="Send brief" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#5b4fd6] text-white transition-transform hover:scale-110"><ArrowUpRight size={16} /></button>
                    </div>
                </form>

                {/* Pages panel */}
                <div className="art-float absolute right-2 top-0 z-20 w-40 rounded-[18px] bg-white/85 p-3 text-[12px] shadow-[0_20px_50px_-20px_rgba(60,40,160,.4)] backdrop-blur [--d:1.2s] md:right-0 md:top-16 md:w-52" style={depth(60)}>
                    <p className="mb-2 text-[11px] font-semibold text-[#5b4fd6]">Pages</p>
                    {['Home', 'Classes', 'Book online', 'Members'].map((pg, i) => (
                        <div key={pg} className="flex items-center gap-2 py-1">
                            <span className="page-tick grid size-4 place-items-center rounded-full border border-[#1b1740]/20" style={{ ['--d' as string]: `${i * 0.7}s` }}><Check size={10} strokeWidth={3} /></span>
                            {pg}
                        </div>
                    ))}
                </div>

                {/* Palette + type specimen */}
                <div className="art-float absolute bottom-24 left-0 z-20 hidden rounded-[18px] bg-white/85 p-3 shadow-[0_20px_50px_-20px_rgba(60,40,160,.4)] backdrop-blur [--d:.6s] md:block" style={depth(90)}>
                    <p className="mb-2 text-[11px] font-semibold text-[#5b4fd6]">Brand</p>
                    <div className="flex gap-1.5">{['#24204a', '#c9c0ff', '#f7c9dd', '#d9f99d', '#ffffff'].map((c) => <span key={c} className="size-7 rounded-full ring-1 ring-black/5" style={{ background: c }} />)}</div>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight">Aa <span className="text-xs font-medium text-[#1b1740]/50">Manrope</span></p>
                </div>

                {/* Brand sticker: the studio signs its work */}
                <div className="art-float absolute left-1/2 top-[52%] z-30 hidden translate-x-[calc(min(46vw,340px)-50%)] rotate-[10deg] rounded-full bg-[#1b1740] p-3 text-[#d9f99d] shadow-xl [--d:1.6s] md:block" style={depth(110)}>
                    <WorklyLogo className="landing-spin size-16 [animation-duration:24s]" />
                </div>

                {/* Live booking toast */}
                <div className="art-float absolute bottom-28 right-2 z-20 flex items-center gap-2.5 rounded-2xl bg-[#1b1740] py-2.5 pl-2.5 pr-4 text-[12px] text-white shadow-xl [--d:2s] md:bottom-16 md:right-6" style={depth(70)}>
                    <span className="grid size-8 place-items-center rounded-full bg-[#d9f99d] text-[#1b1740]"><Check size={14} strokeWidth={3} /></span>
                    <span className="leading-tight">New booking<br /><span className="text-white/60">Reformer Flow · 07:00</span></span>
                </div>
            </div>

            {/* Dissolve into the white editorial world */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-white md:h-64" />
        </section>
    )
}
