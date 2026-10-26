'use client'

import { useEffect, useRef, useState } from 'react'

// Concept websites, each with its own brand identity, built as real page layouts with photography.
// Sizes use cqw so a design scales to any frame; hovering a screen scrolls through its full page.

export function Screen({ children, url, className = '', dark = false }: { children: React.ReactNode; url?: string; className?: string; dark?: boolean }) {
    return (
        <div className={`group/screen @container overflow-hidden ${className}`}>
            <div className={`flex h-full w-full flex-col overflow-hidden rounded-[1.8cqw] ${dark ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
                {url && (
                    <div className={`flex shrink-0 items-center gap-[1.2cqw] px-[2cqw] py-[1.2cqw] ${dark ? 'bg-[#1a1a1a]' : 'bg-[#f1f1ee]'}`}>
                        <span className="flex gap-[0.7cqw]">{['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="size-[1.2cqw] rounded-full" style={{ background: c }} />)}</span>
                        <span className={`mx-auto rounded-[0.8cqw] px-[3cqw] py-[0.3cqw] text-[1.5cqw] ${dark ? 'bg-black/40 text-white/50' : 'bg-white text-black/40'}`}>{url}</span>
                    </div>
                )}
                <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
            </div>
        </div>
    )
}

/* A full page, taller than the frame. Hovering the screen scrolls it to the footer, like browsing a live site. */
function Page({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const page = ref.current
        const frame = page?.parentElement
        if (!page || !frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const enter = () => {
            const distance = Math.max(0, page.offsetHeight - frame.clientHeight)
            page.style.transitionDuration = `${Math.min(12, Math.max(3, distance / 110))}s`
            page.style.transform = `translateY(${-distance}px)`
        }
        const leave = () => {
            page.style.transitionDuration = '1.4s'
            page.style.transform = ''
        }
        // Touch screens have no hover: a tap scrolls through the page, a second tap scrolls back
        if (window.matchMedia('(hover: none)').matches) {
            let open = false
            const tap = () => {
                open = !open
                if (open) enter()
                else leave()
            }
            frame.addEventListener('click', tap)
            return () => frame.removeEventListener('click', tap)
        }
        frame.addEventListener('mouseenter', enter)
        frame.addEventListener('mouseleave', leave)
        return () => {
            frame.removeEventListener('mouseenter', enter)
            frame.removeEventListener('mouseleave', leave)
        }
    }, [])
    return (
        <div ref={ref} className={`absolute inset-x-0 top-0 flex min-h-full flex-col transition-transform ease-in-out ${className}`}>
            {children}
        </div>
    )
}

/* Photograph with a tinted fallback so a slow or failed load never leaves a hole */
function Ph({ id, className = '', tint = 'bg-[#d9d4cb]', style, zoom = false, eager = false }: { id: string; className?: string; tint?: string; style?: React.CSSProperties; zoom?: boolean; eager?: boolean }) {
    // Hidden until it has really loaded (also covers loads that finish before hydration)
    const img = useRef<HTMLImageElement>(null)
    useEffect(() => {
        const el = img.current
        if (el?.complete && el.naturalWidth > 0) el.style.opacity = '1'
    }, [])
    return (
        <div className={`${/\babsolute\b/.test(className) ? '' : 'relative'} overflow-hidden ${tint} ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`}
                alt=""
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                ref={img}
                onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,scale] duration-700 hover:scale-[1.05] ${zoom ? 'mk-zoom' : ''}`}
                style={style}
            />
        </div>
    )
}

/* Hero photos crossfade and drift, like a video background (three slides, 15s loop) */
function Slides({ ids, className = '', tint = 'bg-[#d9d4cb]' }: { ids: [string, string, string]; className?: string; tint?: string }) {
    return (
        <div className={`overflow-hidden ${tint} ${className}`}>
            {ids.map((id, i) => <Ph key={id} id={id} zoom eager className="mk-slide absolute inset-0" tint="bg-transparent" style={{ animationDelay: `${i * 5}s` }} />)}
        </div>
    )
}

/* Live-activity pop-up that slides in and out on a loop */
function Toast({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    return (
        <div className={`mk-toast absolute z-20 flex items-center gap-[1cqw] rounded-[1.2cqw] bg-white px-[1.6cqw] py-[1.1cqw] text-[1.2cqw] text-[#111] shadow-[0_1cqw_3cqw_rgba(0,0,0,.18)] ${className}`} style={{ animationDelay: `${delay}s` }}>
            {children}
        </div>
    )
}

/* A real ticking countdown */
function Countdown({ className = '' }: { className?: string }) {
    const [left, setLeft] = useState(2 * 3600 + 14 * 60 + 9)
    useEffect(() => {
        const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 2 * 3600 + 14 * 60 + 9)), 1000)
        return () => clearInterval(t)
    }, [])
    const f = (n: number) => String(n).padStart(2, '0')
    return <span className={`tabular-nums ${className}`}>{f(Math.floor(left / 3600))}:{f(Math.floor((left % 3600) / 60))}:{f(left % 60)}</span>
}

function Live({ className = '' }: { className?: string }) {
    return <span className={`relative inline-flex size-[0.9cqw] ${className}`}><span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" /><span className="relative size-full rounded-full bg-current" /></span>
}

