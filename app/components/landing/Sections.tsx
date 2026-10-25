'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight, Check, FileText, Minus, Plus } from 'lucide-react'
import { Em, Pill, RoundArrow } from './ui'
import {
    ArtArtist, ArtAuto, ArtBooking, ArtBusiness, ArtCafe, ArtCode, ArtDashboard,
    ArtFashion, ArtMaintenance, ArtStore, ArtWebDesign,
} from './Art'

const services = [
    { title: 'Website Design & Development', text: 'Responsive websites designed and built around your goals.', Art: ArtWebDesign },
    { title: 'E-commerce Stores', text: 'Show your products, manage orders and take payments online.', Art: ArtStore },
    { title: 'Business Websites', text: 'For restaurants, tourism, service providers and more.', Art: ArtBusiness },
    { title: 'Custom Web Applications', text: 'Web systems built for the way your business works.', Art: ArtCode },
    { title: 'Booking & Reservations', text: 'Let customers book appointments, services or experiences.', Art: ArtBooking },
    { title: 'Admin Dashboards', text: 'Manage content, products, customers and operations yourself.', Art: ArtDashboard },
    { title: 'Maintenance & Improvements', text: 'Updates, fixes and new features for sites you already have.', Art: ArtMaintenance },
]

function SectionTitle({ children, eyebrow }: { children: React.ReactNode; eyebrow?: string }) {
    return (
        <div data-reveal className="flex flex-col items-center text-center">
            {eyebrow && (
                <span className="mb-4 flex items-center gap-2 rounded-full bg-[#f4f4f0] px-3 py-1 text-[11px] text-[#6b6b66]">
                    <span className="size-1.5 rounded-full bg-[#9bd35a]" />{eyebrow}
                </span>
            )}
            <h2 className="text-balance text-[34px] font-light leading-[1.05] tracking-tight md:text-[52px]">{children}</h2>
        </div>
    )
}

const ticker = ['Websites', 'Online stores', 'Booking systems', 'Web applications', 'Admin dashboards', 'Maintenance']

export function Marquee() {
    const row = [...ticker, ...ticker]
    return (
        <div className="mt-16 overflow-hidden border-y border-black/5 py-5 md:mt-20" aria-hidden>
            <div className="landing-marquee flex w-max items-center gap-10">
                {[...row, ...row].map((t, i) => (
                    <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[28px] font-light tracking-tight md:text-[40px]">
                        {i % 2 ? <Em>{t}</Em> : t}
                        <svg viewBox="0 0 24 24" className="size-5 text-[#9bd35a] md:size-6"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                    </span>
                ))}
            </div>
        </div>
    )
}

