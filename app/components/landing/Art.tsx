// Code-drawn illustrations. They replace photos so every card is detailed and always renders.

export function Landscape() {
    return (
        <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#8fb6bd" />
                    <stop offset=".55" stopColor="#cfdcd3" />
                    <stop offset="1" stopColor="#efe2cc" />
                </linearGradient>
                <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#9fb3bd" />
                    <stop offset="1" stopColor="#c4d0cf" />
                </linearGradient>
                <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7f9aa3" />
                    <stop offset="1" stopColor="#a9b9b4" />
                </linearGradient>
                <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#b8c49a" />
                    <stop offset="1" stopColor="#d9cfa9" />
                </linearGradient>
            </defs>
            <rect width="1400" height="700" fill="url(#sky)" />
            <circle cx="1080" cy="170" r="70" fill="#fff6e3" opacity=".55" className="art-pulse" />
            <g className="art-drift" opacity=".7">
                <ellipse cx="260" cy="150" rx="90" ry="16" fill="#fff" opacity=".6" />
                <ellipse cx="330" cy="138" rx="60" ry="14" fill="#fff" opacity=".5" />
                <ellipse cx="900" cy="110" rx="110" ry="15" fill="#fff" opacity=".45" />
            </g>
            <path d="M0 420 L120 330 L210 380 L330 250 L430 350 L520 300 L640 200 L760 320 L860 260 L980 350 L1090 280 L1210 360 L1310 300 L1400 350 V700 H0Z" fill="url(#far)" />
            <path d="M330 250 L370 290 L350 288 L330 300 L312 285 L296 292Z M640 200 L690 255 L665 250 L640 265 L618 248 L598 255Z M1090 280 L1128 318 L1108 315 L1090 326 L1072 314 L1058 318Z" fill="#f4f6f4" />
            <path d="M0 470 L160 400 L300 450 L470 380 L600 440 L760 370 L900 430 L1060 390 L1200 440 L1400 400 V700 H0Z" fill="url(#mid)" opacity=".85" />
            <path d="M0 520 C200 480 380 500 560 510 C760 520 980 480 1180 500 C1280 510 1360 505 1400 500 V700 H0Z" fill="url(#field)" />
            <path d="M0 590 C260 560 520 600 760 585 C1000 570 1220 600 1400 580 V700 H0Z" fill="#cdbf93" opacity=".55" />
            {/* Fence posts give the field depth */}
            {Array.from({ length: 18 }).map((_, i) => (
                <rect key={i} x={60 + i * 75} y={548 + (i % 3)} width="3" height="18" fill="#9b8a66" opacity=".5" />
            ))}
        </svg>
    )
}

// Little skeleton site that keeps "building" itself inside the hero preview card
export function BuildingSite() {
    return (
        <div className="flex h-full flex-col gap-1.5 bg-white p-2.5">
            <div className="flex items-center justify-between">
                <span className="art-build h-1.5 w-8 rounded-full bg-[#151515] [--d:0s]" />
                <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="art-build h-1 w-4 rounded-full bg-[#d9d9d3]" style={{ ['--d' as string]: `${0.2 + i * 0.1}s` }} />)}</span>
            </div>
            <div className="art-build flex flex-1 items-end rounded-md bg-gradient-to-br from-[#cfe1df] to-[#efd9c7] p-1.5 [--d:.5s]">
                <span className="h-1.5 w-12 rounded-full bg-white/90" />
            </div>
            <div className="grid grid-cols-3 gap-1">
                {[0, 1, 2].map((i) => <span key={i} className="art-build h-5 rounded bg-[#f1f1ec]" style={{ ['--d' as string]: `${0.9 + i * 0.15}s` }} />)}
            </div>
        </div>
    )
}

export function CodeThumb() {
    const lines = [['#c8ee7e', 30], ['#9fb3bd', 55], ['#e9c9a3', 40], ['#9fb3bd', 65], ['#c8ee7e', 25]] as const
    return (
        <div className="flex h-full flex-col justify-center gap-1 bg-[#1b1b19] px-2.5">
            {lines.map(([c, w], i) => (
                <span key={i} className="flex items-center gap-1">
                    <span className="w-2 text-[6px] text-white/30">{i + 1}</span>
                    <span className="art-type h-1 rounded-full" style={{ width: `${w}%`, background: c, ['--d' as string]: `${i * 0.25}s` }} />
                </span>
            ))}
        </div>
    )
}

