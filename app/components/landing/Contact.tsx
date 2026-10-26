'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, ChevronDown, Loader2 } from 'lucide-react'
import { submitInquiry } from '@/app/actions/inquiry'
import { WorklyLogo } from './Logo'

const types = ['Business website', 'Online store', 'Booking system', 'Web application', 'Portfolio', 'Admin dashboard', 'Maintenance', 'Not sure yet']
const budgets = ['Under AED 5,000', 'AED 5,000 – 15,000', 'AED 15,000 – 40,000', 'AED 40,000+', 'Not sure yet']

const line = 'peer w-full border-b-2 border-[#0d0d0d]/25 bg-transparent pb-3 pt-7 text-lg outline-none transition-colors placeholder:text-transparent focus:border-[#0d0d0d]'
const label = 'pointer-events-none absolute left-0 top-7 origin-left text-lg text-[#0d0d0d]/55 transition-all peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs'

function Field({ id, name, text, type = 'text' }: { id: string; name: string; text: string; type?: string }) {
    return (
        <div className="relative">
            <input id={id} name={name} type={type} required placeholder={text} className={line} />
            <label htmlFor={id} className={label}>{text}</label>
        </div>
    )
}

function Choice({ id, name, text, options }: { id: string; name: string; text: string; options: string[] }) {
    return (
        <div className="relative">
            <label htmlFor={id} className="text-xs text-[#0d0d0d]/55">{text}</label>
            <select id={id} name={name} defaultValue="" className="w-full appearance-none border-b-2 border-[#0d0d0d]/25 bg-transparent pb-3 pt-2 text-lg outline-none focus:border-[#0d0d0d]">
                <option value="" disabled>Choose one</option>
                {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute bottom-4 right-0" />
        </div>
    )
}

function Badge() {
    const id = useId()
    return (
        <a href="#contact-form" aria-label="Start a project" className="group relative block size-40 md:size-48">
            {/* Clean seal: thin rules, small spaced type, the logo sitting on its own in the middle */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
                <circle cx="100" cy="100" r="96" fill="none" stroke="#0d0d0d" strokeWidth="1.2" />
                <circle cx="100" cy="100" r="66" fill="none" stroke="#0d0d0d" strokeWidth="1.2" />
            </svg>
            <svg viewBox="0 0 200 200" className="landing-spin absolute inset-0 h-full w-full [animation-duration:28s] group-hover:[animation-duration:8s]" aria-hidden>
                <defs><path id={id} d="M100 100 m-77 0 a77 77 0 1 1 154 0 a77 77 0 1 1 -154 0" /></defs>
                <text fill="#0d0d0d" fontSize="10.5" fontWeight="500" className="font-[family-name:var(--font-geist-mono)] uppercase">
                    <textPath href={`#${id}`} textLength="480" lengthAdjust="spacing">Start a project ✦ Start a project ✦ Start a project ✦</textPath>
                </text>
            </svg>
            <span className="absolute inset-[30%] grid place-items-center text-[#0d0d0d] transition-transform duration-700 ease-out group-hover:rotate-[20deg] group-hover:scale-110">
                <WorklyLogo className="size-full" />
            </span>
        </a>
    )
}

const faqs = [
    ['How much does a website cost?', 'It depends on what you need. After a free consultation we send a proposal with the scope, estimated cost and timeline.'],
    ['How long does it take?', 'The timeline depends on the size of the project and is agreed in your proposal before work starts.'],
    ['Do I need technical knowledge?', 'No. Tell us what you need in plain words; we handle design, development and launch.'],
    ['Is Workly a website builder?', 'No. You do not build anything yourself. We design and develop a custom website for you.'],
    ['Can you improve a site I already have?', 'Yes. We offer maintenance and improvements, from small fixes to new features.'],
]

/* WORLD 7 — Minimal conversion. Bright yellow, a rotating badge, a calm form. */
export function Contact() {
    const [state, action, pending] = useActionState(submitInquiry, null)
    const message = useRef<HTMLTextAreaElement>(null)

    // The brief card in world 2 hands its text over to this form
    useEffect(() => {
        const onIdea = (e: Event) => {
            const idea = (e as CustomEvent<string>).detail
            if (idea && message.current) {
                message.current.value = idea
                message.current.focus({ preventScroll: true })
            }
        }
        window.addEventListener('workly:idea', onIdea)
        return () => window.removeEventListener('workly:idea', onIdea)
    }, [])

    return (
        <section id="contact" className="scroll-mt-16 bg-[#f5b52e] px-4 pb-24 pt-10 text-[#0d0d0d] md:px-10 md:pb-32 md:pt-16">
            <div className="mx-auto grid max-w-[1300px] gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
                <div className="flex flex-col justify-between gap-10">
                    <div>
                        <p className="font-[family-name:var(--font-kufi)] text-2xl font-bold" dir="rtl" lang="ar">ابدأ مشروعك</p>
                        <h2 className="mt-3 text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
                            Let&apos;s build<br /><span className="font-[family-name:var(--font-instrument)] font-normal italic tracking-[-0.02em]">yours.</span>
                        </h2>
                        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[#0d0d0d]/75">
                            Tell us about the idea. We review every request and reply with questions or a proposal.
                        </p>
                    </div>
                    <Badge />
                </div>

                <div id="contact-form" className="scroll-mt-24">
                    {state?.success ? (
                        <div className="flex h-full flex-col justify-center">
                            <span className="grid size-16 place-items-center rounded-full bg-[#0d0d0d] text-[#f5b52e]"><Check size={28} /></span>
                            <p className="mt-6 text-4xl font-semibold tracking-tight">Request received.</p>
                            <p className="mt-2 text-[#0d0d0d]/70">Thank you. We will reply to your email soon.</p>
                        </div>
                    ) : (
                        <form action={action} className="grid gap-7">
                            <input name="company_site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                            <div className="grid gap-7 sm:grid-cols-2">
                                <Field id="c-name" name="name" text="Your name" />
                                <Field id="c-email" name="email" type="email" text="Email address" />
                            </div>
                            <div className="grid gap-7 sm:grid-cols-2">
                                <Choice id="c-type" name="project_type" text="What do you need?" options={types} />
                                <Choice id="c-budget" name="budget" text="Estimated budget" options={budgets} />
                            </div>
                            <div className="relative">
                                <textarea id="c-message" ref={message} name="message" required rows={4} placeholder="Tell us about your business" className={`${line} resize-none`} />
                                <label htmlFor="c-message" className={label}>Tell us about your business and the website</label>
                            </div>
                            {state?.error && <p className="text-sm font-medium text-[#8a1c12]">{state.error}</p>}
                            <button disabled={pending} className="group flex w-full items-center justify-between rounded-full bg-[#0d0d0d] py-2 pl-7 pr-2 text-lg text-[#f5b52e] transition-transform hover:scale-[1.01] disabled:opacity-70 sm:w-80">
                                {pending ? 'Sending…' : 'Send request'}
                                <span className="grid size-12 place-items-center rounded-full bg-[#f5b52e] text-[#0d0d0d] transition-transform group-hover:rotate-45">
                                    {pending ? <Loader2 size={20} className="animate-spin" /> : <ArrowUpRight size={20} />}
                                </span>
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div id="faq" className="mx-auto mt-24 grid max-w-[1300px] scroll-mt-20 gap-6 md:mt-32 md:grid-cols-[1fr_1.1fr] md:gap-20">
                <p className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">Questions,<br /><span className="font-[family-name:var(--font-instrument)] font-normal italic">answered.</span></p>
                <div className="border-t-2 border-[#0d0d0d]">
                    {faqs.map(([q, a]) => (
                        <details key={q} className="group border-b border-[#0d0d0d]/25">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg [&::-webkit-details-marker]:hidden">
                                {q}
                                <span className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                            </summary>
                            <p className="max-w-xl pb-6 pr-10 text-[15px] leading-relaxed text-[#0d0d0d]/75">{a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function Footer() {
    return (
        <footer className="overflow-hidden bg-[#0d0d0d] px-4 pt-14 text-[#f2efe8] md:px-10">
            <div className="mx-auto flex max-w-[1300px] flex-col gap-10 md:flex-row md:justify-between">
                <p className="max-w-xs text-sm leading-relaxed text-[#f2efe8]/60">Workly designs and builds websites, online stores, booking systems and web applications for businesses of every kind.</p>
                <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
                    <a href="#work" className="hover:text-[#f5b52e]">What we make</a>
                    <a href="#services" className="hover:text-[#f5b52e]">Services</a>
                    <a href="#gallery" className="hover:text-[#f5b52e]">Exhibition</a>
                    <a href="#process" className="hover:text-[#f5b52e]">Process</a>
                    <a href="#faq" className="hover:text-[#f5b52e]">FAQ</a>
                    <a href="#contact" className="hover:text-[#f5b52e]">Start a project</a>
                    <Link href="/login" className="hover:text-[#f5b52e]">Client login</Link>
                    <Link href="/privacy" className="hover:text-[#f5b52e]">Privacy</Link>
                    <Link href="/terms" className="hover:text-[#f5b52e]">Terms</Link>
                </nav>
            </div>
            <div className="mt-12 flex justify-center pb-10 text-[#f2efe8]">
                <WorklyLogo reg className="w-[min(78vw,560px)] transition-transform duration-1000 ease-out hover:rotate-[24deg]" />
            </div>
            <div className="mx-auto flex max-w-[1300px] justify-between border-t border-[#f2efe8]/10 py-5 text-[11px] text-[#f2efe8]/50">
                <span>© 2026 Workly</span>
                <span>workly.day</span>
            </div>
        </footer>
    )
}
