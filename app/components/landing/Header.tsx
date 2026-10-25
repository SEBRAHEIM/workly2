'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
    { href: '#work', label: 'Work' },
    { href: '#services', label: 'Services' },
    { href: '#gallery', label: 'Exhibition' },
    { href: '#process', label: 'Process' },
    { href: '#faq', label: 'FAQ' },
]

function Logo() {
    return (
        <Link href="/" className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight text-[#0d0d0d]">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#0d0d0d" />
                <rect x="13" y="2" width="9" height="9" rx="4.5" fill="#0d0d0d" />
                <rect x="2" y="13" width="9" height="9" rx="4.5" fill="#0d0d0d" />
                <rect x="13" y="13" width="9" height="9" rx="2.5" fill="#C8EE7E" />
            </svg>
            Workly
        </Link>
    )
}

// A floating pill that stays legible over every world, dark or light
export default function Header({ accountHref }: { accountHref: string | null }) {
    const [open, setOpen] = useState(false)

    return (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
            <div className="pointer-events-auto mx-auto flex h-12 max-w-[1300px] items-center justify-between rounded-full bg-white/80 pl-4 pr-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,.35)] ring-1 ring-black/5 backdrop-blur-xl md:h-14 md:pl-6 md:pr-2">
                <Logo />
                <nav className="hidden gap-7 text-[13px] text-[#0d0d0d]/70 lg:flex">
                    {links.map((l) => <a key={l.href} href={l.href} className="transition-colors hover:text-[#0d0d0d]">{l.label}</a>)}
                </nav>
                <div className="flex items-center gap-1.5">
                    <Link href={accountHref ?? '/login'} className="hidden rounded-full px-4 py-2 text-[13px] text-[#0d0d0d]/70 transition-colors hover:text-[#0d0d0d] sm:block">
                        {accountHref ? 'Dashboard' : 'Client login'}
                    </Link>
                    <a href="#contact" className="rounded-full bg-[#0d0d0d] px-4 py-2 text-[13px] text-white transition-transform hover:scale-[1.03] md:px-5 md:py-2.5">Start a project</a>
                    <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="grid size-9 place-items-center rounded-full text-[#0d0d0d] lg:hidden">
                        {open ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="pointer-events-auto mx-auto mt-2 max-w-[1300px] rounded-[24px] bg-white/95 p-3 shadow-xl backdrop-blur-xl lg:hidden">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-2xl font-semibold tracking-tight text-[#0d0d0d] hover:bg-black/5">{l.label}</a>
                    ))}
                    <Link href={accountHref ?? '/login'} className="block rounded-2xl px-4 py-3 text-base text-[#0d0d0d]/60 hover:bg-black/5">
                        {accountHref ? 'Dashboard' : 'Client login'}
                    </Link>
                </div>
            )}
        </header>
    )
}