const panel = 'absolute inset-0 overflow-hidden'

export function ArtWebDesign() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#dfeae8] to-[#f3e6d6] p-5`}>
            <div className="art-float h-full rounded-xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="h-2 w-10 rounded-full bg-[#151515]" />
                    <span className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-5 rounded-full bg-[#e3e3dd]" />)}</span>
                </div>
                <div className="mt-2 grid h-[55%] grid-cols-[1.3fr_1fr] gap-2">
                    <div className="flex flex-col justify-center gap-1.5">
                        <span className="h-2.5 w-[90%] rounded-full bg-[#2b2b28]" />
                        <span className="h-2.5 w-[65%] rounded-full bg-[#2b2b28]" />
                        <span className="h-1.5 w-[80%] rounded-full bg-[#dcdcd6]" />
                        <span className="mt-1 h-3.5 w-12 rounded-full bg-[#C8EE7E]" />
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-[#a9c6c8] to-[#e7cfb3]" />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-6 rounded-md bg-[#f2f2ee]" />)}</div>
            </div>
            <span className="art-cursor absolute bottom-8 right-10 text-[#151515]">
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="currentColor" /></svg>
            </span>
        </div>
    )
}

export function ArtStore() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#f1dcd6] to-[#ece6da] p-5`}>
            <div className="grid h-full grid-cols-2 gap-2">
                {[['from-[#e9e2d6] to-[#cdbfa8]', 'AED 240'], ['from-[#d9dde0] to-[#aab5bc]', 'AED 310']].map(([g, p], i) => (
                    <div key={p} className="art-float flex flex-col rounded-xl bg-white p-2 shadow-sm" style={{ ['--d' as string]: `${i * 0.6}s` }}>
                        <div className={`flex-1 rounded-lg bg-gradient-to-b ${g}`} />
                        <div className="mt-1.5 flex items-center justify-between text-[9px]"><span className="h-1.5 w-10 rounded-full bg-[#dcdcd6]" />{p}</div>
                    </div>
                ))}
            </div>
            <div className="art-pop absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#151515] px-2.5 py-1 text-[9px] text-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 7h12l-1 13H7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
                Added to cart
            </div>
        </div>
    )
}

