import { Hammer, LayoutDashboard, LifeBuoy, Users } from 'lucide-react'
import { Em } from './ui'

const reasons = [
    { icon: Hammer, t: 'Built from scratch', d: 'No templates and no drag-and-drop builders. Your site is designed around your brand and your customers.' },
    { icon: Users, t: 'One team, start to finish', d: 'The same team handles consultation, design, development, testing and launch.' },
    { icon: LayoutDashboard, t: 'Easy to manage', d: 'Need to update products, bookings or content yourself? We can build an admin dashboard for it.' },
    { icon: LifeBuoy, t: 'Support after launch', d: 'Maintenance, improvements and new features whenever your business needs them.' },
]

export function Why() {
    return (
        <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-6 md:pt-28">
            <div data-reveal className="grid gap-10 rounded-[28px] bg-[#151515] p-6 text-white md:grid-cols-[1fr_2fr] md:rounded-[36px] md:p-12">
                <div>
                    <h2 className="text-[34px] font-light leading-[1.05] tracking-tight md:text-[48px]">
                        Why <Em>Workly</Em>
                    </h2>
                    <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/60">
                        Website builders leave the work to you. We take your requirements and deliver a finished, tested website.
                    </p>
                </div>
                <div className="grid gap-px overflow-hidden rounded-[22px] bg-white/10 sm:grid-cols-2">
                    {reasons.map(({ icon: Icon, t, d }, i) => (
                        <div key={t} data-reveal style={{ ['--rd' as string]: `${0.2 + i * 0.1}s` }} className="group bg-[#151515] p-5 transition-colors duration-300 hover:bg-[#1f1f1d]">
                            <span className="grid size-9 place-items-center rounded-full bg-[#DDF5A9] text-[#151515] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"><Icon size={16} strokeWidth={1.75} /></span>
                            <h3 className="mt-4 text-base font-normal">{t}</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-white/60">{d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const faqs = [
    { q: 'How much does a website cost?', a: 'It depends on what you need. A simple business website costs less than an online store or a custom web application. After a free consultation we send a proposal with the scope, estimated cost and timeline.' },
    { q: 'How long does it take?', a: 'The timeline depends on the size of the project and is agreed in your proposal before any work starts.' },
    { q: 'Do I need any technical knowledge?', a: 'No. You tell us what you need in plain words, and we handle the design, development and launch.' },
    { q: 'Is Workly a website builder like Wix or Squarespace?', a: 'No. We are a web development team. You do not build anything yourself; we design and develop a custom website for you.' },
    { q: 'Can I update the website myself after launch?', a: 'Yes, if you need to. We can build an admin dashboard so you can manage content, products, bookings and customers.' },
    { q: 'Can you improve a website I already have?', a: 'Yes. We offer maintenance and improvements for existing websites, from small fixes to new features.' },
]

export function Faq() {
    return (
        <section id="faq" className="mx-auto grid max-w-[1400px] scroll-mt-20 gap-8 px-4 pt-20 md:grid-cols-[1fr_1.6fr] md:px-6 md:pt-28">
            <div data-reveal>
                <h2 className="text-[34px] font-light leading-[1.05] tracking-tight md:text-[52px]">
                    Common <Em>Questions</Em>
                </h2>
                <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#8a8a85]">
                    Something else on your mind? Ask it in the request form below and we will answer.
                </p>
            </div>
            <div data-reveal style={{ ['--rd' as string]: '.1s' }} className="divide-y divide-black/10 border-y border-black/10">
                {faqs.map(({ q, a }, i) => (
                    <details key={q} open={i === 0} className="group py-1">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] [&::-webkit-details-marker]:hidden">
                            {q}
                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f4f4f0] text-lg leading-none transition-transform duration-300 group-open:rotate-45 group-open:bg-[#DDF5A9]">+</span>
                        </summary>
                        <p className="max-w-xl pb-5 pr-12 text-sm leading-relaxed text-[#6b6b66]">{a}</p>
                    </details>
                ))}
            </div>
        </section>
    )
}