function Stars({ n = 5, className = '' }: { n?: number; className?: string }) {
    return <span className={`tracking-[0.1em] ${className}`}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

function Heart({ className = '' }: { className?: string }) {
    return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.3 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.7 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z" /></svg>
}

function Pay({ className = '' }: { className?: string }) {
    return (
        <span className={`flex gap-[0.8cqw] ${className}`}>
            {['VISA', 'Mastercard', ' Pay', 'tabby'].map((p) => <span key={p} className="rounded-[0.4cqw] bg-white/90 px-[1cqw] py-[0.3cqw] text-[1cqw] font-bold text-black">{p}</span>)}
        </span>
    )
}

/* E-commerce — sneaker store */
export function SiteStore() {
    const trending = [
        ['photo-1549298916-b41d501d3772', 'Court Classic', '429', null, 'Best seller'],
        ['photo-1606107557195-0e29a4b5b4aa', 'Trail Pro GTX', '495', '619', '−20%'],
        ['photo-1460353581641-37baddab0fa2', 'Daily Knit', '389', null, 'New'],
        ['photo-1542291026-7eec264c27ff', 'Volt Runner 2', '549', null, 'Back in stock'],
    ] as const
    return (
        <Page className="bg-[#f4f4f1] font-[family-name:var(--font-manrope)] text-[#0f0f0f]">
            <div className="bg-[#0f0f0f] py-[0.8cqw] text-center text-[1.15cqw] text-[#c6ff3d]">Free next-day delivery in the UAE over AED 300 · Split in 4 with tabby</div>
            <div className="flex items-center justify-between px-[4cqw] py-[2cqw] text-[1.45cqw]">
                <span className="text-[2.8cqw] font-extrabold italic tracking-tighter">STRIDE</span>
                <span className="flex gap-[2.6cqw] font-semibold"><span>New</span><span>Men</span><span>Women</span><span>Kids</span><span className="text-[#e5484d]">Sale</span></span>
                <span className="flex items-center gap-[2cqw]"><span className="rounded-full bg-white px-[2cqw] py-[0.6cqw] text-black/40">Search</span><Heart className="size-[2cqw]" /><span className="rounded-full bg-[#0f0f0f] px-[1.6cqw] py-[0.5cqw] text-white">Bag · 2</span></span>
            </div>
            <p className="px-[4cqw] text-[1.15cqw] text-black/40">Home / Running / Volt Runner 2</p>
            <div className="grid h-[46cqw] shrink-0 grid-cols-[1.25fr_1fr] gap-[3cqw] px-[4cqw] py-[1.6cqw]">
                <div className="flex gap-[1.2cqw]">
                    <div className="flex w-[7cqw] flex-col gap-[1cqw]">
                        {[0, 1, 2].map((i) => <Ph key={i} id="photo-1542291026-7eec264c27ff" className={`aspect-square rounded-[0.8cqw] ${i === 0 ? 'ring-[0.3cqw] ring-[#0f0f0f]' : 'opacity-70'}`} tint="bg-[#c6ff3d]" />)}
                    </div>
                    <div className="relative flex-1 overflow-hidden rounded-[2cqw] bg-[#c6ff3d]">
                        <span className="absolute left-[2cqw] top-[1.6cqw] z-10 rounded-full bg-[#0f0f0f] px-[1.4cqw] py-[0.4cqw] text-[1.1cqw] text-[#c6ff3d]">NEW DROP</span>
                        <Ph id="photo-1542291026-7eec264c27ff" zoom className="absolute inset-0" tint="bg-[#c6ff3d]" style={{ mixBlendMode: 'multiply' }} />
                        <span className="absolute bottom-[1.6cqw] left-[2cqw] z-10 flex items-center gap-[0.8cqw] rounded-full bg-white/90 px-[1.2cqw] py-[0.4cqw] text-[1.1cqw]"><Live className="text-[#e5484d]" />18 people viewing</span>
                        <Toast className="bottom-[1.6cqw] right-[1.6cqw]" delay={1}><Ph id="photo-1542291026-7eec264c27ff" className="size-[3.6cqw] rounded-[0.6cqw]" tint="bg-[#c6ff3d]" /><span><b>Hamad in Abu Dhabi</b><br /><span className="text-black/50">bought Volt Runner 2 · 2 min ago</span></span></Toast>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-[1.4cqw]">
                    <span className="flex items-center gap-[1cqw] text-[1.3cqw]"><Stars className="text-[#0f0f0f]" /> <span className="text-black/50">4.8 · 312 reviews</span></span>
                    <p className="text-[4.2cqw] font-extrabold leading-[0.95] tracking-tight">Volt Runner 2</p>
                    <p className="text-[1.4cqw] text-black/55">Lightweight daily trainer with a responsive foam midsole.</p>
                    <p className="text-[2.6cqw] font-bold">AED 549 <span className="text-[1.3cqw] font-normal text-black/45">or 4 × AED 137.25</span></p>
                    <div className="flex gap-[1cqw]">{['#c6ff3d', '#f4f4f1', '#0f0f0f', '#ff5a1f'].map((c, i) => <span key={c} className={`size-[3cqw] rounded-full border border-black/10 ${i === 0 ? 'ring-[0.3cqw] ring-[#0f0f0f] ring-offset-[0.3cqw]' : ''}`} style={{ background: c }} />)}</div>
                    <div className="grid grid-cols-5 gap-[0.8cqw] text-[1.3cqw]">{['40', '41', '42', '43', '44'].map((s, i) => <span key={s} className={`grid h-[4cqw] place-items-center rounded-[0.8cqw] ${i === 2 ? 'bg-[#0f0f0f] text-white' : i === 4 ? 'bg-white text-black/25 line-through' : 'bg-white'}`}>{s}</span>)}</div>
                    <div className="flex gap-[1cqw]">
                        <span className="flex-1 rounded-full bg-[#0f0f0f] py-[1.4cqw] text-center text-[1.6cqw] font-semibold text-white">Add to bag</span>
                        <span className="grid size-[5.2cqw] place-items-center rounded-full border border-black/15"><Heart className="size-[2cqw]" /></span>
                    </div>
                    <p className="flex items-center gap-[0.8cqw] text-[1.2cqw] text-[#2f7d32]"><Live />In stock · launch price ends in <Countdown className="font-bold" /></p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-[2cqw] border-y border-black/5 bg-white px-[4cqw] py-[2.2cqw] text-[1.3cqw]">
                {[['Free returns', 'Within 30 days'], ['Secure checkout', 'Apple Pay, cards & tabby'], ['100% authentic', 'Straight from the brand']].map(([t, d]) => (
                    <span key={t}><b className="block text-[1.5cqw]">{t}</b><span className="text-black/50">{d}</span></span>
                ))}
            </div>
            <div className="px-[4cqw] py-[3.5cqw]">
                <div className="flex items-end justify-between"><p className="text-[3.2cqw] font-extrabold tracking-tight">Trending now</p><span className="text-[1.3cqw] font-semibold underline">Shop all</span></div>
                <div className="mt-[2cqw] grid grid-cols-4 gap-[1.6cqw]">
                    {trending.map(([id, n, p, old, tag]) => (
                        <div key={n}>
                            <div className="relative">
                                <Ph id={id} className="aspect-square rounded-[1.2cqw]" tint="bg-[#ececea]" />
                                <span className={`absolute left-[1cqw] top-[1cqw] rounded-full px-[1cqw] py-[0.3cqw] text-[1cqw] font-bold ${old ? 'bg-[#e5484d] text-white' : 'bg-white'}`}>{tag}</span>
                                <Heart className="absolute right-[1cqw] top-[1cqw] size-[1.8cqw]" />
                            </div>
                            <p className="mt-[0.9cqw] text-[1.45cqw] font-bold">{n}</p>
                            <p className="text-[1.3cqw]">AED {p} {old && <span className="text-black/35 line-through">AED {old}</span>}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative mx-[4cqw] grid grid-cols-2 overflow-hidden rounded-[2cqw] bg-[#0f0f0f] text-white">
                <div className="flex flex-col justify-center gap-[1.2cqw] p-[3.5cqw]">
                    <span className="text-[1.2cqw] uppercase tracking-[0.2em] text-[#c6ff3d]">Stride Run Club</span>
                    <p className="text-[3.4cqw] font-extrabold leading-none">Every Saturday,<br />6am, Kite Beach.</p>
                    <span className="w-max rounded-full bg-[#c6ff3d] px-[2cqw] py-[0.8cqw] text-[1.3cqw] font-bold text-black">Join free</span>
                </div>
                <Ph id="photo-1476480862126-209bfaa8edc8" className="aspect-[4/3]" tint="bg-[#222]" />
            </div>
            <div className="grid grid-cols-[1fr_1.2fr] gap-[3cqw] px-[4cqw] py-[3.5cqw]">
                <div>
                    <Stars className="text-[1.6cqw]" />
                    <p className="mt-[1cqw] text-[2cqw] font-bold leading-snug">“Lightest trainer I&apos;ve owned. Ran the Dubai half in them.”</p>
                    <p className="mt-[1cqw] text-[1.2cqw] text-black/50">Omar K. · Verified buyer</p>
                </div>
                <div className="rounded-[1.6cqw] bg-white p-[2.4cqw]">
                    <p className="text-[1.8cqw] font-extrabold">Get early access to drops</p>
                    <div className="mt-[1.4cqw] flex gap-[1cqw]"><span className="flex-1 rounded-full border border-black/10 px-[1.6cqw] py-[1cqw] text-[1.3cqw] text-black/35">Email address</span><span className="rounded-full bg-[#0f0f0f] px-[2cqw] py-[1cqw] text-[1.3cqw] text-white">Sign up</span></div>
                </div>
            </div>
            <div className="mt-auto grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-[2cqw] bg-[#0f0f0f] px-[4cqw] py-[3cqw] text-[1.2cqw] text-white/55">
                <div><span className="text-[2.2cqw] font-extrabold italic text-[#c6ff3d]">STRIDE</span><Pay className="mt-[1.4cqw]" /></div>
                {[['Shop', 'Men', 'Women', 'Sale'], ['Help', 'Delivery', 'Returns', 'Size guide'], ['Stores', 'Dubai Mall', 'Mall of the Emirates', 'Yas Mall']].map(([h, ...l]) => (
                    <div key={h} className="space-y-[0.5cqw]"><p className="font-bold text-white">{h}</p>{l.map((x) => <p key={x}>{x}</p>)}</div>
                ))}
            </div>
        </Page>
    )
}

/* Fashion & luxury — fine jewellery house */
export function SiteLuxury() {
    const pieces = [
        ['photo-1605100804763-247f67b3557e', 'Eternity band', '18k yellow gold, 1.2 ct', '18,500'],
        ['photo-1599643478518-a784e5dc4c8f', 'Solène necklace', 'Diamond pavé, 42 cm', '24,900'],
        ['photo-1535632066927-ab7c9ab60908', 'Halo earrings', 'Platinum, 0.8 ct', '12,300'],
    ]
    return (
        <Page className="bg-[#0b0a08] text-[#e9dcc0]">
            <div className="border-b border-[#e9dcc0]/10 py-[0.8cqw] text-center text-[1.1cqw] uppercase tracking-[0.3em] text-[#c9a96a]">Complimentary engraving & gift wrapping</div>
            <div className="flex items-center justify-between whitespace-nowrap px-[5cqw] py-[2.4cqw] text-[1.1cqw] uppercase tracking-[0.18em] text-[#e9dcc0]/60">
                <span className="flex gap-[2.4cqw]"><span>High jewellery</span><span>Bridal</span><span>Watches</span></span>
                <span className="font-[family-name:var(--font-fraunces)] text-[2.6cqw] normal-case tracking-[0.2em] text-[#e9dcc0]">MAISON VÉRA</span>
                <span className="flex gap-[2.4cqw]"><span>Boutiques</span><span>Account</span><span>Bag (0)</span></span>
            </div>
            <div className="grid h-[46cqw] shrink-0 grid-cols-[1fr_1.1fr] items-stretch">
                <div className="flex flex-col justify-center px-[5cqw]">
                    <p className="text-[1.3cqw] uppercase tracking-[0.3em] text-[#c9a96a]">The Eternity Collection</p>
                    <p className="mt-[1.5cqw] font-[family-name:var(--font-fraunces)] text-[6.2cqw] font-light leading-[0.95]">Light,<br /><em>held forever.</em></p>
                    <p className="mt-[2cqw] max-w-[30cqw] text-[1.4cqw] leading-relaxed text-[#e9dcc0]/60">Hand-set diamonds in 18k gold, finished in our Dubai atelier by master setters.</p>
                    <span className="mt-[3cqw] flex gap-[3cqw] text-[1.3cqw] uppercase tracking-[0.25em]"><span className="border-b border-[#c9a96a] pb-[0.4cqw]">Discover</span><span className="text-[#e9dcc0]/50">Watch the film ▸</span></span>
                </div>
                <Slides ids={['photo-1605100804763-247f67b3557e', 'photo-1599643478518-a784e5dc4c8f', 'photo-1515562141207-7a88fb7ce338']} className="relative" tint="bg-[#2a2217]" />
            </div>
            <div className="px-[5cqw] py-[4cqw]">
                <div className="flex items-end justify-between">
                    <p className="font-[family-name:var(--font-fraunces)] text-[3.4cqw] font-light">New arrivals</p>
                    <span className="text-[1.2cqw] uppercase tracking-[0.25em] text-[#c9a96a]">View all 48 pieces</span>
                </div>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2.5cqw]">
                    {pieces.map(([id, n, d, p]) => (
                        <div key={n}>
                            <Ph id={id} className="aspect-[4/5]" tint="bg-[#241d14]" />
                            <p className="mt-[1.2cqw] font-[family-name:var(--font-fraunces)] text-[1.9cqw]">{n}</p>
                            <p className="text-[1.2cqw] text-[#e9dcc0]/45">{d}</p>
                            <p className="mt-[0.4cqw] text-[1.3cqw] text-[#c9a96a]">AED {p}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 items-center bg-[#141210]">
                <Ph id="photo-1515562141207-7a88fb7ce338" className="aspect-[4/3]" tint="bg-[#241d14]" />
                <div className="px-[5cqw]">
                    <p className="text-[1.2cqw] uppercase tracking-[0.3em] text-[#c9a96a]">Savoir-faire</p>
                    <p className="mt-[1.2cqw] font-[family-name:var(--font-fraunces)] text-[3.4cqw] font-light leading-tight">Forty hours<br /><em>in every ring.</em></p>
                    <p className="mt-[1.5cqw] text-[1.35cqw] leading-relaxed text-[#e9dcc0]/55">Each stone is chosen by hand, set under the loupe and polished until the metal disappears behind the light.</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-[3cqw] px-[5cqw] py-[4cqw] text-[1.3cqw]">
                {[['Dubai', 'The Dubai Mall, Fashion Avenue'], ['Paris', '18 Rue Saint-Honoré'], ['Doha', 'Place Vendôme, Lusail']].map(([c, a]) => (
                    <div key={c} className="border-t border-[#e9dcc0]/15 pt-[1.6cqw]"><p className="font-[family-name:var(--font-fraunces)] text-[2.2cqw]">{c}</p><p className="text-[#e9dcc0]/50">{a}</p></div>
                ))}
            </div>
            <div className="mx-[5cqw] flex items-center justify-between border border-[#c9a96a]/40 px-[3cqw] py-[2.4cqw]">
                <p className="font-[family-name:var(--font-fraunces)] text-[2.4cqw]">Book a private appointment</p>
                <span className="bg-[#c9a96a] px-[2.4cqw] py-[1cqw] text-[1.2cqw] uppercase tracking-[0.2em] text-[#0b0a08]">Reserve</span>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-[#e9dcc0]/10 px-[5cqw] py-[3cqw] text-[1.2cqw] text-[#e9dcc0]/45">
                <span className="font-[family-name:var(--font-fraunces)] text-[2cqw] tracking-[0.2em] text-[#e9dcc0]">MV</span>
                <span className="flex gap-[2.4cqw]"><span>Care guide</span><span>Certificates</span><span>Contact</span></span>
                <span>© Maison Véra 1987</span>
            </div>
        </Page>
    )
}

/* Hospitality — boutique desert hotel */
export function SiteHotel() {
    const rooms = [
        ['photo-1582719478250-c89cae4dc85b', 'Dune Suite', '72 m² · 2 guests · King bed', '2,450'],
        ['photo-1566073771259-6a8506099945', 'Pool Villa', '140 m² · 4 guests · Private pool', '3,900'],
        ['photo-1542314831-068cd1dbfeeb', 'Oasis Room', '48 m² · 2 guests · Terrace', '1,650'],
    ]
    return (
        <Page className="bg-[#f2e8d9] text-[#3a2a1c]">
            <div className="relative flex h-[50cqw] shrink-0 flex-col">
                <Slides ids={['photo-1509316785289-025f5b846b35', 'photo-1566073771259-6a8506099945', 'photo-1582719478250-c89cae4dc85b']} className="absolute inset-0" tint="bg-gradient-to-b from-[#f6b984] to-[#a8573a]" />
                <Toast className="right-[4cqw] top-[8cqw]" delay={2}><Live className="text-[#e5484d]" /><span><b>Only 2 Pool Villas left</b><br /><span className="text-black/50">for 12–15 Dec · 41 people looking</span></span></Toast>
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />
                <div className="relative flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.3cqw] text-white">
                    <span className="font-[family-name:var(--font-instrument)] text-[3cqw] italic">Sahra</span>
                    <span className="flex gap-[3cqw] uppercase tracking-[0.2em] text-white/80"><span>Suites</span><span>Dining</span><span>Spa</span><span>Experiences</span></span>
                    <span className="rounded-full border border-white/60 px-[1.8cqw] py-[0.6cqw]">EN · AED</span>
                </div>
                <div className="relative mt-auto px-[4cqw] pb-[3cqw]">
                    <p className="text-[1.3cqw] uppercase tracking-[0.25em] text-white/80">A desert retreat, 45 minutes from Dubai</p>
                    <p className="font-[family-name:var(--font-instrument)] text-[6.4cqw] leading-none text-white">Where the dunes<br /><em>meet the stars</em></p>
                    <div className="mt-[2.5cqw] grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-[2cqw] rounded-[1.4cqw] bg-white/95 px-[3cqw] py-[1.8cqw] text-[1.35cqw]">
                        {[['Check in', 'Fri, 12 Dec'], ['Check out', 'Mon, 15 Dec'], ['Guests', '2 adults'], ['Promo code', 'Optional']].map(([k, v]) => (
                            <span key={k}><span className="block text-[1.05cqw] uppercase tracking-[0.15em] text-[#3a2a1c]/50">{k}</span>{v}</span>
                        ))}
                        <span className="rounded-full bg-[#3a2a1c] px-[2.4cqw] py-[1cqw] text-[#f2e8d9]">Check availability</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-[4cqw] border-b border-[#3a2a1c]/10 py-[2cqw] text-[1.25cqw] text-[#3a2a1c]/70">
                <span><b className="text-[#3a2a1c]">9.6</b> Exceptional · 2,140 reviews</span><span>·</span><span>Best rate guaranteed when you book direct</span><span>·</span><span>Free cancellation up to 7 days</span>
            </div>
            <div className="px-[4cqw] py-[4cqw]">
                <p className="text-[1.2cqw] uppercase tracking-[0.25em] text-[#a8573a]">Stay</p>
                <p className="font-[family-name:var(--font-instrument)] text-[3.6cqw] leading-tight">Suites shaped by the desert</p>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2cqw]">
                    {rooms.map(([id, n, d, p]) => (
                        <div key={n} className="overflow-hidden rounded-[1.2cqw] bg-white">
                            <Ph id={id} className="aspect-[4/3]" />
                            <div className="space-y-[0.4cqw] p-[1.6cqw] text-[1.3cqw]">
                                <p className="font-[family-name:var(--font-instrument)] text-[2cqw]">{n}</p>
                                <p className="text-[#3a2a1c]/55">{d}</p>
                                <p className="flex items-center justify-between pt-[0.6cqw]"><span>from <b>AED {p}</b> / night</span><span className="text-[#a8573a] underline">Book</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-[#3a2a1c] px-[4cqw] py-[4cqw] text-[#f2e8d9]">
                <p className="font-[family-name:var(--font-instrument)] text-[3.4cqw]">Experiences</p>
                <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
                    {[['photo-1414235077428-338989a2e8c0', 'Dinner in the dunes', 'Nightly · 19:30'], ['photo-1540555700478-4be289fbecef', 'Sand & salt spa ritual', '90 minutes'], ['photo-1509316785289-025f5b846b35', 'Sunrise dune drive', 'Daily · 06:00']].map(([id, n, t]) => (
                        <div key={n}>
                            <Ph id={id} className="aspect-[3/2] rounded-[1cqw]" tint="bg-[#5a4330]" />
                            <p className="mt-[1cqw] text-[1.6cqw]">{n}</p>
                            <p className="text-[1.2cqw] text-[#f2e8d9]/55">{t}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-[1.2fr_1fr] items-center gap-[4cqw] px-[4cqw] py-[4cqw]">
                <p className="font-[family-name:var(--font-instrument)] text-[2.8cqw] italic leading-snug">“The quietest night we have ever spent. We could hear the sand move.”</p>
                <p className="text-[1.3cqw] text-[#3a2a1c]/60">Claire & Matthieu, Lyon<br />Stayed in a Pool Villa · November 2026</p>
            </div>
            <div className="mt-auto grid grid-cols-4 gap-[2cqw] bg-[#2a1e14] px-[4cqw] py-[3cqw] text-[1.2cqw] text-[#f2e8d9]/55">
                <div><span className="font-[family-name:var(--font-instrument)] text-[2.4cqw] italic text-[#f2e8d9]">Sahra</span><p>Al Faya Desert, Sharjah</p></div>
                {[['Stay', 'Suites', 'Villas', 'Offers'], ['Discover', 'Dining', 'Spa', 'Gallery'], ['Contact', '+971 6 000 0000', 'stay@sahra.ae', 'Directions']].map(([h, ...l]) => (
                    <div key={h} className="space-y-[0.4cqw]"><p className="text-[#f2e8d9]">{h}</p>{l.map((x) => <p key={x}>{x}</p>)}</div>
                ))}
            </div>
        </Page>
    )
}

/* Restaurant */
export function SiteRestaurant() {
    const menu = [['Shakshuka, labneh & za’atar bread', 'V', '48'], ['Ember-roasted salmon, freekeh', '', '96'], ['Lamb ouzi, saffron rice', '', '112'], ['Charred cauliflower, tahini', 'VG', '54']]
    return (
        <Page className="bg-[#f3ece1] text-[#3b2f24]">
            <div className="relative flex h-[46cqw] shrink-0 flex-col">
                <Slides ids={['photo-1555396273-367ea4eb4db5', 'photo-1414235077428-338989a2e8c0', 'photo-1509042239860-f550ce710b93']} className="absolute inset-0" tint="bg-gradient-to-br from-[#c9a27c] to-[#7d5236]" />
                <Toast className="right-[4cqw] top-[8cqw]" delay={3}><span className="grid size-[3cqw] place-items-center rounded-full bg-[#b9825a] text-white">✓</span><span><b>Table for 2 booked</b><br /><span className="text-black/50">Tonight · 20:00 · Terrace</span></span></Toast>
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/10" />
                <div className="relative flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.25cqw] uppercase tracking-[0.2em] text-white/85">
                    <span className="font-[family-name:var(--font-instrument)] text-[3cqw] normal-case tracking-normal text-white">Olive &amp; Ember</span>
                    <span className="flex gap-[3cqw]"><span>Menu</span><span>Events</span><span>Gift cards</span><span>Visit</span></span>
                    <span className="rounded-full bg-white px-[1.8cqw] py-[0.6cqw] tracking-normal text-[#3b2f24]">Reserve</span>
                </div>
                <div className="relative mt-auto px-[4cqw] pb-[4cqw] text-[#fff8ee]">
                    <span className="inline-flex items-center gap-[0.8cqw] rounded-full bg-white/15 px-[1.4cqw] py-[0.4cqw] text-[1.15cqw] backdrop-blur"><span className="size-[0.9cqw] rounded-full bg-[#7ee08a]" />Open now · kitchen until 23:00</span>
                    <p className="mt-[1.5cqw] font-[family-name:var(--font-instrument)] text-[6.4cqw] leading-[0.95]">Slow coffee,<br /><em>warm</em> plates</p>
                    <p className="mt-[1cqw] text-[1.4cqw] text-white/75">All-day café & wood-fired kitchen on Marina Walk</p>
                </div>
            </div>
            <div className="grid grid-cols-[1.1fr_1fr] gap-[4cqw] px-[4cqw] py-[4cqw]">
                <div>
                    <div className="flex gap-[1cqw] text-[1.3cqw]">{['Breakfast', 'Lunch', 'Dinner', 'Coffee'].map((t, i) => <span key={t} className={`rounded-full px-[1.6cqw] py-[0.5cqw] ${i === 1 ? 'bg-[#3b2f24] text-[#f3ece1]' : 'border border-[#3b2f24]/20'}`}>{t}</span>)}</div>
                    <div className="mt-[2cqw] space-y-[1.4cqw]">
                        {menu.map(([n, tag, p]) => (
                            <p key={n} className="flex items-baseline gap-[1cqw] text-[1.5cqw]">
                                <span>{n}</span>{tag && <span className="rounded-[0.4cqw] bg-[#6e8b3d]/15 px-[0.6cqw] text-[1cqw] text-[#4f6a28]">{tag}</span>}
                                <span className="flex-1 border-b border-dotted border-[#3b2f24]/30" /><span>{p}</span>
                            </p>
                        ))}
                    </div>
                    <p className="mt-[1.8cqw] text-[1.15cqw] text-[#3b2f24]/50">V vegetarian · VG vegan · Prices in AED, inclusive of VAT</p>
                </div>
                <div className="rounded-[1.6cqw] bg-white p-[2.4cqw]">
                    <p className="font-[family-name:var(--font-instrument)] text-[2.6cqw]">Book a table</p>
                    <div className="mt-[1.4cqw] grid grid-cols-2 gap-[1cqw] text-[1.3cqw]">
                        <span className="rounded-[0.8cqw] border border-[#3b2f24]/15 px-[1.2cqw] py-[0.9cqw]">Thu, 18 Dec</span>
                        <span className="rounded-[0.8cqw] border border-[#3b2f24]/15 px-[1.2cqw] py-[0.9cqw]">4 guests</span>
                    </div>
                    <div className="mt-[1.2cqw] grid grid-cols-4 gap-[0.8cqw] text-[1.25cqw]">
                        {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'].map((t, i) => <span key={t} className={`rounded-[0.6cqw] py-[0.7cqw] text-center ${i === 2 ? 'bg-[#3b2f24] text-white' : i === 5 ? 'bg-[#f3ece1] text-[#3b2f24]/30 line-through' : 'bg-[#f3ece1]'}`}>{t}</span>)}
                    </div>
                    <span className="mt-[1.4cqw] block rounded-full bg-[#b9825a] py-[1.1cqw] text-center text-[1.4cqw] text-white">Confirm reservation</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-[2cqw] px-[4cqw]">
                {[['photo-1504674900247-0877df9cc836', 'Ember-roasted salmon'], ['photo-1509042239860-f550ce710b93', 'Spanish latte'], ['photo-1565299624946-b28f40a0ae38', 'Wood-fired flatbread']].map(([id, n]) => (
                    <div key={n}><Ph id={id} className="aspect-square rounded-[1.2cqw]" tint="bg-[#e2d2bd]" /><p className="mt-[0.8cqw] text-[1.4cqw]">{n}</p></div>
                ))}
            </div>
            <div className="flex items-center justify-between px-[4cqw] py-[3.5cqw]">
                <p className="text-[1.5cqw]"><Stars className="text-[#b9825a]" /> <b>4.8</b> on Google · 1,860 reviews</p>
                <p className="font-[family-name:var(--font-instrument)] text-[2cqw] italic">“Best brunch on the Marina, hands down.”</p>
            </div>
            <div className="mt-auto grid grid-cols-[1.4fr_1fr_1fr] gap-[2cqw] bg-[#3b2f24] px-[4cqw] py-[3cqw] text-[1.25cqw] text-[#f3ece1]/60">
                <div><span className="font-[family-name:var(--font-instrument)] text-[2.4cqw] text-[#f3ece1]">Olive &amp; Ember</span><p>Marina Walk, Dubai Marina</p><p>+971 4 000 0000</p></div>
                <div className="space-y-[0.4cqw]"><p className="text-[#f3ece1]">Hours</p><p>Mon–Thu 7:30–23:00</p><p>Fri–Sun 7:30–00:00</p></div>
                <div className="space-y-[0.4cqw]"><p className="text-[#f3ece1]">Follow</p><p>@oliveandember</p><p>Private dining</p></div>
            </div>
        </Page>
    )
}

/* Booking & services — pilates studio */
export function SiteBooking() {
    const classes = [['07:00', 'Reformer Flow', 'Maya', 'All levels', '3 left'], ['09:30', 'Core & Stretch', 'Lea', 'Beginner', 'Full'], ['12:15', 'Lunch Express', 'Sami', '30 min', '6 left'], ['18:00', 'Power Reformer', 'Sami', 'Advanced', '5 left']]
    const team = [['photo-1544005313-94ddf0286df2', 'Maya Haddad', 'Head coach · STOTT'], ['photo-1438761681033-6461ffad8d80', 'Lea Morel', 'Rehab & prenatal'], ['photo-1500648767791-00dcc994a43e', 'Sami Aziz', 'Strength & athletic']]
    return (
        <Page className="bg-[#f6f3ff] font-[family-name:var(--font-manrope)] text-[#24204a]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.45cqw]">
                <span className="text-[2.6cqw] font-extrabold tracking-tight">FORMA</span>
                <span className="flex gap-[3cqw] text-[#24204a]/60"><span>Classes</span><span>Coaches</span><span>Pricing</span><span>Studio</span></span>
                <span className="flex items-center gap-[1.6cqw]"><span className="text-[#24204a]/60">Log in</span><span className="rounded-full bg-[#24204a] px-[2cqw] py-[0.8cqw] text-white">Book a class</span></span>
            </div>
            <div className="grid h-[46cqw] shrink-0 grid-cols-[1fr_1.15fr] gap-[3cqw] px-[4cqw] pb-[3cqw]">
                <div className="relative overflow-hidden rounded-[2cqw]">
                    <Ph id="photo-1518611012118-696072aa579a" zoom className="absolute inset-0" tint="bg-gradient-to-b from-[#c9c0ff] to-[#f7c9dd]" />
                    <Toast className="left-[2cqw] top-[2cqw]" delay={1.5}><Ph id="photo-1438761681033-6461ffad8d80" className="size-[3.4cqw] rounded-full" tint="bg-[#c9c0ff]" /><span><b>Noor just booked</b><br /><span className="text-black/50">Reformer Flow · Wed 07:00</span></span></Toast>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#24204a]/75 to-transparent" />
                    <div className="absolute bottom-[3cqw] left-[3cqw] right-[3cqw] text-white">
                        <p className="text-[4.6cqw] font-bold leading-[1]">Move with<br />intention.</p>
                        <p className="mt-[1cqw] text-[1.3cqw] text-white/75">First class free for new members</p>
                    </div>
                </div>
                <div className="flex flex-col gap-[1.2cqw]">
                    <div className="flex items-center justify-between text-[1.4cqw]"><b>This week</b><span className="text-[#24204a]/50">Jumeirah studio ▾</span></div>
                    <div className="flex gap-[1cqw] text-[1.35cqw]">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                            <span key={d} className={`flex-1 rounded-[1.2cqw] py-[0.9cqw] text-center ${i === 2 ? 'bg-[#24204a] text-white' : 'bg-white'}`}>{d}<span className="block text-[1.9cqw] font-bold">{10 + i}</span></span>
                        ))}
                    </div>
                    {classes.map(([t, n, c, lvl, s]) => (
                        <div key={t} className="flex items-center gap-[1.8cqw] rounded-[1.4cqw] bg-white p-[1.5cqw] text-[1.4cqw]">
                            <span className="w-[5cqw] font-bold">{t}</span>
                            <span className="flex-1"><span className="block font-semibold">{n}</span><span className="text-[#24204a]/50">with {c} · {lvl}</span></span>
                            <span className={`rounded-full px-[1.6cqw] py-[0.6cqw] ${s === 'Full' ? 'bg-[#eee] text-[#999]' : 'bg-[#d9f99d]'}`}>{s === 'Full' ? 'Waitlist' : s}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white px-[4cqw] py-[4cqw]">
                <p className="text-[3.2cqw] font-extrabold tracking-tight">Meet your coaches</p>
                <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
                    {team.map(([id, n, r]) => (
                        <div key={n} className="flex items-center gap-[1.4cqw] rounded-[1.6cqw] bg-[#f6f3ff] p-[1.4cqw]">
                            <Ph id={id} className="size-[7cqw] shrink-0 rounded-full" tint="bg-[#c9c0ff]" />
                            <span className="text-[1.35cqw]"><b className="block text-[1.6cqw]">{n}</b><span className="text-[#24204a]/55">{r}</span></span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-[4cqw] py-[4cqw]">
                <p className="text-[3.2cqw] font-extrabold tracking-tight">Memberships</p>
                <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
                    {[['Drop-in', '120', 'One class', ['Any class type', 'Mat & grip socks']], ['8 classes', '760', 'Valid 6 weeks', ['Save 21%', 'Book 14 days ahead', 'Free guest pass']], ['Unlimited', '1,250', 'Every month', ['Unlimited classes', 'Priority waitlist', 'Towel service']]].map(([n, p, d, f], i) => (
                        <div key={n as string} className={`rounded-[1.6cqw] p-[2.4cqw] ${i === 1 ? 'bg-[#24204a] text-white' : 'bg-white'}`}>
                            <p className="flex items-center justify-between text-[1.5cqw] font-semibold">{n}{i === 1 && <span className="rounded-full bg-[#d9f99d] px-[1cqw] text-[1cqw] text-[#24204a]">Popular</span>}</p>
                            <p className="mt-[1cqw] text-[3.4cqw] font-extrabold">AED {p}</p>
                            <p className={`text-[1.25cqw] ${i === 1 ? 'text-white/60' : 'text-[#24204a]/50'}`}>{d}</p>
                            <div className="mt-[1.2cqw] space-y-[0.5cqw] text-[1.25cqw]">{(f as string[]).map((x) => <p key={x}>✓ {x}</p>)}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mx-[4cqw] flex items-center justify-between rounded-[2cqw] bg-gradient-to-r from-[#c9c0ff] to-[#f7c9dd] px-[3cqw] py-[2.6cqw]">
                <p className="text-[2.2cqw] font-extrabold">Book in seconds with the FORMA app</p>
                <span className="flex gap-[1cqw] text-[1.2cqw]"><span className="rounded-[0.8cqw] bg-[#24204a] px-[1.6cqw] py-[0.8cqw] text-white"> App Store</span><span className="rounded-[0.8cqw] bg-[#24204a] px-[1.6cqw] py-[0.8cqw] text-white">▶ Google Play</span></span>
            </div>
            <div className="mt-auto flex items-center justify-between px-[4cqw] py-[3cqw] text-[1.25cqw] text-[#24204a]/55">
                <span className="text-[2cqw] font-extrabold text-[#24204a]">FORMA</span>
                <span>Jumeirah 1 · Al Wasl Rd · Open 6am – 9pm</span>
                <span>Instagram · TikTok</span>
            </div>
        </Page>
    )
}

/* Corporate & business — advisory firm */
export function SiteCorporate() {
    return (
        <Page className="bg-white text-[#0e1b33]">
            <div className="flex items-center justify-between border-b border-[#0e1b33]/10 px-[4cqw] py-[2.2cqw] text-[1.45cqw]">
                <span className="text-[2.2cqw] font-semibold tracking-tight">Halden <span className="font-light">&amp; Partners</span></span>
                <span className="flex items-center gap-[3cqw] text-[#0e1b33]/60"><span>Expertise</span><span>Industries</span><span>Insights</span><span>Careers</span><span className="rounded-[0.6cqw] bg-[#0e1b33] px-[2cqw] py-[0.8cqw] text-white">Contact us</span></span>
            </div>
            <div className="grid h-[46cqw] shrink-0 grid-cols-[1.2fr_1fr]">
                <div className="flex flex-col justify-center gap-[2cqw] px-[4cqw]">
                    <p className="text-[1.3cqw] uppercase tracking-[0.25em] text-[#2f6fde]">Strategy · Capital · Growth</p>
                    <p className="text-[5.4cqw] font-semibold leading-[1.02] tracking-tight">Advisory for<br />what comes next.</p>
                    <p className="max-w-[40cqw] text-[1.45cqw] leading-relaxed text-[#0e1b33]/60">We help family businesses and growth companies across the Gulf make their biggest decisions with confidence.</p>
                    <span className="flex gap-[1.2cqw] text-[1.35cqw]"><span className="rounded-[0.6cqw] bg-[#2f6fde] px-[2cqw] py-[1cqw] text-white">Talk to an advisor</span><span className="rounded-[0.6cqw] border border-[#0e1b33]/20 px-[2cqw] py-[1cqw]">Our approach</span></span>
                </div>
                <Ph id="photo-1486406146926-c627a92ad1ab" zoom tint="bg-[#0e1b33]" />
            </div>
            <div className="flex items-center justify-between border-y border-[#0e1b33]/10 px-[4cqw] py-[2.2cqw] text-[1.6cqw] font-semibold text-[#0e1b33]/35">
                {['ALMANA', 'Northwind', 'GULFSTONE', 'Meridian', 'QASR', 'Aurelia'].map((l) => <span key={l} className={l === 'Meridian' || l === 'Aurelia' ? 'italic' : 'tracking-[0.15em]'}>{l}</span>)}
            </div>
            <div className="grid grid-cols-4 gap-[2.4cqw] px-[4cqw] py-[4cqw]">
                {[['01', 'Corporate strategy', 'Growth plans, market entry and portfolio choices.'], ['02', 'Transactions', 'M&A advisory, due diligence and integration.'], ['03', 'Family enterprise', 'Governance, succession and next-gen programs.'], ['04', 'Transformation', 'Operating models that hold up at scale.']].map(([n, t, d]) => (
                    <div key={n} className="border-t-2 border-[#0e1b33] pt-[1.4cqw]">
                        <p className="text-[1.2cqw] text-[#2f6fde]">{n}</p>
                        <p className="mt-[0.6cqw] text-[1.8cqw] font-semibold leading-tight">{t}</p>
                        <p className="mt-[0.8cqw] text-[1.25cqw] leading-relaxed text-[#0e1b33]/55">{d}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 bg-[#0e1b33] text-white">
                <Ph id="photo-1454165804606-c3d57bc86b40" className="aspect-[4/3]" tint="bg-[#1b2c4d]" />
                <div className="flex flex-col justify-center px-[4cqw]">
                    <p className="text-[1.2cqw] uppercase tracking-[0.25em] text-[#7fb0ff]">Case study · Retail</p>
                    <p className="mt-[1cqw] text-[6cqw] font-semibold leading-none">+38%</p>
                    <p className="mt-[1cqw] text-[1.6cqw] leading-snug">EBITDA uplift in 18 months for a regional retail group entering Saudi Arabia.</p>
                    <span className="mt-[1.6cqw] text-[1.3cqw] text-[#7fb0ff]">Read the case →</span>
                </div>
            </div>
            <div className="bg-[#f4f6fa] px-[4cqw] py-[4cqw]">
                <div className="flex items-end justify-between"><p className="text-[3cqw] font-semibold tracking-tight">Latest insights</p><span className="text-[1.3cqw] text-[#2f6fde]">All insights →</span></div>
                <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
                    {[['photo-1497366216548-37526070297c', 'Real estate', 'Where Gulf capital flows in 2027', '6 min read'], ['photo-1521737604893-d14cc237f11d', 'People', 'Building leadership benches', '4 min read'], ['photo-1460925895917-afdab827c52f', 'Markets', 'Five signals for the year ahead', '8 min read']].map(([id, t, h, r]) => (
                        <div key={h} className="overflow-hidden rounded-[1cqw] bg-white">
                            <Ph id={id} className="aspect-[16/10]" />
                            <div className="p-[1.6cqw]"><p className="text-[1.15cqw] uppercase tracking-wider text-[#2f6fde]">{t}</p><p className="mt-[0.6cqw] text-[1.6cqw] font-semibold leading-snug">{h}</p><p className="mt-[0.6cqw] text-[1.15cqw] text-[#0e1b33]/45">{r}</p></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-auto grid grid-cols-4 gap-[2cqw] bg-[#0e1b33] px-[4cqw] py-[3cqw] text-[1.2cqw] text-white/55">
                <div><p className="text-[1.9cqw] font-semibold text-white">Halden &amp; Partners</p><p className="mt-[0.6cqw]">Regulated by the DFSA</p></div>
                {[['Dubai', 'Gate Village 4, DIFC'], ['London', '22 Bishopsgate'], ['Singapore', 'Marina Bay Financial Centre']].map(([c, a]) => <div key={c}><p className="text-white">{c}</p><p>{a}</p></div>)}
            </div>
        </Page>
    )
}

/* Creative agency */
export function SiteAgency() {
    const work = [['photo-1561070791-2526d30994b5', 'Atlas Coffee', 'Identity · Packaging'], ['photo-1542744173-8e7e53415bb0', 'Nomad Air', 'Campaign · Film'], ['photo-1558655146-9f40138edfeb', 'Kite Studios', 'Website · Motion'], ['photo-1476480862126-209bfaa8edc8', 'Run Dubai', 'Social · Event']]
    return (
        <Page className="bg-[#ff5a1f] font-[family-name:var(--font-unbounded)] text-[#111]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.3cqw]">
                <span className="text-[2.4cqw] font-bold">ORBIT°</span>
                <span className="flex gap-[3cqw]"><span>Work</span><span>Studio</span><span>Journal</span></span>
                <span className="rounded-full border border-[#111] px-[2cqw] py-[0.6cqw]">Let&apos;s talk →</span>
            </div>
            <div className="relative h-[44cqw] shrink-0 overflow-hidden">
                <div className="absolute -right-[6cqw] top-[2cqw] size-[44cqw] overflow-hidden rounded-full bg-[#111]">
                    <Ph id="photo-1558655146-9f40138edfeb" className="absolute inset-0 opacity-90 grayscale" tint="bg-[#111]" />
                </div>
                <span className="absolute right-[34cqw] top-[6cqw] rotate-[-12deg] rounded-full bg-[#f4f0e6] px-[1.8cqw] py-[0.8cqw] text-[1.2cqw] font-bold">Now booking 2027 <span className="landing-spin inline-block [animation-duration:6s]">✺</span></span>
                <div className="absolute bottom-[3cqw] left-[4cqw]">
                    <p className="text-[9cqw] font-black leading-[0.85] tracking-tight">WE MAKE<br />NOISE.</p>
                    <p className="mt-[2cqw] max-w-[40cqw] text-[1.35cqw] leading-snug">Brand, film and digital for culture-first companies. Dubai × Lisbon.</p>
                </div>
            </div>
            <div className="overflow-hidden whitespace-nowrap border-y-2 border-[#111] bg-[#f4f0e6] py-[1.2cqw] text-[1.8cqw] font-black">
                <div className="landing-marquee flex w-max gap-[2cqw] [animation-duration:18s]">
                    {[0, 1].map((k) => <span key={k}>ATLAS COFFEE ✺ NOMAD AIR ✺ KITE STUDIOS ✺ RUN DUBAI ✺ SOUK.CO ✺ MIRA HOTELS ✺ </span>)}
                </div>
            </div>
            <div className="bg-[#111] px-[4cqw] py-[4cqw] text-[#f4f0e6]">
                <div className="flex items-end justify-between"><p className="text-[3.4cqw] font-black">SELECTED WORK</p><span className="text-[1.2cqw] text-white/50">2024 — 2026 · 34 projects</span></div>
                <div className="mt-[2.5cqw] grid grid-cols-2 gap-[2cqw]">
                    {work.map(([id, n, t], i) => (
                        <div key={n} className={i % 2 ? 'mt-[4cqw]' : ''}>
                            <Ph id={id} className="aspect-[16/11] rounded-[1cqw]" tint="bg-[#222]" />
                            <p className="mt-[1cqw] flex justify-between text-[1.5cqw] font-bold">{n}<span className="font-normal text-white/50">{t}</span></p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-[1fr_1.4fr] gap-[4cqw] px-[4cqw] py-[4cqw]">
                <p className="text-[3cqw] font-black leading-none">WHAT<br />WE DO</p>
                <div className="space-y-[1cqw] text-[2cqw] font-bold">
                    {['Brand strategy', 'Identity systems', 'Websites & digital', 'Film & motion'].map((s, i) => <p key={s} className="flex justify-between border-b-2 border-[#111] pb-[0.6cqw]">{s}<span className="text-[1.3cqw]">0{i + 1}</span></p>)}
                </div>
            </div>
            <div className="flex items-center gap-[2cqw] px-[4cqw] pb-[3cqw]">
                {['photo-1500648767791-00dcc994a43e', 'photo-1544005313-94ddf0286df2', 'photo-1507003211169-0a1dd7228f2d', 'photo-1438761681033-6461ffad8d80'].map((id) => <Ph key={id} id={id} className="size-[7cqw] rounded-full border-[0.4cqw] border-[#111]" tint="bg-[#111]" />)}
                <p className="text-[1.4cqw] font-bold">22 makers across two studios.<br /><span className="font-normal">We&apos;re hiring a senior motion designer.</span></p>
            </div>
            <div className="mt-auto bg-[#111] px-[4cqw] py-[3cqw] text-[#ff5a1f]">
                <p className="text-[4cqw] font-black leading-none">HELLO@ORBIT.STUDIO</p>
                <p className="mt-[1.4cqw] flex justify-between text-[1.2cqw] text-white/50"><span>Instagram · Behance · LinkedIn</span><span>© ORBIT Studio 2026</span></p>
            </div>
        </Page>
    )
}

/* Portfolio — landscape photographer */
export function SitePortfolio() {
    const frames = [
        'photo-1469474968028-56623f02e42e', 'photo-1506905925346-21bda4d32df4', 'photo-1470071459604-3b5ec3a7fe05',
        'photo-1501785888041-af3ef285b470', 'photo-1500530855697-b586d89ba3ee', 'photo-1441974231531-c6227db76b6e',
    ]
    return (
        <Page className="bg-[#fafaf7] font-[family-name:var(--font-geist-mono)] text-[#111]">
            <div className="flex items-baseline justify-between px-[3.5cqw] py-[2.4cqw] text-[1.25cqw]">
                <span className="font-[family-name:var(--font-instrument)] text-[2.6cqw] italic">Lina Haddad</span>
                <span className="flex gap-[2.4cqw] text-black/50"><span className="text-black underline">Index</span><span>Series</span><span>Prints</span><span>Info</span></span>
            </div>
            <p className="px-[3.5cqw] pb-[2.4cqw] font-[family-name:var(--font-instrument)] text-[3.6cqw] leading-[1.05]">Photographer working with <em>light, land</em> and the long wait for both.</p>
            <div className="grid h-[62cqw] shrink-0 grid-cols-6 grid-rows-3 gap-[1.2cqw] px-[3.5cqw]">
                {frames.map((id, i) => (
                    <div key={id} className={`relative ${['col-span-4 row-span-2', 'col-span-2', 'col-span-2', 'col-span-2', 'col-span-2', 'col-span-2'][i]}`}>
                        <Ph id={id} className="absolute inset-0 rounded-[0.5cqw]" />
                        <span className="absolute bottom-[0.8cqw] left-[0.8cqw] text-[1.05cqw] text-white mix-blend-difference">{String(i + 1).padStart(2, '0')} — {['Musandam', 'Jebel Shams', 'Fog study', 'Wadi Bani Khalid', 'Road to Sur', 'Salalah'][i]}</span>
                    </div>
                ))}
            </div>
            <div className="px-[3.5cqw] py-[3.5cqw]">
                <p className="text-[1.15cqw] text-black/45">SERIES</p>
                {[['Light studies, Oman', '2026', '24 frames'], ['Salt & horizon', '2025', '18 frames'], ['The waiting room', '2023', '40 frames']].map(([t, y, n]) => (
                    <p key={t} className="flex items-baseline justify-between border-b border-black/10 py-[1.2cqw]"><span className="font-[family-name:var(--font-instrument)] text-[2.6cqw]">{t}</span><span className="text-[1.25cqw] text-black/50">{y} · {n}</span></p>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-[4cqw] px-[3.5cqw] pb-[3.5cqw] text-[1.25cqw]">
                <div><p className="text-black/45">EXHIBITIONS</p><p className="mt-[0.8cqw] leading-relaxed">2026 — Galerie Nour, Dubai (solo)<br />2025 — Photo Oman, Muscat<br />2024 — Paris Photo, emerging section</p></div>
                <div><p className="text-black/45">PRINTS</p><p className="mt-[0.8cqw] leading-relaxed">Archival pigment prints in editions of ten, signed and numbered. Shipped framed worldwide.</p><span className="mt-[1cqw] inline-block border-b border-black">Enquire about a print →</span></div>
            </div>
            <div className="mt-auto flex justify-between border-t border-black/10 px-[3.5cqw] py-[2.4cqw] text-[1.15cqw] text-black/50"><span>Represented by Galerie Nour</span><span>studio@linahaddad.photo</span><span>@linahaddad</span></div>
        </Page>
    )
}

/* Custom interactive — product configurator (the colour swatches really recolour the product) */
export function SiteInteractive() {
    const finishes = [['Midnight', '#3c5fd6', 0], ['Sand', '#e9e4da', 160], ['Graphite', '#1f1f1f', 90], ['Ember', '#d36b4b', 300]] as const
    const [pick, setPick] = useState(0)
    const touched = useRef(false)
    useEffect(() => {
        const t = setInterval(() => { if (!touched.current) setPick((p) => (p + 1) % 4) }, 2800)
        return () => clearInterval(t)
    }, [])
    const choose = (i: number) => { touched.current = true; setPick(i) }
    const [name, swatch, hue] = finishes[pick]
    return (
        <Page className="bg-[#0c0f14] text-white">
            <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.35cqw] text-white/60">
                <span className="text-[2.4cqw] font-semibold tracking-tight text-white">AERO</span>
                <span className="flex gap-[3cqw]"><span className="text-white">Headphones</span><span>Speakers</span><span>Accessories</span><span>Support</span></span>
                <span>Bag (1)</span>
            </div>
            <div className="grid h-[46cqw] shrink-0 grid-cols-[1.3fr_1fr]">
                <div className="relative grid place-items-center overflow-hidden">
                    <div className="absolute size-[40cqw] rounded-full blur-[4cqw] transition-colors duration-500" style={{ background: `${swatch}55` }} />
                    <Ph id="photo-1505740420928-5e560c06d30e" className="relative aspect-square w-[78%] rounded-[2cqw]" tint="bg-[#1b2230]" style={{ filter: `hue-rotate(${hue}deg)${pick === 2 ? ' grayscale(1) brightness(.7)' : ''}`, transition: 'filter .5s' }} />
                    <span className="absolute bottom-[2cqw] left-[3cqw] text-[1.15cqw] text-white/40">Tap a finish to preview it · 360° view</span>
                </div>
                <div className="flex flex-col justify-center gap-[1.6cqw] border-l border-white/10 p-[3.5cqw] text-[1.45cqw]">
                    <span className="flex items-center gap-[1cqw] text-[1.2cqw] text-white/50"><Stars className="text-[#ffd166]" /> 4.9 · 2,031 reviews</span>
                    <span className="text-[3cqw] font-semibold tracking-tight">AERO One</span>
                    <span className="text-white/50">Finish · <span className="text-white">{name}</span></span>
                    <div className="flex gap-[1.2cqw]">
                        {finishes.map(([n, c], i) => (
                            <button key={n} type="button" aria-label={`${n} finish`} onClick={() => choose(i)}
                                className={`size-[4.2cqw] rounded-full transition-transform hover:scale-110 ${i === pick ? 'ring-[0.4cqw] ring-white ring-offset-[0.4cqw] ring-offset-[#0c0f14]' : ''}`}
                                style={{ background: c }} />
                        ))}
                    </div>
                    <span className="text-white/50">Size</span>
                    <div className="grid grid-cols-2 gap-[1cqw]"><span className="rounded-[1cqw] bg-white py-[1cqw] text-center text-black">Compact</span><span className="rounded-[1cqw] border border-white/20 py-[1cqw] text-center">Studio +AED 300</span></div>
                    <span className="text-white/50">Engraving · <span className="text-white">“Made for you”</span></span>
                    <span className="mt-[0.6cqw] rounded-full bg-[#5b8cff] py-[1.3cqw] text-center">Add to bag · AED 1,290</span>
                    <span className="text-center text-[1.15cqw] text-white/45">Ships in 2 days · 2-year warranty</span>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-[1.6cqw] px-[4cqw] py-[4cqw]">
                {[['40h', 'Battery life'], ['−38 dB', 'Adaptive ANC'], ['240 g', 'Aluminium & leather'], ['LDAC', 'Hi-res wireless']].map(([v, k]) => (
                    <div key={k} className="rounded-[1.6cqw] bg-white/5 p-[2cqw]"><p className="text-[3.4cqw] font-semibold tracking-tight">{v}</p><p className="text-[1.25cqw] text-white/50">{k}</p></div>
                ))}
            </div>
            <div className="grid grid-cols-2 items-center gap-[4cqw] px-[4cqw] pb-[4cqw]">
                <Ph id="photo-1546435770-a3e426bf472b" className="aspect-[4/3] rounded-[1.6cqw]" tint="bg-[#1b2230]" />
                <div>
                    <p className="text-[1.2cqw] uppercase tracking-[0.2em] text-[#5b8cff]">Designed in Dubai</p>
                    <p className="mt-[1cqw] text-[3.2cqw] font-semibold leading-tight tracking-tight">Silence, tuned<br />to your ears.</p>
                    <p className="mt-[1.2cqw] text-[1.35cqw] leading-relaxed text-white/55">Twelve microphones map the shape of your ear in seconds and tune the noise cancelling to you.</p>
                </div>
            </div>
            <div className="mx-[4cqw] rounded-[1.6cqw] bg-white/5 p-[2.4cqw] text-[1.3cqw]">
                <p className="mb-[1.2cqw] text-[1.8cqw] font-semibold">Compare</p>
                {[['', 'Compact', 'Studio'], ['Battery', '40h', '60h'], ['Drivers', '40 mm', '50 mm beryllium'], ['Case', 'Fabric', 'Leather']].map((r, i) => (
                    <div key={i} className={`grid grid-cols-3 py-[0.8cqw] ${i ? 'border-t border-white/10' : 'text-white/45'}`}>{r.map((c, j) => <span key={j}>{c}</span>)}</div>
                ))}
            </div>
            <div className="flex justify-center gap-[5cqw] px-[4cqw] py-[3.5cqw] text-center text-[1.35cqw] text-white/70">
                {[['“Best noise cancelling of the year.”', 'Tech Review Arabia'], ['“Quietly brilliant.”', 'Sound & Form']].map(([q, s]) => <p key={s}><span className="block text-[1.8cqw] italic text-white">{q}</span>{s}</p>)}
            </div>
            <div className="mt-auto flex justify-between border-t border-white/10 px-[4cqw] py-[3cqw] text-[1.25cqw] text-white/50"><span className="font-semibold text-white">AERO Audio</span><span>Free engraving · 30-day trial · Free UAE delivery</span></div>
        </Page>
    )
}

/* Fashion store — modest-wear label */
export function SiteFashion() {
    const items = [['photo-1490481651871-ab68de25d43d', 'Linen abaya', 'Sand', '640', 'New'], ['photo-1483985988355-763728e1935b', 'Silk shayla', 'Blush', '210', ''], ['photo-1434389677669-e08b4cac3105', 'Pleated kaftan', 'Olive', '480', 'Low stock'], ['photo-1469334031218-e382a71b716b', 'Crepe set', 'Ivory', '720', 'New']]
    return (
        <Page className="bg-white text-[#1d1d1b]">
            <div className="bg-[#efe6d8] py-[0.8cqw] text-center text-[1.15cqw] tracking-[0.1em]">Eid edit now live · Complimentary delivery on orders over AED 500</div>
            <div className="flex items-center justify-between border-b border-black/5 px-[4cqw] py-[2cqw] text-[1.35cqw]">
                <span className="flex gap-[2.4cqw] text-black/60"><span>New in</span><span>Abayas</span><span>Kaftans</span><span>Scarves</span><span>Edits</span></span>
                <span className="text-[2.6cqw] font-medium tracking-[0.35em]">NOOR</span>
                <span className="flex items-center gap-[2cqw] text-black/60"><span>Search</span><Heart className="size-[1.8cqw]" /><span>Bag (2)</span></span>
            </div>
            <div className="relative h-[46cqw] shrink-0">
                <Slides ids={['photo-1515886657613-9f3515b0c78f', 'photo-1469334031218-e382a71b716b', 'photo-1485462537746-965f33f7f6a7']} className="absolute inset-0" tint="bg-[#e8dccb]" />
                <Toast className="right-[4cqw] top-[3cqw]" delay={2.5}><Ph id="photo-1483985988355-763728e1935b" className="size-[3.6cqw]" tint="bg-[#ece4d8]" /><span><b>Back in stock</b><br /><span className="text-black/50">Silk shayla · Blush</span></span></Toast>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-[3cqw] left-[4cqw] text-white">
                    <p className="text-[1.25cqw] uppercase tracking-[0.3em]">Resort 2026</p>
                    <p className="font-[family-name:var(--font-fraunces)] text-[5.4cqw] font-light leading-none">Soft light, <em>slow days</em></p>
                    <span className="mt-[1.6cqw] inline-block border-b border-white pb-[0.3cqw] text-[1.3cqw] uppercase tracking-[0.2em]">Shop the collection</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-[1.6cqw] px-[4cqw] py-[3cqw]">
                {[['photo-1445205170230-053b83016050', 'Abayas'], ['photo-1485462537746-965f33f7f6a7', 'Kaftans'], ['photo-1483985988355-763728e1935b', 'Scarves']].map(([id, n]) => (
                    <div key={n} className="relative"><Ph id={id} className="aspect-[4/3]" tint="bg-[#ece4d8]" /><span className="absolute bottom-[1.2cqw] left-[1.4cqw] bg-white px-[1.4cqw] py-[0.5cqw] text-[1.3cqw] tracking-[0.15em]">{n}</span></div>
                ))}
            </div>
            <div className="px-[4cqw] pb-[3cqw]">
                <div className="flex items-end justify-between"><p className="font-[family-name:var(--font-fraunces)] text-[3cqw] font-light">New this week</p><span className="text-[1.25cqw] text-black/50">Filter · Sort: Newest</span></div>
                <div className="mt-[1.6cqw] grid grid-cols-4 gap-[1.6cqw]">
                    {items.map(([id, n, c, p, tag]) => (
                        <div key={n}>
                            <div className="relative"><Ph id={id} className="aspect-[3/4]" tint="bg-[#ece4d8]" />
                                {tag && <span className="absolute left-[1cqw] top-[1cqw] bg-white px-[1cqw] py-[0.3cqw] text-[1cqw] tracking-[0.1em]">{tag}</span>}
                                <Heart className="absolute right-[1cqw] top-[1cqw] size-[1.8cqw] text-white" />
                            </div>
                            <p className="mt-[0.8cqw] text-[1.35cqw]">{n}</p>
                            <p className="flex justify-between text-[1.2cqw] text-black/50"><span>{c}</span><span>AED {p}</span></p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mx-[4cqw] grid grid-cols-[1.3fr_1fr] items-center gap-[3cqw] bg-[#efe6d8] px-[3cqw] py-[2.6cqw]">
                <p className="font-[family-name:var(--font-fraunces)] text-[2.4cqw] font-light leading-tight">Join the NOOR list for <em>first access</em> to new edits</p>
                <div className="flex gap-[1cqw] text-[1.25cqw]"><span className="flex-1 border-b border-black/30 py-[0.8cqw] text-black/40">Email address</span><span className="bg-[#1d1d1b] px-[1.8cqw] py-[0.8cqw] text-white">Join</span></div>
            </div>
            <div className="mt-auto grid grid-cols-4 gap-[2cqw] bg-[#1d1d1b] px-[4cqw] py-[3cqw] text-[1.2cqw] text-white/55">
                <div><p className="tracking-[0.3em] text-white">NOOR</p><p className="mt-[0.6cqw]">Made in the UAE</p></div>
                {[['Help', 'Size guide', 'Delivery', 'Returns'], ['About', 'Our atelier', 'Journal', 'Stockists'], ['Follow', 'Instagram', 'Pinterest', 'TikTok']].map(([h, ...l]) => (
                    <div key={h} className="space-y-[0.4cqw]"><p className="text-white">{h}</p>{l.map((x) => <p key={x}>{x}</p>)}</div>
                ))}
            </div>
        </Page>
    )
}

export const showcase = [
    { key: 'store', label: 'E-commerce', brand: 'STRIDE', url: 'stride.ae', Site: SiteStore, dark: false, glow: '#c6ff3d' },
    { key: 'luxury', label: 'Fashion & luxury', brand: 'Maison Véra', url: 'maisonvera.com', Site: SiteLuxury, dark: true, glow: '#c9a96a' },
    { key: 'hotel', label: 'Hospitality', brand: 'Sahra Retreat', url: 'sahraretreat.ae', Site: SiteHotel, dark: false, glow: '#e88c5d' },
    { key: 'restaurant', label: 'Restaurants', brand: 'Olive & Ember', url: 'oliveandember.ae', Site: SiteRestaurant, dark: false, glow: '#b9825a' },
    { key: 'corporate', label: 'Corporate', brand: 'Halden & Partners', url: 'haldenpartners.com', Site: SiteCorporate, dark: false, glow: '#2f6fde' },
    { key: 'portfolio', label: 'Portfolio', brand: 'Lina Haddad', url: 'linahaddad.photo', Site: SitePortfolio, dark: false, glow: '#c19a6b' },
    { key: 'agency', label: 'Creative agency', brand: 'ORBIT°', url: 'orbit.studio', Site: SiteAgency, dark: false, glow: '#ff5a1f' },
    { key: 'booking', label: 'Booking & services', brand: 'FORMA', url: 'formapilates.ae', Site: SiteBooking, dark: false, glow: '#c9c0ff' },
    { key: 'interactive', label: 'Custom interactive', brand: 'AERO One', url: 'aero.audio', Site: SiteInteractive, dark: true, glow: '#5b8cff' },
] as const