export function ArtBusiness() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#e1e9d6] to-[#f2e7d6] p-5`}>
            <div className="art-float flex h-full flex-col overflow-hidden rounded-xl bg-[#f6efe4] shadow-sm">
                <div className="relative flex-1 bg-gradient-to-br from-[#c7a07a] to-[#8a5c3c] p-3">
                    <span className="block font-[family-name:var(--font-instrument)] text-xl italic leading-none text-[#fff8ee]">Open daily</span>
                    <span className="mt-1 block text-[8px] text-[#fff8ee]/80">8:00 – 22:00 · Jumeirah</span>
                    <span className="absolute bottom-2 right-2 rounded-full bg-[#fff8ee] px-2 py-0.5 text-[8px] text-[#3b2f24]">Get directions</span>
                </div>
                <div className="flex items-center gap-2 p-2.5">
                    {['★★★★★', 'Call us', 'Menu'].map((t) => <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[8px] text-[#6b5a48]">{t}</span>)}
                </div>
            </div>
        </div>
    )
}

export function ArtCode() {
    const rows = [
        ['const', ' booking = ', 'await', ' api.create({'],
        ['', '  service: ', '', "'Consultation',"],
        ['', '  date: ', '', "'2026-11-04',"],
        ['', '  notify: ', '', 'true'],
        ['', '})', '', ''],
    ]
    return (
        <div className={`${panel} bg-gradient-to-br from-[#d9e1ea] to-[#ece4d8] p-5`}>
            <div className="art-float h-full rounded-xl bg-[#1b1b19] p-3 font-mono text-[9px] leading-[1.7] text-white/80 shadow-sm">
                <div className="mb-2 flex gap-1">{['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="size-1.5 rounded-full" style={{ background: c }} />)}</div>
                {rows.map((r, i) => (
                    <div key={i} className="art-type-line whitespace-pre" style={{ ['--d' as string]: `${i * 0.35}s` }}>
                        <span className="text-[#c8ee7e]">{r[0]}</span>{r[1]}<span className="text-[#c8ee7e]">{r[2]}</span><span className="text-[#e9c9a3]">{r[3]}</span>
                    </div>
                ))}
                <span className="art-caret inline-block h-2.5 w-1 translate-y-0.5 bg-[#c8ee7e]" />
            </div>
        </div>
    )
}

export function ArtBooking({ big = false }: { big?: boolean }) {
    const booked = [3, 4, 9, 11, 12, 17, 18, 19, 24]
    return (
        <div className={`${panel} bg-gradient-to-br from-[#d3e5ea] to-[#f0e3d0] ${big ? 'p-6 pb-20 pt-14' : 'p-5'}`}>
            <div className="art-float h-full rounded-xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between text-[10px]">
                    <span>November</span>
                    <span className="flex gap-1 text-[#a5a5a0]">‹ ›</span>
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[8px] text-[#a5a5a0]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
                    {Array.from({ length: big ? 28 : 21 }).map((_, i) => (
                        <span
                            key={i}
                            className={`grid aspect-square place-items-center rounded-md ${i === 10 ? 'art-pulse bg-[#151515] text-white' : booked.includes(i) ? 'bg-[#DDF5A9] text-[#151515]' : 'bg-[#f4f4f0] text-[#6b6b66]'}`}
                        >
                            {i + 1}
                        </span>
                    ))}
                </div>
                {big && (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f4f4f0] p-2 text-[9px]">
                        <span>Thu 11 · 10:30 · Spa session</span>
                        <span className="rounded-full bg-[#151515] px-2 py-0.5 text-white">Confirm</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export function ArtDashboard() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#e6e4f0] to-[#efe6d6] p-5`}>
            <div className="art-float flex h-full gap-2 rounded-xl bg-white p-2.5 shadow-sm">
                <div className="flex w-5 flex-col gap-1.5 rounded-md bg-[#151515] p-1">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-2 rounded-sm ${i ? 'bg-white/25' : 'bg-[#C8EE7E]'}`} />)}</div>
                <div className="flex flex-1 flex-col gap-1.5">
                    <div className="grid grid-cols-2 gap-1.5">
                        {['Sales', 'Customers'].map((k) => <div key={k} className="rounded-md bg-[#f4f4f0] p-1.5 text-[7px] text-[#8a8a85]">{k}<span className="mt-0.5 block h-1.5 w-8 rounded-full bg-[#151515]" /></div>)}
                    </div>
                    <svg viewBox="0 0 120 50" className="flex-1">
                        <path d="M0 40 C15 35 20 20 35 24 S60 38 72 22 S100 8 120 12 V50 H0Z" fill="#DDF5A9" opacity=".6" />
                        <path className="art-draw" d="M0 40 C15 35 20 20 35 24 S60 38 72 22 S100 8 120 12" fill="none" stroke="#151515" strokeWidth="1.5" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export function ArtMaintenance() {
    const log = [['Speed boost', 'Done'], ['New gallery page', 'Done'], ['Security update', 'Running']]
    return (
        <div className={`${panel} bg-gradient-to-br from-[#e3e8dc] to-[#efe2d4] p-5`}>
            <div className="art-float h-full space-y-1.5 rounded-xl bg-white p-3 shadow-sm">
                <span className="text-[10px]">Update log</span>
                {log.map(([t, s]) => (
                    <div key={t} className="flex items-center justify-between rounded-md bg-[#f4f4f0] px-2 py-1.5 text-[9px]">
                        {t}
                        <span className={`rounded-full px-1.5 py-0.5 text-[8px] ${s === 'Done' ? 'bg-[#DDF5A9]' : 'art-pulse bg-[#f6e3c6]'}`}>{s}</span>
                    </div>
                ))}
                <div className="h-1 overflow-hidden rounded-full bg-[#f4f4f0]"><span className="art-progress block h-full rounded-full bg-[#151515]" /></div>
            </div>
        </div>
    )
}

export function ArtCafe() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#efd9c9] to-[#dfe6dc] p-5 pb-16 pt-12`}>
            <div className="art-float mx-auto flex h-full max-w-[260px] gap-2 rounded-xl bg-[#fbf6ef] p-2.5 shadow-sm">
                <div className="grid w-1/2 place-items-center rounded-lg bg-[#e8d6c0]">
                    <svg viewBox="0 0 60 60" className="w-3/4"><circle cx="30" cy="30" r="22" fill="#fff" /><circle cx="30" cy="30" r="15" fill="#c98f5f" /><circle cx="25" cy="27" r="3" fill="#7c4f2d" /><circle cx="34" cy="33" r="2.5" fill="#7c4f2d" /></svg>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 text-[9px] text-[#3b2f24]">
                    <span className="font-[family-name:var(--font-instrument)] text-sm italic">Today&apos;s menu</span>
                    {[['Latte', '19'], ['Croissant', '14'], ['Brunch plate', '48']].map(([n, p]) => <span key={n} className="flex justify-between border-b border-[#ead9c4] pb-0.5">{n}<span>{p}</span></span>)}
                </div>
            </div>
        </div>
    )
}

export function ArtFashion() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#ecd6d3] to-[#e8e2d7] p-5 pb-16 pt-12`}>
            <div className="mx-auto flex h-full max-w-[260px] items-end justify-center gap-3">
                {[['#d9b2a6', 'h-[85%]', '0s'], ['#a9b6bf', 'h-full', '.4s'], ['#c9cdae', 'h-[75%]', '.8s']].map(([c, h, d]) => (
                    <div key={c} className={`art-float flex w-1/3 flex-col items-center ${h}`} style={{ ['--d' as string]: d }}>
                        <svg viewBox="0 0 40 14" className="w-2/3"><path d="M20 2a3 3 0 1 1 3 3l-3 2L4 13h32L20 7" fill="none" stroke="#6b6b66" strokeWidth="1.2" /></svg>
                        <div className="w-full flex-1 rounded-t-[40%] rounded-b-md" style={{ background: c }} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ArtAuto() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#d6dfe6] to-[#ede3d6] p-5 pb-16 pt-12`}>
            <div className="art-float mx-auto flex h-full max-w-[260px] flex-col rounded-xl bg-white p-2.5 shadow-sm">
                <div className="relative grid flex-1 place-items-center overflow-hidden rounded-lg bg-[#eef0f1]">
                    <svg viewBox="0 0 120 50" className="art-drive w-4/5">
                        <path d="M8 36 L14 24 Q20 16 34 15 L70 14 Q84 14 94 22 L108 27 Q114 29 114 34 L114 38 L8 38Z" fill="#9db0bf" />
                        <path d="M38 17 L66 16 Q78 16 86 23 L36 24Z" fill="#dfe7ee" />
                        <circle cx="30" cy="38" r="8" fill="#2b2b28" /><circle cx="30" cy="38" r="3.5" fill="#cfcfca" />
                        <circle cx="92" cy="38" r="8" fill="#2b2b28" /><circle cx="92" cy="38" r="3.5" fill="#cfcfca" />
                    </svg>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[9px]">
                    <span>2025 Coupe · 12,000 km</span>
                    <span className="rounded-full bg-[#DDF5A9] px-2 py-0.5">Test drive</span>
                </div>
            </div>
        </div>
    )
}

export function ArtArtist() {
    return (
        <div className={`${panel} bg-gradient-to-br from-[#dfe6d1] to-[#f0e2d2] p-5 pb-16 pt-12`}>
            <div className="mx-auto grid h-full max-w-[260px] grid-cols-3 grid-rows-2 gap-2">
                {[
                    'col-span-2 bg-gradient-to-br from-[#e7b9a0] via-[#d98f74] to-[#8fa7b5]',
                    'bg-gradient-to-b from-[#c9d6a8] to-[#7f9a6a]',
                    'bg-gradient-to-tr from-[#f2d48f] to-[#e48f6f]',
                    'col-span-2 bg-gradient-to-r from-[#a9bcd0] to-[#e9d7c3]',
                ].map((g, i) => (
                    <div key={i} className={`art-float rounded-lg border-4 border-white shadow-sm ${g}`} style={{ ['--d' as string]: `${i * 0.3}s` }} />
                ))}
            </div>
        </div>
    )
}
