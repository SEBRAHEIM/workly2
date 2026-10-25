'use client'

import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

export const IMG = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

// Serif italic accent used inside headings, e.g. "Where <Em>Ideas</Em> Meet Craft"
export function Em({ children }: { children: React.ReactNode }) {
    return <em className="font-[family-name:var(--font-instrument)] italic font-normal tracking-normal">{children}</em>
}

// Photo with a soft pastel gradient underneath, so a failed image load still looks intentional
export function Photo({
    src,
    alt,
    className = '',
    tint = 'from-[#cfe1df] via-[#e7e2d3] to-[#efd9c7]',
}: {
    src: string
    alt: string
    className?: string
    tint?: string
}) {
    const img = useRef<HTMLImageElement>(null)
    // An image can fail before hydration attaches onError, so check once on mount too
    useEffect(() => {
        const el = img.current
        if (el && el.complete && el.naturalWidth === 0) el.style.display = 'none'
    }, [])
    const position = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative'
    return (
        <div className={`${position} overflow-hidden bg-gradient-to-br ${tint} ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={img}
                src={src}
                alt={alt}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
                className="absolute inset-0 h-full w-full object-cover saturate-[.8] sepia-[.12] brightness-[1.04]"
            />
        </div>
    )
}

// Lime pill with a detached arrow bubble, the signature button of the design
export function Pill({
    href,
    children,
    variant = 'lime',
    className = '',
    type,
}: {
    href?: string
    children: React.ReactNode
    variant?: 'lime' | 'outline' | 'dark'
    className?: string
    type?: 'submit'
}) {
    const tone =
        variant === 'lime'
            ? 'bg-[#DDF5A9] text-[#151515]'
            : variant === 'dark'
                ? 'bg-[#151515] text-white'
                : 'bg-white text-[#151515] ring-1 ring-[#151515]'
    const inner = (
        <>
            <span className={`rounded-full px-5 py-2.5 text-sm transition-colors ${tone}`}>{children}</span>
            <span className={`-ml-1 grid size-10 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${tone}`}>
                <ArrowUpRight size={16} strokeWidth={1.75} />
            </span>
        </>
    )
    const cls = `group inline-flex items-center ${className}`
    if (type) return <button type="submit" className={cls}>{inner}</button>
    return <a href={href} className={cls}>{inner}</a>
}

export function RoundArrow({ href = '#inquiry', className = '' }: { href?: string; className?: string }) {
    return (
        <a
            href={href}
            aria-label="Start a project"
            className={`grid size-9 place-items-center rounded-full bg-white text-[#151515] ring-1 ring-black/5 transition-transform hover:rotate-45 ${className}`}
        >
            <ArrowUpRight size={15} strokeWidth={1.75} />
        </a>
    )
}

// Small floating label with a ring marker above it, like map pins on the hero photo
export function Chip({ label, className = '' }: { label: string; className?: string }) {
    return (
        <div className={`absolute flex flex-col items-center gap-2 ${className}`}>
            <span className="grid size-6 place-items-center rounded-full border border-white/80 bg-white/20 backdrop-blur">
                <span className="size-2 rounded-full bg-white" />
            </span>
            <span className="rounded-full bg-white px-3.5 py-1.5 text-[11px] text-[#151515] shadow-sm">{label}</span>
        </div>
    )
}
