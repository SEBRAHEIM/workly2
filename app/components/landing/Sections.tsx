'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from 'lucide-react'
import { Em, IMG, Photo, Pill, RoundArrow } from './ui'

const services = [
    { title: 'Website Design & Development', text: 'Responsive websites designed and built around your goals.', img: 'photo-1497366811353-6870744d04b2' },
    { title: 'E-commerce Stores', text: 'Show your products, manage orders and take payments online.', img: 'photo-1441986300917-64674bd600d8' },
    { title: 'Business Websites', text: 'For restaurants, tourism, service providers and more.', img: 'photo-1555396273-367ea4eb4db5' },
    { title: 'Custom Web Applications', text: 'Web systems built for the way your business works.', img: 'photo-1498050108023-c5249f4df085' },
    { title: 'Booking & Reservations', text: 'Let customers book appointments, services or experiences.', img: 'photo-1566073771259-6a8506099945' },
    { title: 'Admin Dashboards', text: 'Manage content, products, customers and operations yourself.', img: 'photo-1460925895917-afdab827c52f' },
    { title: 'Maintenance & Improvements', text: 'Updates, fixes and new features for sites you already have.', img: 'photo-1517694712202-14dd9538aa97' },
]

const tints = [
    'from-[#d7e6e4] to-[#f1dfcf]',
    'from-[#efd6cf] to-[#e9e4d6]',
    'from-[#dbe5d0] to-[#f0e6d4]',
    'from-[#d3dde8] to-[#ece4d8]',
]

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
    return (
        <h2 id={id} className="scroll-mt-24 text-balance text-center text-[34px] font-light leading-[1.05] tracking-tight md:text-[52px]">
            {children}
        </h2>
    )
}

