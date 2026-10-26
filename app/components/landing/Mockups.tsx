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

/* A full page, taller than the frame; hovering the screen scrolls to its end */
function Page({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`absolute inset-x-0 top-0 flex h-[200%] flex-col transition-transform duration-[6000ms] ease-in-out group-hover/screen:-translate-y-1/2 motion-reduce:transition-none ${className}`}>
            {children}
        </div>
    )
}

/* Photograph with a tinted fallback so a slow or failed load never leaves a hole */
function Ph({ id, className = '', tint = 'bg-[#d9d4cb]', style }: { id: string; className?: string; tint?: string; style?: React.CSSProperties }) {
    // Hidden until it has really loaded (also covers loads that finish before hydration)
    const img = useRef<HTMLImageElement>(null)
    useEffect(() => {
        const el = img.current
        if (el?.complete && el.naturalWidth > 0) el.style.opacity = '1'
    }, [])
    return (
        <div className={`relative overflow-hidden ${tint} ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`}
                alt=""
                loading="lazy"
                decoding="async"
                ref={img}
                onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
                style={style}
            />
        </div>
    )
}

/* Fashion & luxury — fine jewellery house */
export function SiteLuxury() {
    const pieces = [
        ['photo-1605100804763-247f67b3557e', 'Eternity band', '18,500'],
        ['photo-1599643478518-a784e5dc4c8f', 'Solène necklace', '24,900'],
        ['photo-1535632066927-ab7c9ab60908', 'Halo earrings', '12,300'],
    ]
    return (
        <Page className="bg-[#0b0a08] text-[#e9dcc0]">
            <div className="flex items-center justify-between px-[5cqw] py-[2.6cqw] text-[1.3cqw] uppercase tracking-[0.3em] text-[#e9dcc0]/60">
                <span>Collections</span>
                <span className="font-[family-name:var(--font-fraunces)] text-[2.6cqw] normal-case tracking-[0.2em] text-[#e9dcc0]">MAISON VÉRA</span>
                <span>Boutiques</span>
            </div>
            <div className="grid flex-[1.25] grid-cols-[1fr_1.1fr] items-stretch">
                <div className="flex flex-col justify-center px-[5cqw]">
                    <p className="text-[1.3cqw] uppercase tracking-[0.3em] text-[#c9a96a]">The Eternity Collection</p>
                    <p className="mt-[1.5cqw] font-[family-name:var(--font-fraunces)] text-[6.2cqw] font-light leading-[0.95]">Light,<br /><em>held forever.</em></p>
                    <p className="mt-[2cqw] max-w-[30cqw] text-[1.4cqw] leading-relaxed text-[#e9dcc0]/60">Hand-set diamonds in 18k gold, finished in our Dubai atelier.</p>
                    <span className="mt-[3cqw] w-max border-b border-[#c9a96a] pb-[0.4cqw] text-[1.4cqw] uppercase tracking-[0.25em]">Discover</span>
                </div>
                <Ph id="photo-1605100804763-247f67b3557e" tint="bg-[#2a2217]" />
            </div>
            <div className="flex-1 px-[5cqw] py-[4cqw]">
                <div className="flex items-end justify-between">
                    <p className="font-[family-name:var(--font-fraunces)] text-[3.4cqw] font-light">New arrivals</p>
                    <span className="text-[1.3cqw] uppercase tracking-[0.25em] text-[#c9a96a]">View all</span>
                </div>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2.5cqw]">
                    {pieces.map(([id, n, p]) => (
                        <div key={n}>
                            <Ph id={id} className="aspect-[4/5]" tint="bg-[#241d14]" />
                            <p className="mt-[1.2cqw] font-[family-name:var(--font-fraunces)] text-[1.9cqw]">{n}</p>
                            <p className="text-[1.3cqw] text-[#e9dcc0]/50">AED {p}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#e9dcc0]/10 px-[5cqw] py-[3cqw] text-[1.3cqw] text-[#e9dcc0]/50">
                <span className="font-[family-name:var(--font-fraunces)] text-[2cqw] tracking-[0.2em] text-[#e9dcc0]">MV</span>
                <span>Book a private appointment · Dubai · Paris · Doha</span>
            </div>
        </Page>
    )
}

/* Hospitality — boutique desert hotel */
export function SiteHotel() {
    const rooms = [
        ['photo-1582719478250-c89cae4dc85b', 'Dune Suite', '2,450'],
        ['photo-1566073771259-6a8506099945', 'Pool Villa', '3,900'],
        ['photo-1542314831-068cd1dbfeeb', 'Oasis Room', '1,650'],
    ]
    return (
        <Page className="bg-[#f2e8d9] text-[#3a2a1c]">
            <div className="relative flex flex-[1.3] flex-col">
                <Ph id="photo-1509316785289-025f5b846b35" className="absolute inset-0" tint="bg-gradient-to-b from-[#f6b984] to-[#a8573a]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                <div className="relative flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.4cqw] text-white">
                    <span className="font-[family-name:var(--font-instrument)] text-[3cqw] italic">Sahra</span>
                    <span className="flex gap-[3cqw] uppercase tracking-[0.2em] text-white/80"><span>Suites</span><span>Dining</span><span>Spa</span></span>
                </div>
                <div className="relative mt-auto px-[4cqw] pb-[3cqw]">
                    <p className="font-[family-name:var(--font-instrument)] text-[6.4cqw] leading-none text-white">Where the dunes<br /><em>meet the stars</em></p>
                    <div className="mt-[2.5cqw] grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-[2cqw] rounded-[1.4cqw] bg-white/95 px-[3cqw] py-[1.8cqw] text-[1.4cqw]">
                        {[['Check in', '12 Dec'], ['Check out', '15 Dec'], ['Guests', '2 adults']].map(([k, v]) => (
                            <span key={k}><span className="block text-[1.1cqw] uppercase tracking-[0.15em] text-[#3a2a1c]/50">{k}</span>{v}</span>
                        ))}
                        <span className="rounded-full bg-[#3a2a1c] px-[2.4cqw] py-[1cqw] text-[#f2e8d9]">Reserve</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 px-[4cqw] py-[4cqw]">
                <p className="text-[1.2cqw] uppercase tracking-[0.25em] text-[#a8573a]">Stay</p>
                <p className="font-[family-name:var(--font-instrument)] text-[3.6cqw] leading-tight">Suites shaped by the desert</p>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2cqw]">
                    {rooms.map(([id, n, p]) => (
                        <div key={n} className="overflow-hidden rounded-[1.2cqw] bg-white">
                            <Ph id={id} className="aspect-[4/3]" />
                            <div className="p-[1.6cqw] text-[1.4cqw]"><p className="font-semibold">{n}</p><p className="text-[#3a2a1c]/55">from AED {p} / night</p></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between bg-[#3a2a1c] px-[4cqw] py-[3cqw] text-[1.3cqw] text-[#f2e8d9]/70">
                <span className="font-[family-name:var(--font-instrument)] text-[2.4cqw] italic text-[#f2e8d9]">Sahra</span>
                <span>Al Faya Desert · 45 minutes from Dubai</span>
            </div>
        </Page>
    )
}

/* Booking & services — pilates studio */
export function SiteBooking() {
    const classes = [['07:00', 'Reformer Flow', 'Maya', '3 left'], ['09:30', 'Core & Stretch', 'Lea', 'Full'], ['18:00', 'Power Reformer', 'Sami', '5 left']]
    return (
        <Page className="bg-[#f6f3ff] font-[family-name:var(--font-manrope)] text-[#24204a]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.5cqw]">
                <span className="text-[2.6cqw] font-extrabold tracking-tight">FORMA</span>
                <span className="flex items-center gap-[3cqw] text-[#24204a]/60"><span>Classes</span><span>Pricing</span><span className="rounded-full bg-[#24204a] px-[2cqw] py-[0.8cqw] text-white">Book</span></span>
            </div>
            <div className="grid flex-[1.2] grid-cols-[1fr_1.15fr] gap-[3cqw] px-[4cqw] pb-[3cqw]">
                <div className="relative overflow-hidden rounded-[2cqw]">
                    <Ph id="photo-1518611012118-696072aa579a" className="absolute inset-0" tint="bg-gradient-to-b from-[#c9c0ff] to-[#f7c9dd]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#24204a]/70 to-transparent" />
                    <p className="absolute bottom-[3cqw] left-[3cqw] text-[4.6cqw] font-bold leading-[1] text-white">Move with<br />intention.</p>
                </div>
                <div className="flex flex-col gap-[1.4cqw]">
                    <div className="flex gap-[1cqw] text-[1.4cqw]">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                            <span key={d} className={`flex-1 rounded-[1.2cqw] py-[1cqw] text-center ${i === 2 ? 'bg-[#24204a] text-white' : 'bg-white'}`}>{d}<span className="block text-[2cqw] font-bold">{10 + i}</span></span>
                        ))}
                    </div>
                    {classes.map(([t, n, c, s]) => (
                        <div key={t} className="flex items-center gap-[2cqw] rounded-[1.4cqw] bg-white p-[1.7cqw] text-[1.5cqw]">
                            <span className="font-bold">{t}</span>
                            <span className="flex-1"><span className="block font-semibold">{n}</span><span className="text-[#24204a]/50">with {c} · 50 min</span></span>
                            <span className={`rounded-full px-[1.6cqw] py-[0.6cqw] ${s === 'Full' ? 'bg-[#eee] text-[#999]' : 'bg-[#d9f99d]'}`}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white px-[4cqw] py-[4cqw]">
                <p className="text-[3.4cqw] font-extrabold tracking-tight">Memberships</p>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2cqw]">
                    {[['Drop-in', '120', 'One class'], ['8 classes', '760', 'Valid 6 weeks'], ['Unlimited', '1,250', 'Every month']].map(([n, p, d], i) => (
                        <div key={n} className={`rounded-[1.6cqw] p-[2.4cqw] ${i === 1 ? 'bg-[#24204a] text-white' : 'bg-[#f6f3ff]'}`}>
                            <p className="text-[1.5cqw] font-semibold">{n}</p>
                            <p className="mt-[1cqw] text-[3.6cqw] font-extrabold">AED {p}</p>
                            <p className={`text-[1.3cqw] ${i === 1 ? 'text-white/60' : 'text-[#24204a]/50'}`}>{d}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between px-[4cqw] py-[3cqw] text-[1.3cqw] text-[#24204a]/60">
                <span className="text-[2cqw] font-extrabold text-[#24204a]">FORMA</span>
                <span>Jumeirah 1 · Open 6am – 9pm</span>
            </div>
        </Page>
    )
}

/* Corporate & business — advisory firm */
export function SiteCorporate() {
    return (
        <Page className="bg-white text-[#0e1b33]">
            <div className="flex items-center justify-between border-b border-[#0e1b33]/10 px-[4cqw] py-[2.2cqw] text-[1.5cqw]">
                <span className="text-[2.2cqw] font-semibold tracking-tight">Halden <span className="font-light">&amp; Partners</span></span>
                <span className="flex items-center gap-[3cqw] text-[#0e1b33]/60"><span>Expertise</span><span>Insights</span><span className="rounded-[0.6cqw] bg-[#0e1b33] px-[2cqw] py-[0.8cqw] text-white">Contact</span></span>
            </div>
            <div className="grid flex-[1.2] grid-cols-[1.2fr_1fr]">
                <div className="flex flex-col justify-center gap-[2cqw] px-[4cqw]">
                    <p className="text-[1.3cqw] uppercase tracking-[0.25em] text-[#2f6fde]">Strategy · Capital · Growth</p>
                    <p className="text-[5.4cqw] font-semibold leading-[1.02] tracking-tight">Advisory for<br />what comes next.</p>
                    <div className="grid grid-cols-3 gap-[2cqw] border-t border-[#0e1b33]/10 pt-[2cqw] text-[1.3cqw] text-[#0e1b33]/60">
                        {[['20+', 'Markets'], ['140', 'Advisors'], ['1998', 'Founded']].map(([v, k]) => <span key={k}><span className="block text-[3cqw] font-semibold text-[#0e1b33]">{v}</span>{k}</span>)}
                    </div>
                </div>
                <Ph id="photo-1486406146926-c627a92ad1ab" tint="bg-[#0e1b33]" />
            </div>
            <div className="flex-1 bg-[#f4f6fa] px-[4cqw] py-[4cqw]">
                <p className="text-[3.2cqw] font-semibold tracking-tight">Latest insights</p>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2cqw]">
                    {[['photo-1497366216548-37526070297c', 'Real estate', 'Where Gulf capital flows in 2027'], ['photo-1521737604893-d14cc237f11d', 'People', 'Building leadership benches'], ['photo-1460925895917-afdab827c52f', 'Markets', 'Five signals for the year ahead']].map(([id, t, h]) => (
                        <div key={h} className="overflow-hidden rounded-[1cqw] bg-white">
                            <Ph id={id} className="aspect-[16/10]" />
                            <div className="p-[1.6cqw]"><p className="text-[1.2cqw] uppercase tracking-wider text-[#2f6fde]">{t}</p><p className="mt-[0.6cqw] text-[1.6cqw] font-semibold leading-snug">{h}</p></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between bg-[#0e1b33] px-[4cqw] py-[3cqw] text-[1.3cqw] text-white/60">
                <span className="text-[1.9cqw] font-semibold text-white">Halden &amp; Partners</span>
                <span>DIFC, Dubai · London · Singapore</span>
            </div>
        </Page>
    )
}

/* Creative agency */
export function SiteAgency() {
    return (
        <Page className="bg-[#ff5a1f] font-[family-name:var(--font-unbounded)] text-[#111]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.4cqw]">
                <span className="text-[2.4cqw] font-bold">ORBIT°</span>
                <span className="rounded-full border border-[#111] px-[2cqw] py-[0.6cqw]">Let&apos;s talk</span>
            </div>
            <div className="relative flex-[1.15] overflow-hidden">
                <div className="absolute -right-[6cqw] top-[2cqw] size-[44cqw] overflow-hidden rounded-full bg-[#111]">
                    <Ph id="photo-1558655146-9f40138edfeb" className="absolute inset-0 opacity-90 grayscale" tint="bg-[#111]" />
                </div>
                <div className="absolute bottom-[3cqw] left-[4cqw]">
                    <p className="text-[9cqw] font-black leading-[0.85] tracking-tight">WE MAKE<br />NOISE.</p>
                    <p className="mt-[2cqw] max-w-[40cqw] text-[1.4cqw] leading-snug">Brand, film and digital for culture-first companies.</p>
                </div>
            </div>
            <div className="flex-1 bg-[#111] px-[4cqw] py-[4cqw] text-[#f4f0e6]">
                <div className="flex items-end justify-between"><p className="text-[3.4cqw] font-black">SELECTED WORK</p><span className="text-[1.3cqw] text-white/50">2024 — 2026</span></div>
                <div className="mt-[2.5cqw] grid grid-cols-2 gap-[2cqw]">
                    {[['photo-1561070791-2526d30994b5', 'Atlas Coffee', 'Identity'], ['photo-1542744173-8e7e53415bb0', 'Nomad Air', 'Campaign']].map(([id, n, t]) => (
                        <div key={n}>
                            <Ph id={id} className="aspect-[16/10] rounded-[1cqw]" tint="bg-[#222]" />
                            <p className="mt-[1cqw] flex justify-between text-[1.6cqw] font-bold">{n}<span className="font-normal text-white/50">{t}</span></p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-[#111] px-[4cqw] pb-[3cqw] text-[3cqw] font-black leading-none text-[#ff5a1f]">HELLO@ORBIT.STUDIO</div>
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
            <div className="flex items-baseline justify-between px-[3.5cqw] py-[2.4cqw] text-[1.3cqw]">
                <span className="font-[family-name:var(--font-instrument)] text-[2.6cqw] italic">Lina Haddad</span>
                <span className="text-black/50">Index · Commissions · Info</span>
            </div>
            <div className="grid flex-[2] grid-cols-6 grid-rows-3 gap-[1.2cqw] px-[3.5cqw]">
                {frames.map((id, i) => (
                    <div key={id} className={`relative ${['col-span-4 row-span-2', 'col-span-2', 'col-span-2', 'col-span-2', 'col-span-2', 'col-span-2'][i]}`}>
                        <Ph id={id} className="absolute inset-0 rounded-[0.5cqw]" />
                        <span className="absolute bottom-[0.8cqw] left-[0.8cqw] text-[1.1cqw] text-white/90 mix-blend-difference">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                ))}
            </div>
            <div className="flex-1 px-[3.5cqw] py-[3.5cqw]">
                <p className="font-[family-name:var(--font-instrument)] text-[4cqw] italic leading-tight">Light studies, Oman — 2026</p>
                <p className="mt-[1.5cqw] max-w-[60cqw] text-[1.4cqw] leading-relaxed text-black/60">Twenty-four frames made over six weeks on the Musandam coast and in the Hajar mountains. Prints available in editions of ten.</p>
                <span className="mt-[2.5cqw] inline-block border-b border-black text-[1.4cqw]">Enquire about prints →</span>
            </div>
            <div className="flex justify-between border-t border-black/10 px-[3.5cqw] py-[2.5cqw] text-[1.2cqw] text-black/50"><span>Represented by Galerie Nour</span><span>@linahaddad</span></div>
        </Page>
    )
}

/* Restaurant */
export function SiteRestaurant() {
    const dishes = [['photo-1504674900247-0877df9cc836', 'Ember-roasted salmon', '96'], ['photo-1509042239860-f550ce710b93', 'Spanish latte', '22'], ['photo-1565299624946-b28f40a0ae38', 'Wood-fired flatbread', '58']]
    return (
        <Page className="bg-[#f3ece1] text-[#3b2f24]">
            <div className="relative flex flex-[1.2] flex-col">
                <Ph id="photo-1555396273-367ea4eb4db5" className="absolute inset-0" tint="bg-gradient-to-br from-[#c9a27c] to-[#7d5236]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.3cqw] uppercase tracking-[0.2em] text-white/85">
                    <span className="font-[family-name:var(--font-instrument)] text-[3cqw] normal-case tracking-normal text-white">Olive &amp; Ember</span>
                    <span className="flex gap-[3cqw]"><span>Menu</span><span>Visit</span></span>
                </div>
                <div className="relative mt-auto px-[4cqw] pb-[4cqw] text-[#fff8ee]">
                    <p className="text-[1.3cqw] uppercase tracking-[0.25em]">Café &amp; kitchen · Dubai Marina</p>
                    <p className="mt-[1.5cqw] font-[family-name:var(--font-instrument)] text-[6.4cqw] leading-[0.95]">Slow coffee,<br /><em>warm</em> plates</p>
                    <span className="mt-[2.5cqw] inline-block rounded-full bg-[#fff8ee] px-[2.5cqw] py-[1cqw] text-[1.5cqw] text-[#3b2f24]">Book a table</span>
                </div>
            </div>
            <div className="flex-1 px-[4cqw] py-[4cqw]">
                <p className="font-[family-name:var(--font-instrument)] text-[3.6cqw]">From the kitchen</p>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2cqw]">
                    {dishes.map(([id, n, p]) => (
                        <div key={n}>
                            <Ph id={id} className="aspect-square rounded-[1.2cqw]" tint="bg-[#e2d2bd]" />
                            <p className="mt-[1cqw] flex justify-between text-[1.5cqw]">{n}<span className="text-[#3b2f24]/60">{p}</span></p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-[2cqw] bg-[#3b2f24] px-[4cqw] py-[3cqw] text-[1.4cqw] text-[#f3ece1]">
                <span>Open daily 7:30 – 23:00 · Marina Walk, Dubai</span>
                <span className="rounded-full bg-[#f3ece1] px-[2.4cqw] py-[1cqw] text-[#3b2f24]">Reserve</span>
            </div>
        </Page>
    )
}

/* E-commerce — sneaker store */
export function SiteStore() {
    const grid = [['photo-1549298916-b41d501d3772', 'Court Classic', '429'], ['photo-1606107557195-0e29a4b5b4aa', 'Trail Pro', '619'], ['photo-1460353581641-37baddab0fa2', 'Daily Knit', '389']]
    return (
        <Page className="bg-[#f4f4f1] font-[family-name:var(--font-manrope)] text-[#0f0f0f]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.5cqw]">
                <span className="text-[2.8cqw] font-extrabold italic tracking-tighter">STRIDE</span>
                <span className="flex items-center gap-[3cqw]"><span>Men</span><span>Women</span><span className="rounded-full bg-[#0f0f0f] px-[1.6cqw] py-[0.5cqw] text-white">Bag · 2</span></span>
            </div>
            <div className="grid flex-[1.2] grid-cols-[1.25fr_1fr] gap-[3cqw] px-[4cqw] pb-[3cqw]">
                <div className="relative overflow-hidden rounded-[2cqw] bg-[#c6ff3d]">
                    <span className="absolute left-[3cqw] top-[2cqw] text-[8cqw] font-extrabold leading-none text-[#0f0f0f]/10">AIR</span>
                    <Ph id="photo-1542291026-7eec264c27ff" className="absolute inset-0" tint="bg-[#c6ff3d]" style={{ mixBlendMode: 'multiply' }} />
                </div>
                <div className="flex flex-col justify-center gap-[1.6cqw]">
                    <span className="text-[1.4cqw] text-black/50">New drop · Running</span>
                    <p className="text-[4.4cqw] font-extrabold leading-[0.95] tracking-tight">Volt Runner 2</p>
                    <p className="text-[2.4cqw] font-semibold">AED 549</p>
                    <div className="flex gap-[1cqw] text-[1.4cqw]">{['40', '41', '42', '43'].map((s, i) => <span key={s} className={`grid size-[4.4cqw] place-items-center rounded-[1cqw] ${i === 2 ? 'bg-[#0f0f0f] text-white' : 'bg-white'}`}>{s}</span>)}</div>
                    <span className="rounded-full bg-[#0f0f0f] py-[1.4cqw] text-center text-[1.6cqw] text-white">Add to bag</span>
                </div>
            </div>
            <div className="flex-1 bg-white px-[4cqw] py-[4cqw]">
                <p className="text-[3.2cqw] font-extrabold tracking-tight">Trending now</p>
                <div className="mt-[2.5cqw] grid grid-cols-3 gap-[2cqw]">
                    {grid.map(([id, n, p]) => (
                        <div key={n}>
                            <Ph id={id} className="aspect-square rounded-[1.4cqw]" tint="bg-[#ececea]" />
                            <p className="mt-[1cqw] text-[1.6cqw] font-bold">{n}</p>
                            <p className="text-[1.4cqw] text-black/50">AED {p}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between bg-[#0f0f0f] px-[4cqw] py-[3cqw] text-[1.3cqw] text-white/60">
                <span className="text-[2cqw] font-extrabold italic text-[#c6ff3d]">STRIDE</span>
                <span>Free delivery across the UAE · 30-day returns</span>
            </div>
        </Page>
    )
}

/* Custom interactive — product configurator (the colour swatches really recolour the product) */
export function SiteInteractive() {
    const finishes = [['Midnight', '#3c5fd6', 0], ['Sand', '#e9e4da', 160], ['Graphite', '#1f1f1f', 90], ['Ember', '#d36b4b', 300]] as const
    const [pick, setPick] = useState(0)
    const [name, swatch, hue] = finishes[pick]
    return (
        <Page className="bg-[#0c0f14] text-white">
            <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.4cqw] text-white/60">
                <span className="text-[2.4cqw] font-semibold tracking-tight text-white">AERO</span>
                <span className="flex gap-[3cqw]"><span>Headphones</span><span>Speakers</span><span>Support</span></span>
            </div>
            <div className="grid flex-[1.25] grid-cols-[1.3fr_1fr]">
                <div className="relative grid place-items-center overflow-hidden">
                    <div className="absolute size-[40cqw] rounded-full blur-[4cqw]" style={{ background: `${swatch}55` }} />
                    <Ph id="photo-1505740420928-5e560c06d30e" className="relative aspect-square w-[78%] rounded-[2cqw]" tint="bg-[#1b2230]" style={{ filter: `hue-rotate(${hue}deg)${pick === 2 ? ' grayscale(1) brightness(.7)' : ''}`, transition: 'filter .5s' }} />
                    <span className="absolute bottom-[2cqw] left-[3cqw] text-[1.2cqw] text-white/40">Tap a finish to preview it</span>
                </div>
                <div className="flex flex-col justify-center gap-[1.8cqw] border-l border-white/10 p-[3.5cqw] text-[1.5cqw]">
                    <span className="text-[3cqw] font-semibold tracking-tight">AERO One</span>
                    <span className="text-white/50">Finish · <span className="text-white">{name}</span></span>
                    <div className="flex gap-[1.2cqw]">
                        {finishes.map(([n, c], i) => (
                            <button
                                key={n}
                                type="button"
                                aria-label={`${n} finish`}
                                onClick={() => setPick(i)}
                                className={`size-[4.2cqw] rounded-full transition-transform hover:scale-110 ${i === pick ? 'ring-[0.4cqw] ring-white ring-offset-[0.4cqw] ring-offset-[#0c0f14]' : ''}`}
                                style={{ background: c }}
                            />
                        ))}
                    </div>
                    <span className="text-white/50">Size</span>
                    <div className="grid grid-cols-2 gap-[1cqw]"><span className="rounded-[1cqw] bg-white py-[1cqw] text-center text-black">Compact</span><span className="rounded-[1cqw] border border-white/20 py-[1cqw] text-center">Studio</span></div>
                    <span className="mt-[1cqw] rounded-full bg-[#5b8cff] py-[1.3cqw] text-center">Add to bag · AED 1,290</span>
                </div>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-[2cqw] px-[4cqw] py-[4cqw]">
                {[['40h', 'Battery life'], ['−38 dB', 'Adaptive noise cancelling'], ['240 g', 'Aluminium & leather']].map(([v, k]) => (
                    <div key={k} className="rounded-[1.6cqw] bg-white/5 p-[2.4cqw]">
                        <p className="text-[4cqw] font-semibold tracking-tight">{v}</p>
                        <p className="text-[1.4cqw] text-white/50">{k}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between border-t border-white/10 px-[4cqw] py-[3cqw] text-[1.3cqw] text-white/50"><span>AERO Audio</span><span>Free engraving on every order</span></div>
        </Page>
    )
}

/* Fashion store — modest-wear label */
export function SiteFashion() {
    const items = [['photo-1490481651871-ab68de25d43d', 'Linen abaya', '640'], ['photo-1483985988355-763728e1935b', 'Silk shayla', '210'], ['photo-1434389677669-e08b4cac3105', 'Kaftan', '480']]
    return (
        <Page className="bg-white text-[#1d1d1b]">
            <div className="flex items-center justify-between border-b border-black/5 px-[4cqw] py-[2cqw] text-[1.4cqw]">
                <span className="text-black/50">New in · Edits</span>
                <span className="text-[2.6cqw] font-medium tracking-[0.35em]">NOOR</span>
                <span className="text-black/50">Bag (2)</span>
            </div>
            <div className="relative flex-[1.2]">
                <Ph id="photo-1515886657613-9f3515b0c78f" className="absolute inset-0" tint="bg-[#e8dccb]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-[3cqw] left-[4cqw] text-white">
                    <p className="text-[1.3cqw] uppercase tracking-[0.3em]">Resort 2026</p>
                    <p className="font-[family-name:var(--font-fraunces)] text-[5.4cqw] font-light leading-none">Soft light, <em>slow days</em></p>
                </div>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-[2cqw] p-[4cqw]">
                {items.map(([id, n, p]) => (
                    <div key={n} className="flex flex-col">
                        <Ph id={id} className="flex-1 rounded-[0.8cqw]" tint="bg-[#ece4d8]" />
                        <span className="mt-[1cqw] flex justify-between text-[1.4cqw]">{n}<span className="text-black/50">AED {p}</span></span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between bg-[#1d1d1b] px-[4cqw] py-[3cqw] text-[1.3cqw] text-white/60"><span className="tracking-[0.3em] text-white">NOOR</span><span>Made in the UAE · Ships worldwide</span></div>
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
