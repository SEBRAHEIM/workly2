'use client'

import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Calendar, Code2, Layers, Play, Search, Sparkles } from 'lucide-react'
import { Chip, Em, IMG, Photo, Pill, RoundArrow } from './ui'

// Six-armed asterisk from the reference, carrying the "it's time / to launch" message
function Asterisk() {
    return (
        <svg viewBox="0 0 100 100" className="size-24 md:size-32" aria-hidden>
            {[0, 60, 120].map((r) => (
                <rect key={r} x="38" y="2" width="24" height="96" rx="12" fill="white" transform={`rotate(${r} 50 50)`} />
            ))}
            <path d="M34 50h30m-7-7 7 7-7 7" stroke="#151515" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function Hero() {
    const [idea, setIdea] = useState('')

    const sendIdea = (e: React.FormEvent) => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('workly:idea', { detail: idea }))
        document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="mx-auto max-w-[1400px] px-3 md:px-6">
            <div className="relative h-[620px] overflow-hidden rounded-[28px] md:h-[680px] md:rounded-[36px]">
                <Photo
                    src={IMG('photo-1497366216548-37526070297c', 2000)}
                    alt="Bright, calm studio workspace"
                    className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#9fc4c9]/45 via-transparent to-[#e9dccb]/25" />

                {/* Headline */}
                <div className="relative z-10 flex flex-col items-center px-4 pt-14 text-center text-white md:pt-16">
                    <h1 className="text-[42px] font-light leading-[1.02] tracking-tight drop-shadow-sm md:text-[76px]">
                        Custom Websites.
                        <br />
                        <Em>Crafted</Em> Just for You
                    </h1>
                    <Pill href="#inquiry" className="mt-6">Start a project</Pill>
                </div>

                {/* Floating labels */}
                <Chip label="Design" className="left-[6%] top-[38%] md:left-[7%] md:top-[14%]" />
                <Chip label="Develop" className="right-[6%] top-[38%] md:left-[27%] md:right-auto md:top-[42%]" />
                <Chip label="Launch" className="hidden md:flex md:right-[27%] md:top-[46%]" />
                <Chip label="Support" className="hidden md:flex md:right-[7%] md:top-[14%]" />

                {/* Centre message */}
                <div className="absolute left-1/2 top-[57%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-white md:top-[66%] md:gap-4">
                    <span className="w-20 text-right text-xs leading-tight md:text-sm">It&apos;s time<br />to launch</span>
                    <Asterisk />
                    <span className="w-20 text-xs leading-tight md:text-sm">your idea<br />online</span>
                </div>

                {/* Bottom-left consultation card */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 rounded-[22px] bg-white/90 p-3 pr-4 shadow-lg backdrop-blur md:bottom-5 md:left-5 md:gap-4 md:p-4">
                    <div className="relative grid size-16 place-items-center rounded-full md:size-20" style={{ background: 'conic-gradient(#C8EE7E 0 100%, #eee 0)' }}>
                        <div className="grid size-[54px] place-items-center rounded-full bg-white text-center leading-none md:size-[68px]">
                            <div>
                                <div className="text-xl font-light md:text-2xl">7</div>
                                <div className="text-[9px] text-[#8a8a85]">steps</div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-[120px] text-[11px] leading-snug text-[#6b6b66]">
                        From first idea to a live website
                        <a href="#inquiry" className="mt-2 flex w-max items-center gap-1.5 rounded-full bg-[#DDF5A9] px-3 py-1.5 text-[11px] text-[#151515]">
                            <Calendar size={12} /> Free consultation
                        </a>
                    </div>
                </div>

                {/* Bottom-right browser preview card */}
                <div className="absolute bottom-5 right-5 z-10 hidden w-60 rounded-[22px] bg-white/90 p-3 shadow-lg backdrop-blur md:block">
                    <div className="flex items-center justify-between px-1 pb-2 text-[11px]">
                        live preview <ArrowUpRight size={13} />
                    </div>
                    <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
                        <div className="flex gap-1 bg-[#f4f4f0] px-2 py-1.5">
                            {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-black/15" />)}
                        </div>
                        <div className="relative h-24">
                            <Photo src={IMG('photo-1555396273-367ea4eb4db5', 500)} alt="Restaurant website preview" className="absolute inset-0" />
                            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px]">
                                your site <Play size={9} fill="currentColor" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strip below hero */}
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1.2fr_1fr]">
                <div className="flex items-center gap-3 rounded-[20px] p-2 ring-1 ring-black/5">
                    <Photo src={IMG('photo-1498050108023-c5249f4df085', 400)} alt="Code on a laptop" className="h-14 w-24 shrink-0 rounded-2xl" />
                    <p className="flex-1 text-[11px] leading-tight text-[#8a8a85]">Custom<br />Responsive<br />Yours</p>
                    <span className="grid size-10 place-items-center rounded-full ring-1 ring-black/10"><Code2 size={16} /></span>
                </div>

                <form onSubmit={sendIdea} className="flex items-center gap-2 rounded-[20px] bg-[#f4f4f0] p-2">
                    <span className="hidden gap-1 pl-1 sm:flex">
                        {[Layers, Sparkles, Code2].map((Icon, i) => (
                            <span key={i} className="grid size-7 place-items-center rounded-full bg-[#dedcd6] text-white"><Icon size={13} /></span>
                        ))}
                    </span>
                    <label className="flex flex-1 items-center rounded-full bg-white px-4 py-2.5">
                        <input
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="What do you need? e.g. an online store"
                            className="w-full bg-transparent text-xs outline-none placeholder:text-[#a5a5a0]"
                        />
                        <Search size={14} className="text-[#6b6b66]" />
                    </label>
                    <button aria-label="Send idea" className="grid size-10 shrink-0 place-items-center rounded-full bg-white">
                        <ArrowUpRight size={15} />
                    </button>
                </form>

                <a href="#industries" className="flex items-center justify-between gap-3 rounded-[20px] p-2 pl-4 ring-1 ring-black/5">
                    <p className="text-[12px] leading-tight">Websites for every<br />industry and idea</p>
                    <div className="flex items-center gap-1">
                        <Photo src={IMG('photo-1441986300917-64674bd600d8', 200)} alt="" className="h-9 w-14 rounded-full" />
                        <span className="grid h-9 w-14 place-items-center rounded-full ring-1 ring-black/15"><ArrowRight size={15} /></span>
                        <RoundArrow href="#industries" className="hidden lg:grid" />
                    </div>
                </a>
            </div>
        </section>
    )
}