export function Services() {
    const rail = useRef<HTMLDivElement>(null)
    const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

    return (
        <section id="services" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-20 md:px-6 md:pt-28">
            <SectionTitle>Where <Em>Ideas</Em><br />Meet <Em>Craft</Em></SectionTitle>

            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[minmax(240px,1fr)_3fr]">
                <div className="flex flex-col justify-between gap-6">
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
                            <button onClick={() => scroll(-1)} aria-label="Previous" className="grid size-9 place-items-center rounded-full bg-[#DDF5A9]"><ArrowLeft size={15} /></button>
                            <button onClick={() => scroll(1)} aria-label="Next" className="grid size-9 place-items-center rounded-full bg-[#DDF5A9]"><ArrowRight size={15} /></button>
                        </div>
                    </div>
                </div>

                <div ref={rail} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0">
                    {services.map((s, i) => (
                        <article key={s.title} className="w-[240px] shrink-0 snap-start md:w-[260px]">
                            <Photo src={IMG(s.img, 600)} alt={s.title} tint={`${tints[i % tints.length]}`} className="h-[170px] rounded-[22px]" />
                            <h3 className="mt-3 text-sm">{s.title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-[#8a8a85]">{s.text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function Showcase() {
    return (
        <section id="work" className="mx-auto grid max-w-[1400px] scroll-mt-20 items-center gap-6 px-4 pt-20 md:grid-cols-2 md:gap-10 md:px-6 md:pt-28">
            <div className="grid gap-3 sm:grid-cols-[1.1fr_1fr]">
                <div className="relative">
                    <Photo src={IMG('photo-1495474472287-4d71bcdd2085', 800)} alt="Coffee shop counter" tint="from-[#e9d8c8] to-[#cfe0dc]" className="h-[260px] rounded-[24px]" />
                    <div className="absolute left-3 top-3 max-w-[180px] rounded-2xl bg-white/90 p-3 text-[11px] leading-snug shadow-sm backdrop-blur">
                        <span className="text-[10px] text-[#8a8a85]">Your request</span>
                        <p className="mt-1">&ldquo;We need a menu and online table booking for our café.&rdquo;</p>
                    </div>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px]">Delivered as a custom site</span>
                    </div>
                </div>

                <div className="self-end rounded-[22px] p-4 ring-1 ring-[#151515]">
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

            <div className="md:pl-10">
                <h2 className="text-[30px] font-light leading-[1.08] tracking-tight md:text-[44px]">
                    Your Own Store with a <Em>Seamless</Em> Checkout
                </h2>
                <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#8a8a85]">
                    From a single café to a growing clothing brand, we build online stores and booking systems that let your customers buy and reserve without friction.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Pill href="#services">View services</Pill>
                    <Pill href="#inquiry" variant="outline">Get a quote</Pill>
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

export function Bento() {
    const max = 79
    return (
        <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-6 md:pt-28">
            <SectionTitle>Your Gateway<br />to <Em>Growth</Em></SectionTitle>

            <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div className="relative h-[340px] md:row-span-2 md:h-auto">
                    <Photo src={IMG('photo-1566073771259-6a8506099945', 1000)} alt="Resort pool" tint="from-[#cfe3ea] to-[#efe1cf]" className="absolute inset-0 rounded-[24px]" />
                    <span className="absolute left-3 top-3 rounded-full bg-[#DDF5A9] px-3 py-1 text-[11px]">Booking systems</span>
                    <a href="#inquiry" className="absolute bottom-3 left-3 flex items-center gap-4 rounded-2xl bg-white/95 p-3 pr-3 text-xs leading-tight shadow-sm">
                        Request your<br />website today
                        <span className="grid size-7 place-items-center rounded-full bg-[#DDF5A9]"><Plus size={14} /></span>
                    </a>
                    <RoundArrow className="absolute bottom-3 right-3" />
                </div>

                <div className="flex flex-col rounded-[24px] bg-[#f4f4f0] p-4 md:row-span-2">
                    <span className="w-max rounded-full bg-white px-3 py-1 text-[11px]">Weekly bookings</span>
                    <div className="mt-6 flex h-44 items-end gap-2 md:h-auto md:flex-1">
                        {bookings.map((b, i) => (
                            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                                <span className="text-[10px] tabular-nums">{b.v}</span>
                                <div className={`w-full rounded-full ${b.v === max ? 'bg-[#cfcfca]' : 'bg-white'}`} style={{ height: `${(b.v / max) * 80}%` }} />
                                <span className="text-[10px] text-[#a5a5a0]">{b.d}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-[11px] leading-snug">\\ Example: an admin dashboard we build lets you see your bookings at a glance.</p>
                </div>

                {[
                    { label: 'Restaurants & cafés', img: 'photo-1555396273-367ea4eb4db5', tint: 'from-[#efd9c9] to-[#d9e4dc]' },
                    { label: 'Fashion brands', img: 'photo-1441986300917-64674bd600d8', tint: 'from-[#ead5d2] to-[#e6e2d7]' },
                    { label: 'Automotive', img: 'photo-1503376780353-7e6692767b70', tint: 'from-[#d6dfe6] to-[#ede3d6]' },
                    { label: 'Artists & creatives', img: 'photo-1513364776144-60967b0f800f', tint: 'from-[#dfe6d1] to-[#f0e2d2]' },
                ].map((c, i) => (
                    <div key={c.label} className={`relative h-[200px] ${i > 1 ? 'hidden md:block' : ''} ${i === 0 ? 'md:col-span-2' : ''}`}>
                        <Photo src={IMG(c.img, 700)} alt={c.label} tint={`${c.tint}`} className="absolute inset-0 rounded-[24px]" />
                        <span className="absolute left-3 top-3 rounded-full bg-[#DDF5A9] px-3 py-1 text-[11px]">{c.label}</span>
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
            <SectionTitle>From Idea<br />to <Em>Launch</Em></SectionTitle>
            <ol className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-7">
                {steps.map((s, i) => (
                    <li key={s.t} className={`flex gap-4 rounded-[22px] p-4 lg:flex-col ${i === 1 ? 'bg-[#DDF5A9]' : 'bg-[#f4f4f0]'}`}>
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-xs tabular-nums">{i + 1}</span>
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
            <SectionTitle>Built for <Em>Every</Em><br />Kind of Business</SectionTitle>
            <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-[#8a8a85]">
                A simple information site, a full online store or a complex web app. We are not limited to one industry or one format.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
                {industries.map((x, i) => (
                    <span key={x} className={`rounded-full px-4 py-2 text-xs ${i % 4 === 0 ? 'bg-[#DDF5A9]' : 'ring-1 ring-black/10'}`}>{x}</span>
                ))}
            </div>
        </section>
    )
}
