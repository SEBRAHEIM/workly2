// Concept websites, each with its own brand identity. Sizes use cqw so a design scales to any frame.

export function Screen({ children, url, className = '', dark = false }: { children: React.ReactNode; url?: string; className?: string; dark?: boolean }) {
    return (
        <div className={`@container overflow-hidden ${className}`}>
            <div className={`flex h-full w-full flex-col overflow-hidden rounded-[1.8cqw] ${dark ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
                {url && (
                    <div className={`flex shrink-0 items-center gap-[1.2cqw] px-[2cqw] py-[1.2cqw] ${dark ? 'bg-[#1a1a1a]' : 'bg-[#f1f1ee]'}`}>
                        <span className="flex gap-[0.7cqw]">{['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="size-[1.2cqw] rounded-full" style={{ background: c }} />)}</span>
                        <span className={`mx-auto rounded-[0.8cqw] px-[3cqw] py-[0.3cqw] text-[1.5cqw] ${dark ? 'bg-black/40 text-white/50' : 'bg-white text-black/40'}`}>{url}</span>
                    </div>
                )}
                <div className="relative min-h-0 flex-1">{children}</div>
            </div>
        </div>
    )
}

/* Fashion & luxury — fine jewellery house */
export function SiteLuxury() {
    return (
        <div className="absolute inset-0 flex flex-col bg-[#0b0a08] px-[5cqw] py-[3cqw] text-[#e9dcc0]">
            <div className="flex items-center justify-between text-[1.4cqw] uppercase tracking-[0.3em] text-[#e9dcc0]/60">
                <span>Collections</span>
                <span className="font-[family-name:var(--font-fraunces)] text-[2.6cqw] normal-case tracking-[0.2em] text-[#e9dcc0]">MAISON VÉRA</span>
                <span>Boutiques</span>
            </div>
            <div className="grid flex-1 grid-cols-[1.1fr_1fr] items-center gap-[4cqw]">
                <div>
                    <p className="text-[1.4cqw] uppercase tracking-[0.3em] text-[#c9a96a]">The Eternity Collection</p>
                    <p className="mt-[1.5cqw] font-[family-name:var(--font-fraunces)] text-[6.5cqw] font-light leading-[0.95]">Light,<br /><em>held forever.</em></p>
                    <span className="mt-[3cqw] inline-block border-b border-[#c9a96a] pb-[0.4cqw] text-[1.5cqw] uppercase tracking-[0.25em]">Discover</span>
                </div>
                <div className="relative grid aspect-square place-items-center">
                    <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,#3a2f1d_0%,transparent_70%)]" />
                    <div className="relative size-[60%] rounded-full border-[2.4cqw] border-[#c9a96a] shadow-[0_0_6cqw_rgba(201,169,106,.35),inset_0_0_2cqw_rgba(0,0,0,.6)]" style={{ borderTopColor: '#f3e2b6', borderLeftColor: '#e0c58a' }} />
                    <div className="absolute top-[14%] size-[16%] rotate-45 rounded-[0.8cqw] bg-gradient-to-br from-white via-[#dfe9f3] to-[#9fb5c9] shadow-[0_0_4cqw_rgba(255,255,255,.6)]" />
                </div>
            </div>
        </div>
    )
}

/* Hospitality — boutique desert hotel */
export function SiteHotel() {
    return (
        <div className="absolute inset-0 flex flex-col bg-[#f2e8d9] text-[#3a2a1c]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.5cqw]">
                <span className="font-[family-name:var(--font-instrument)] text-[3cqw] italic">Sahra</span>
                <span className="flex gap-[3cqw] uppercase tracking-[0.2em] text-[#3a2a1c]/60"><span>Suites</span><span>Dining</span><span>Spa</span></span>
            </div>
            <div className="relative mx-[4cqw] flex flex-1 items-end overflow-hidden rounded-t-[30cqw] bg-gradient-to-b from-[#f6b984] via-[#e88c5d] to-[#a8573a] p-[4cqw]">
                <div className="absolute left-1/2 top-[18%] size-[14cqw] -translate-x-1/2 rounded-full bg-[#ffe3b0] opacity-90" />
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[45%] w-full"><path d="M0 18 Q25 6 50 16 T100 12 V30 H0Z" fill="#c9774c" /><path d="M0 24 Q30 14 60 22 T100 20 V30 H0Z" fill="#8f4a31" /></svg>
                <p className="relative font-[family-name:var(--font-instrument)] text-[6cqw] leading-none text-[#fff6ea]">Where the dunes<br /><em>meet the stars</em></p>
            </div>
            <div className="mx-[4cqw] mb-[3cqw] grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-[2cqw] rounded-b-[1.6cqw] bg-white px-[3cqw] py-[2cqw] text-[1.5cqw]">
                {[['Check in', '12 Dec'], ['Check out', '15 Dec'], ['Guests', '2 adults']].map(([k, v]) => (
                    <span key={k}><span className="block text-[1.2cqw] uppercase tracking-[0.15em] text-[#3a2a1c]/50">{k}</span>{v}</span>
                ))}
                <span className="rounded-full bg-[#3a2a1c] px-[2.4cqw] py-[1cqw] text-[#f2e8d9]">Reserve</span>
            </div>
        </div>
    )
}

/* Booking & services — pilates studio */
export function SiteBooking() {
    const classes = [['07:00', 'Reformer Flow', 'Maya', '3 left'], ['09:30', 'Core & Stretch', 'Lea', 'Full'], ['18:00', 'Power Reformer', 'Sami', '5 left']]
    return (
        <div className="absolute inset-0 grid grid-cols-[1fr_1.25fr] bg-[#f6f3ff] font-[family-name:var(--font-manrope)] text-[#24204a]">
            <div className="flex flex-col justify-between bg-gradient-to-b from-[#c9c0ff] to-[#f7c9dd] p-[4cqw]">
                <span className="text-[2.6cqw] font-extrabold tracking-tight">FORMA</span>
                <p className="text-[5.2cqw] font-bold leading-[1]">Move<br />with<br />intention.</p>
                <span className="w-max rounded-full bg-[#24204a] px-[2.4cqw] py-[1cqw] text-[1.6cqw] text-white">Book a class</span>
            </div>
            <div className="flex flex-col gap-[1.6cqw] p-[3.5cqw]">
                <div className="flex gap-[1.2cqw] text-[1.5cqw]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                        <span key={d} className={`flex-1 rounded-[1.2cqw] py-[1cqw] text-center ${i === 2 ? 'bg-[#24204a] text-white' : 'bg-white'}`}>{d}<span className="block text-[2cqw] font-bold">{10 + i}</span></span>
                    ))}
                </div>
                {classes.map(([t, n, c, s]) => (
                    <div key={t} className="flex items-center gap-[2cqw] rounded-[1.4cqw] bg-white p-[1.8cqw] text-[1.6cqw]">
                        <span className="font-bold">{t}</span>
                        <span className="flex-1"><span className="block font-semibold">{n}</span><span className="text-[#24204a]/50">with {c}</span></span>
                        <span className={`rounded-full px-[1.6cqw] py-[0.6cqw] ${s === 'Full' ? 'bg-[#eee] text-[#999]' : 'bg-[#d9f99d]'}`}>{s}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* Corporate & business — advisory firm */
export function SiteCorporate() {
    return (
        <div className="absolute inset-0 flex flex-col bg-white text-[#0e1b33]">
            <div className="flex items-center justify-between border-b border-[#0e1b33]/10 px-[4cqw] py-[2.2cqw] text-[1.5cqw]">
                <span className="text-[2.2cqw] font-semibold tracking-tight">Halden <span className="font-light">&amp; Partners</span></span>
                <span className="flex items-center gap-[3cqw] text-[#0e1b33]/60"><span>Expertise</span><span>Insights</span><span className="rounded-[0.6cqw] bg-[#0e1b33] px-[2cqw] py-[0.8cqw] text-white">Contact</span></span>
            </div>
            <div className="grid flex-1 grid-cols-[1.3fr_1fr]">
                <div className="flex flex-col justify-center gap-[2cqw] px-[4cqw]">
                    <p className="text-[1.4cqw] uppercase tracking-[0.25em] text-[#2f6fde]">Strategy · Capital · Growth</p>
                    <p className="text-[5.4cqw] font-semibold leading-[1.02] tracking-tight">Advisory for<br />what comes next.</p>
                    <div className="grid grid-cols-3 gap-[2cqw] border-t border-[#0e1b33]/10 pt-[2cqw] text-[1.4cqw] text-[#0e1b33]/60">
                        {[['20+', 'Markets'], ['140', 'Advisors'], ['1998', 'Founded']].map(([v, k]) => <span key={k}><span className="block text-[3cqw] font-semibold text-[#0e1b33]">{v}</span>{k}</span>)}
                    </div>
                </div>
                <div className="relative overflow-hidden bg-[#0e1b33]">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <span key={i} className="absolute bottom-0 w-[9%] bg-gradient-to-t from-[#2f6fde] to-[#7fb0ff]" style={{ left: `${8 + i * 10}%`, height: `${18 + ((i * 37) % 60)}%`, opacity: 0.35 + i * 0.07 }} />
                    ))}
                    <span className="absolute right-[10%] top-[12%] text-[1.4cqw] text-white/60">Annual report 2026 →</span>
                </div>
            </div>
        </div>
    )
}

/* Creative agency */
export function SiteAgency() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-[#ff5a1f] font-[family-name:var(--font-unbounded)] text-[#111]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.5cqw]">
                <span className="text-[2.4cqw] font-bold">ORBIT°</span>
                <span className="rounded-full border border-[#111] px-[2cqw] py-[0.6cqw]">Let&apos;s talk</span>
            </div>
            <div className="absolute -right-[8cqw] top-[14cqw] size-[46cqw] rounded-full bg-[#111]" />
            <div className="absolute right-[12cqw] top-[22cqw] size-[18cqw] rounded-full bg-[#f4f0e6]" />
            <div className="absolute bottom-[4cqw] left-[4cqw]">
                <p className="text-[9cqw] font-black leading-[0.85] tracking-tight">WE MAKE<br />NOISE.</p>
                <p className="mt-[2cqw] max-w-[40cqw] text-[1.4cqw] leading-snug">Brand, film and digital for culture-first companies.</p>
            </div>
        </div>
    )
}

/* Portfolio — photographer */
export function SitePortfolio() {
    const frames = [
        'from-[#d8c3a5] to-[#8e7358]', 'from-[#9fb4c7] to-[#3d5266]', 'from-[#e9b8a8] to-[#b0675a]',
        'from-[#c6cfb4] to-[#6c7a55]', 'from-[#f0e2c8] to-[#c19a6b]',
    ]
    return (
        <div className="absolute inset-0 flex flex-col bg-[#fafaf7] p-[3.5cqw] font-[family-name:var(--font-geist-mono)] text-[#111]">
            <div className="flex items-baseline justify-between text-[1.4cqw]">
                <span className="text-[2.4cqw] font-[family-name:var(--font-instrument)] italic">Lina Haddad</span>
                <span className="text-black/50">Index · Commissions · Info</span>
            </div>
            <div className="mt-[2.5cqw] grid flex-1 grid-cols-6 grid-rows-2 gap-[1.2cqw]">
                {frames.map((g, i) => (
                    <div key={i} className={`relative rounded-[0.6cqw] bg-gradient-to-br ${g} ${i === 0 ? 'col-span-3 row-span-2' : i === 1 ? 'col-span-3' : 'col-span-1'}`}>
                        <span className="absolute bottom-[0.8cqw] left-[0.8cqw] text-[1.1cqw] text-white/80">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                ))}
            </div>
            <p className="mt-[1.5cqw] text-[1.3cqw] text-black/50">Light studies, Oman — 2026 · 24 frames</p>
        </div>
    )
}

/* Restaurant */
export function SiteRestaurant() {
    return (
        <div className="absolute inset-0 flex flex-col bg-[#f3ece1] text-[#3b2f24]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[1.4cqw] uppercase tracking-[0.2em]">
                <span className="font-[family-name:var(--font-instrument)] text-[3cqw] normal-case tracking-normal">Olive &amp; Ember</span>
                <span className="flex gap-[3cqw]"><span>Menu</span><span>Visit</span></span>
            </div>
            <div className="relative mx-[4cqw] flex-1 overflow-hidden rounded-[2cqw] bg-gradient-to-br from-[#c9a27c] via-[#b9825a] to-[#7d5236] p-[4cqw] text-[#fff8ee]">
                <div className="absolute -right-[5cqw] -top-[5cqw] size-[28cqw] rounded-full bg-[#e8c9a3]/40" />
                <div className="absolute bottom-[3cqw] right-[5cqw] size-[16cqw] rounded-full border-[1.5cqw] border-[#fff8ee]/80 bg-[radial-gradient(circle,#d29a62_35%,#f6e7d2_37%)]" />
                <p className="text-[1.4cqw] uppercase tracking-[0.25em]">Café · Dubai Marina</p>
                <p className="mt-[1.5cqw] font-[family-name:var(--font-instrument)] text-[6.5cqw] leading-[0.95]">Slow coffee,<br /><em>warm</em> plates</p>
                <span className="mt-[2.5cqw] inline-block rounded-full bg-[#fff8ee] px-[2.5cqw] py-[1cqw] text-[1.5cqw] text-[#3b2f24]">Book a table</span>
            </div>
            <div className="grid grid-cols-3 gap-[1.6cqw] p-[3cqw] text-[1.4cqw]">
                {[['Flat white', '18'], ['Shakshuka', '42'], ['Pistachio cake', '28']].map(([n, p]) => (
                    <span key={n} className="flex justify-between border-b border-[#3b2f24]/20 pb-[0.6cqw]">{n}<span>{p}</span></span>
                ))}
            </div>
        </div>
    )
}

/* E-commerce — sneaker store */
export function SiteStore() {
    return (
        <div className="absolute inset-0 flex flex-col bg-[#f4f4f1] font-[family-name:var(--font-manrope)] text-[#0f0f0f]">
            <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.5cqw]">
                <span className="text-[2.8cqw] font-extrabold italic tracking-tighter">STRIDE</span>
                <span className="flex items-center gap-[3cqw]"><span>Men</span><span>Women</span><span className="rounded-full bg-[#0f0f0f] px-[1.6cqw] py-[0.5cqw] text-white">Bag · 2</span></span>
            </div>
            <div className="grid flex-1 grid-cols-[1.2fr_1fr] gap-[3cqw] px-[4cqw] pb-[3cqw]">
                <div className="relative grid place-items-center overflow-hidden rounded-[2cqw] bg-[#c6ff3d]">
                    <span className="absolute left-[3cqw] top-[2cqw] text-[8cqw] font-extrabold leading-none text-[#0f0f0f]/10">AIR</span>
                    <svg viewBox="0 0 120 60" className="relative w-[85%] -rotate-12 drop-shadow-[0_3cqw_2cqw_rgba(0,0,0,.25)]">
                        <path d="M6 40 Q8 26 22 24 L46 20 Q58 8 74 12 L92 24 Q112 28 114 40 L114 46 Q60 52 6 46Z" fill="#fff" />
                        <path d="M6 46 Q60 52 114 46 L114 50 Q60 57 6 51Z" fill="#0f0f0f" />
                        <path d="M40 24 Q60 30 88 26" stroke="#ff5a1f" strokeWidth="3" fill="none" />
                        <path d="M50 18l6 8M58 15l6 8M66 14l6 8" stroke="#0f0f0f" strokeWidth="1.4" />
                    </svg>
                </div>
                <div className="flex flex-col justify-center gap-[1.6cqw]">
                    <span className="text-[1.4cqw] text-black/50">New drop · Running</span>
                    <p className="text-[4.4cqw] font-extrabold leading-[0.95] tracking-tight">Volt Runner 2</p>
                    <p className="text-[2.4cqw] font-semibold">AED 549</p>
                    <div className="flex gap-[1cqw] text-[1.4cqw]">{['40', '41', '42', '43'].map((s, i) => <span key={s} className={`grid size-[4.4cqw] place-items-center rounded-[1cqw] ${i === 2 ? 'bg-[#0f0f0f] text-white' : 'bg-white'}`}>{s}</span>)}</div>
                    <span className="rounded-full bg-[#0f0f0f] py-[1.4cqw] text-center text-[1.6cqw] text-white">Add to bag</span>
                </div>
            </div>
        </div>
    )
}

/* Custom interactive — product configurator */
export function SiteInteractive() {
    return (
        <div className="absolute inset-0 grid grid-cols-[1.3fr_1fr] bg-[#0c0f14] text-white">
            <div className="relative grid place-items-center overflow-hidden">
                <div className="absolute size-[42cqw] rounded-full bg-[radial-gradient(circle,rgba(91,140,255,.35),transparent_65%)]" />
                <div className="mockup-orbit absolute size-[34cqw] rounded-full border border-white/10" />
                <div className="relative size-[24cqw] rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#a8c4ff_14%,#3c5fd6_45%,#141c3a_80%)] shadow-[0_3cqw_6cqw_rgba(60,95,214,.45)]" />
                <span className="absolute bottom-[3cqw] left-[3cqw] text-[1.3cqw] text-white/40">Drag to rotate · 360°</span>
            </div>
            <div className="flex flex-col justify-center gap-[2cqw] border-l border-white/10 p-[3.5cqw] text-[1.5cqw]">
                <span className="text-[2.4cqw] font-semibold tracking-tight">AERO One</span>
                <span className="text-white/50">Finish</span>
                <div className="flex gap-[1.2cqw]">{['#3c5fd6', '#e9e4da', '#1f1f1f', '#d36b4b'].map((c, i) => <span key={c} className={`size-[4cqw] rounded-full ${i === 0 ? 'ring-[0.4cqw] ring-white ring-offset-[0.4cqw] ring-offset-[#0c0f14]' : ''}`} style={{ background: c }} />)}</div>
                <span className="text-white/50">Size</span>
                <div className="grid grid-cols-2 gap-[1cqw]"><span className="rounded-[1cqw] bg-white py-[1cqw] text-center text-black">Compact</span><span className="rounded-[1cqw] border border-white/20 py-[1cqw] text-center">Studio</span></div>
                <span className="mt-[1cqw] rounded-full bg-[#5b8cff] py-[1.3cqw] text-center">Configure · AED 1,290</span>
            </div>
        </div>
    )
}

/* Fashion store — modest-wear label */
export function SiteFashion() {
    const items = [['Linen abaya', '640', 'from-[#e8dccb] to-[#bfa888]'], ['Silk shayla', '210', 'from-[#e6c9c2] to-[#b88778]'], ['Kaftan', '480', 'from-[#cfd6d0] to-[#8e9e94]']]
    return (
        <div className="absolute inset-0 flex flex-col bg-white text-[#1d1d1b]">
            <div className="flex items-center justify-between border-b border-black/5 px-[4cqw] py-[2cqw] text-[1.4cqw]">
                <span className="text-black/50">New in · Edits</span>
                <span className="text-[2.6cqw] font-medium tracking-[0.35em]">NOOR</span>
                <span className="text-black/50">Bag (2)</span>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-[2cqw] p-[3.5cqw]">
                {items.map(([n, p, g]) => (
                    <div key={n} className="flex flex-col">
                        <div className={`relative flex-1 overflow-hidden rounded-[1cqw] bg-gradient-to-b ${g}`}>
                            <div className="absolute inset-x-[28%] bottom-0 top-[18%] rounded-t-[40%] bg-white/25" />
                        </div>
                        <span className="mt-[1cqw] flex justify-between text-[1.4cqw]">{n}<span className="text-black/50">AED {p}</span></span>
                    </div>
                ))}
            </div>
        </div>
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
