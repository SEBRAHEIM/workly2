'use client'

import { useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Check, Loader2 } from 'lucide-react'
import { submitInquiry } from '@/app/actions/inquiry'
import { Em, Pill } from './ui'

const types = ['Business website', 'Online store', 'Booking system', 'Web application', 'Admin dashboard', 'Maintenance', 'Not sure yet']
const budgets = ['Under AED 5,000', 'AED 5,000 – 15,000', 'AED 15,000 – 40,000', 'AED 40,000+', 'Not sure yet']

const field = 'w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/5 placeholder:text-[#a5a5a0] focus:ring-[#151515]'

export function Inquiry() {
    const [state, action, pending] = useActionState(submitInquiry, null)
    const messageRef = useRef<HTMLTextAreaElement>(null)

    // The search pill in the hero hands its text over to this form
    useEffect(() => {
        const onIdea = (e: Event) => {
            const idea = (e as CustomEvent<string>).detail
            if (idea && messageRef.current) {
                messageRef.current.value = idea
                messageRef.current.focus({ preventScroll: true })
            }
        }
        window.addEventListener('workly:idea', onIdea)
        return () => window.removeEventListener('workly:idea', onIdea)
    }, [])

    return (
        <section id="inquiry" className="mx-auto max-w-[1400px] scroll-mt-20 px-3 pt-20 md:px-6 md:pt-28">
            <div className="grid gap-8 rounded-[28px] bg-[#f4f4f0] p-5 md:grid-cols-[1fr_1.3fr] md:gap-12 md:rounded-[36px] md:p-12">
                <div>
                    <h2 className="text-[34px] font-light leading-[1.05] tracking-tight md:text-[52px]">
                        Tell Us What<br />You <Em>Need</Em>
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#6b6b66]">
                        Describe your idea in your own words. We will review it and reply with questions or a proposal covering scope, cost and timeline.
                    </p>
                    <ul className="mt-6 space-y-2 text-xs">
                        {['No templates, every site is custom', 'Free consultation before any quote', 'Support after launch'].map((x) => (
                            <li key={x} className="flex items-center gap-2">
                                <span className="grid size-5 place-items-center rounded-full bg-[#DDF5A9]"><Check size={11} /></span>
                                {x}
                            </li>
                        ))}
                    </ul>
                </div>

                {state?.success ? (
                    <div className="grid place-items-center rounded-[24px] bg-white p-10 text-center">
                        <div>
                            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#DDF5A9]"><Check size={22} /></span>
                            <h3 className="mt-4 text-2xl font-light">Request received</h3>
                            <p className="mt-2 text-sm text-[#6b6b66]">Thank you. We will reply to your email soon.</p>
                        </div>
                    </div>
                ) : (
                    <form action={action} className="grid gap-3 sm:grid-cols-2">
                        <input name="company_site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                        <input id="inq-name" name="name" required placeholder="Your name" className={field} />
                        <input id="inq-email" name="email" type="email" required placeholder="Email address" className={field} />
                        <select id="inq-type" name="project_type" defaultValue="" className={`${field} text-[#151515]`}>
                            <option value="" disabled>What do you need?</option>
                            {types.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        <select id="inq-budget" name="budget" defaultValue="" className={field}>
                            <option value="" disabled>Estimated budget</option>
                            {budgets.map((b) => <option key={b}>{b}</option>)}
                        </select>
                        <textarea
                            id="inq-message"
                            ref={messageRef}
                            name="message"
                            required
                            rows={5}
                            placeholder="Tell us about your business and what the website should do"
                            className={`${field} resize-none sm:col-span-2`}
                        />
                        {state?.error && <p className="text-xs text-red-600 sm:col-span-2">{state.error}</p>}
                        <div className="flex items-center gap-3 sm:col-span-2">
                            {pending ? (
                                <span className="flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin" /> Sending…</span>
                            ) : (
                                <Pill type="submit" variant="dark">Send request</Pill>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </section>
    )
}

export function Footer() {
    return (
        <footer className="mx-auto max-w-[1400px] px-4 pt-20 md:px-6">
            <div className="flex flex-col items-center text-center">
                <p className="text-[30px] font-light leading-[1.05] tracking-tight md:text-[48px]">
                    Let&apos;s Build <Em>Something</Em><br />Worth Visiting
                </p>
                <Pill href="#inquiry" className="mt-6">Start a project</Pill>
            </div>
            <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/5 py-6 text-[11px] text-[#8a8a85] md:flex-row">
                <span>© 2026 Workly · workly.day</span>
                <nav className="flex gap-5">
                    <Link href="/privacy" className="hover:text-[#151515]">Privacy</Link>
                    <Link href="/terms" className="hover:text-[#151515]">Terms</Link>
                    <Link href="/login" className="hover:text-[#151515]">Client login</Link>
                </nav>
            </div>
        </footer>
    )
}
