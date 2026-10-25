'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
    { href: '#services', label: 'Services' },
    { href: '#work', label: 'What we build' },
    { href: '#process', label: 'Process' },
    { href: '#industries', label: 'Industries' },
]

export default function Header({ accountHref }: { accountHref: string | null }) {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                        className="grid size-9 place-items-center rounded-full ring-1 ring-black/10 md:hidden"
                    >
                        {open ? <X size={16} /> : <Menu size={16} />}
                    </button>
                    <a href="#inquiry" className="hidden rounded-full bg-[#DDF5A9] px-4 py-2 text-xs md:inline-block">
                        Start a project
                    </a>
                    <nav className="ml-4 hidden gap-6 text-xs text-[#6b6b66] lg:flex">
                        {links.map((l) => (
                            <a key={l.href} href={l.href} className="transition-colors hover:text-[#151515]">{l.label}</a>
                        ))}
                    </nav>
                </div>

                <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-[15px] font-medium tracking-tight">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                        <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#151515" />
                        <rect x="13" y="2" width="9" height="9" rx="4.5" fill="#151515" />
                        <rect x="2" y="13" width="9" height="9" rx="4.5" fill="#151515" />
                        <rect x="13" y="13" width="9" height="9" rx="2.5" fill="#C8EE7E" />
                    </svg>
                    Workly
                </Link>

                <Link
                    href={accountHref ?? '/login'}
                    className="rounded-full px-4 py-2 text-xs ring-1 ring-black/15 transition-colors hover:bg-[#151515] hover:text-white"
                >
                    {accountHref ? 'Dashboard' : 'Client login'}
                </Link>
            </div>

            {open && (
                <div className="border-t border-black/5 bg-white px-4 pb-6 pt-2 md:hidden">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="block border-b border-black/5 py-3.5 text-lg font-light"
                        >
                            {l.label}
                        </a>
                    ))}
                    <a
                        href="#inquiry"
                        onClick={() => setOpen(false)}
                        className="mt-5 block rounded-full bg-[#DDF5A9] py-3.5 text-center text-sm"
                    >
                        Start a project
                    </a>
                </div>
            )}
        </header>
    )
}