export function Services() {
    const rail = useRef<HTMLDivElement>(null)
    const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

    return (
        <section id="services" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-20 md:px-6 md:pt-28">
            <SectionTitle eyebrow="7 services">Where <Em>Ideas</Em><br />Meet <Em>Craft</Em></SectionTitle>

            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[minmax(240px,1fr)_3fr]">
                <div data-reveal className="flex flex-col justify-between gap-6">
                    <div>
                        <p className="max-w-[260px] text-lg leading-snug md:text-xl">
                            Tell us what you need. Our team designs and builds it for you.
                        </p>
                        <p className="mt-3 max-w-[280px] text-xs leading-relaxed text-[#8a8a85]">
                            Workly is not a website builder. There are no templates to fill in. You share your requirements and we handle the design, development and launch.
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <Pill href="#process">How it works</Pill>
                        <div className="flex gap-2">
                            <button onClick={() => scroll(-1)} aria-label="Previous" className="grid size-9 place-items-center rounded-full bg-[#DDF5A9] transition-transform hover:-translate-x-0.5"><ArrowLeft size={15} /></button>
                            <button onClick={() => scroll(1)} aria-label="Next" className="grid size-9 place-items-center rounded-full bg-[#DDF5A9] transition-transform hover:translate-x-0.5"><ArrowRight size={15} /></button>
                        </div>
                    </div>
                </div>

                <div ref={rail} className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0">
                    {services.map(({ title, text, Art }, i) => (
                        <article key={title} data-reveal style={{ ['--rd' as string]: `${Math.min(i, 4) * 0.08}s` }} className="group w-[250px] shrink-0 snap-start md:w-[280px]">
                            <div className="relative h-[190px] overflow-hidden rounded-[22px] transition-transform duration-500 group-hover:-translate-y-1">
                                <Art />
                                <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] tabular-nums">0{i + 1}</span>
                            </div>
                            <h3 className="mt-3 text-sm">{title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-[#8a8a85]">{text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

const thread = [
    { from: 'you', text: 'We need a menu and online table booking for our café.' },
    { from: 'workly', text: 'Sounds great. Let’s set up a free consultation this week.' },
    { from: 'workly', doc: 'Proposal: scope, cost & timeline' },
    { from: 'status', text: 'oliveandember.ae is live' },
]

export function Showcase() {
    return (
        <section id="stores" className="mx-auto grid max-w-[1400px] scroll-mt-20 items-center gap-6 px-4 pt-20 md:grid-cols-2 md:gap-10 md:px-6 md:pt-28">
            <div className="grid gap-3 sm:grid-cols-[1.15fr_1fr]">
                <div className="flex flex-col gap-2 rounded-[24px] bg-gradient-to-br from-[#e9d8c8] to-[#d6e4e0] p-3">
                    <span className="px-1 pt-1 text-[10px] text-[#6b6b66]">Project thread</span>
                    {thread.map((m, i) => (
                        <div
                            key={i}
                            data-reveal
                            style={{ ['--rd' as string]: `${i * 0.35}s` }}
                            className={
                                m.from === 'you'
                                    ? 'mr-6 rounded-2xl rounded-tl-md bg-white p-2.5 text-[11px] leading-snug shadow-sm'
                                    : m.from === 'workly'
                                        ? 'ml-6 rounded-2xl rounded-tr-md bg-[#151515] p-2.5 text-[11px] leading-snug text-white'
                                        : 'flex items-center gap-2 self-center rounded-full bg-[#DDF5A9] px-3 py-1.5 text-[11px]'
                            }
                        >
                            {m.from === 'status' && <span className="art-pulse size-1.5 rounded-full bg-[#2f7d32]" />}
                            {m.doc ? (
                                <span className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-white/15"><FileText size={13} /></span>{m.doc}</span>
                            ) : m.text}
                        </div>
                    ))}
                </div>

                <div data-reveal style={{ ['--rd' as string]: '.15s' }} className="self-end rounded-[22px] p-4 ring-1 ring-[#151515]">
                    <p className="mb-3 text-[11px] text-[#8a8a85]">In every project</p>
                    {[
                        { icon: Check, note: 'Included', label: 'Responsive design' },
                        { icon: Check, note: 'Included', label: 'Testing before launch' },
                        { icon: Plus, note: 'When you need it', label: 'Admin dashboard' },
                        { icon: Minus, note: 'Optional', label: 'Ongoing maintenance' },
                    ].map(({ icon: Icon, note, label }) => (
                        <div key={label} className="flex items-center gap-3 py-1.5">
                            <span className="grid size-7 place-items-center rounded-full bg-[#f4f4f0]"><Icon size={13} /></span>
                            <div className="leading-tight">
                                <span className="block text-[10px] text-[#a5a5a0]">{note}</span>
                                <span className="text-xs">{label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div data-reveal className="md:pl-10">
                <h2 className="text-[30px] font-light leading-[1.08] tracking-tight md:text-[44px]">
                    Your Idea, <Em>Handled</Em> From Start to Finish
                </h2>
                <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#8a8a85]">
                    Send a request in your own words. We reply, agree the scope with you, send a clear proposal, then design, build, test and launch. You always know what happens next.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Pill href="#inquiry">Send a request</Pill>
                    <Pill href="#process" variant="outline">See the process</Pill>
                </div>
            </div>
        </section>
    )
}

// Sample data for an example dashboard, labelled as such on the card
const bookings = [
    { d: 'M', v: 32 }, { d: 'T', v: 46 }, { d: 'W', v: 63 }, { d: 'T', v: 31 },
    { d: 'F', v: 54 }, { d: 'S', v: 79 }, { d: 'S', v: 67 },
]

const industryCards = [
    { label: 'Restaurants & cafés', Art: ArtCafe },
    { label: 'Fashion brands', Art: ArtFashion },
    { label: 'Automotive', Art: ArtAuto },
    { label: 'Artists & creatives', Art: ArtArtist },
]

export function Bento() {
    const max = 79
    return (
        <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-6 md:pt-28">
            <SectionTitle eyebrow="Built to grow with you">Your Gateway<br />to <Em>Growth</Em></SectionTitle>

            <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div data-reveal className="relative h-[380px] overflow-hidden rounded-[24px] md:row-span-2 md:h-auto">
                    <ArtBooking big />
                    <span className="absolute left-3 top-3 rounded-full bg-[#DDF5A9] px-3 py-1 text-[11px]">Booking systems</span>
                    <a href="#inquiry" className="absolute bottom-3 left-3 flex items-center gap-4 rounded-2xl bg-white/95 p-3 pr-3 text-xs leading-tight shadow-sm transition-transform hover:-translate-y-0.5">
                        Request your<br />website today
                        <span className="grid size-7 place-items-center rounded-full bg-[#DDF5A9]"><Plus size={14} /></span>
                    </a>
                    <RoundArrow className="absolute bottom-3 right-3" />
                </div>

                <div data-reveal style={{ ['--rd' as string]: '.1s' }} className="flex flex-col rounded-[24px] bg-[#f4f4f0] p-4 md:row-span-2">
                    <div className="flex items-center justify-between">
                        <span className="w-max rounded-full bg-white px-3 py-1 text-[11px]">Weekly bookings</span>
                        <span className="flex items-center gap-1 text-[10px] text-[#6b6b66]"><span className="art-pulse size-1.5 rounded-full bg-[#9bd35a]" />live</span>
                    </div>
                    <div data-grow className="mt-6 flex h-44 items-end gap-2 md:h-auto md:min-h-48 md:flex-1">
                        {bookings.map((b, i) => (
                            <div key={i} style={{ ['--i' as string]: i }} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                                <span className="text-[10px] tabular-nums">{b.v}</span>
                                <div className={`w-full rounded-full ${b.v === max ? 'bg-[#151515]' : 'bg-white'}`} style={{ height: `${(b.v / max) * 80}%` }} />
                                <span className="text-[10px] text-[#a5a5a0]">{b.d}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-[11px] leading-snug">\\ Example: an admin dashboard we build lets you see your bookings at a glance.</p>
                </div>

                {industryCards.map(({ label, Art }, i) => (
                    <div key={label} data-reveal style={{ ['--rd' as string]: `${0.15 + i * 0.08}s` }} className={`group relative h-[220px] overflow-hidden rounded-[24px] ${i > 1 ? 'hidden md:block' : ''}`}>
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"><Art /></div>
                        <span className="absolute left-3 top-3 rounded-full bg-[#DDF5A9] px-3 py-1 text-[11px]">{label}</span>
                        <RoundArrow href="#industries" className="absolute bottom-3 right-3" />
                    </div>
                ))}
            </div>
        </section>
    )
}

const steps = [
    { t: 'Discover', d: 'Explore our services and the kinds of websites we build.' },
    { t: 'Request', d: 'Send an inquiry describing the website or system you need.' },
    { t: 'Consultation', d: 'We review your requirements and agree on scope and functionality.' },
    { t: 'Quotation', d: 'You get a proposal with the work, estimated cost and timeline.' },
    { t: 'Development', d: 'We design and build your website or application.' },
    { t: 'Delivery', d: 'Your project is tested and handed over, ready to go live.' },
    { t: 'Support', d: 'Maintenance, improvements and help whenever you need them.' },
]

export function Process() {
    return (
        <section id="process" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-20 md:px-6 md:pt-28">
            <SectionTitle eyebrow="How it works">From Idea<br />to <Em>Launch</Em></SectionTitle>
            <ol className="relative mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-7">
                {/* Connecting line that draws across the steps on wide screens */}
                <span data-reveal className="pointer-events-none absolute left-8 right-8 top-8 hidden h-px origin-left bg-[#151515]/15 lg:block" />
                {steps.map((s, i) => (
                    <li
                        key={s.t}
                        data-reveal
                        style={{ ['--rd' as string]: `${i * 0.09}s` }}
                        className={`group relative flex gap-4 rounded-[22px] p-4 transition-colors duration-300 hover:bg-[#DDF5A9] lg:flex-col ${i === 1 ? 'bg-[#DDF5A9]' : 'bg-[#f4f4f0]'}`}
                    >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-xs tabular-nums transition-transform duration-300 group-hover:scale-110">{i + 1}</span>
                        <div>
                            <h3 className="text-sm">{s.t}</h3>
                            <p className="mt-1 text-[11px] leading-relaxed text-[#6b6b66]">{s.d}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    )
}

const industries = [
    'Small & medium businesses', 'Startups & entrepreneurs', 'Fashion & clothing brands',
    'Restaurants & coffee shops', 'Tourism & hospitality', 'Automotive',
    'Artists & creatives', 'E-commerce', 'Custom digital systems',
]

export function Industries() {
    return (
        <section id="industries" className="mx-auto max-w-[1000px] scroll-mt-20 px-4 pt-20 text-center md:px-6 md:pt-28">
            <SectionTitle eyebrow="Who we work with">Built for <Em>Every</Em><br />Kind of Business</SectionTitle>
            <p data-reveal className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-[#8a8a85]">
                A simple information site, a full online store or a complex web app. We are not limited to one industry or one format.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
                {industries.map((x, i) => (
                    <span
                        key={x}
                        data-reveal
                        style={{ ['--rd' as string]: `${i * 0.05}s` }}
                        className={`cursor-default rounded-full px-4 py-2 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#151515] hover:text-white ${i % 4 === 0 ? 'bg-[#DDF5A9]' : 'ring-1 ring-black/10'}`}
                    >
                        {x}
                    </span>
                ))}
            </div>
        </section>
    )
}
