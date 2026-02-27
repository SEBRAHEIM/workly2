'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Scale, Info, Zap, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import AEDIcon from '@/app/components/AEDIcon'

export default function TermsPage() {
    const sections = [
        {
            title: "1. The Marketplace",
            content: "Workly is a creative studio marketplace that connects student creators with clients. Workly provides the infrastructure for project management, escrow, and payments but is not a party to the creative contracts between users.",
            icon: Zap,
            color: "text-sky-500"
        },
        {
            title: "2. Escrow and Payments",
            content: "To protect both creators and clients, Workly utilizes an escrow system. Payments are held securely and released only upon client approval or auto-release conditions.",
            icon: AEDIcon,
            color: "text-emerald-500",
            bullets: [
                "Fees: Workly charges a standard commission of 20% on the total contract value.",
                "Release: Funds are released to the creator upon client approval of the final deliverable.",
                "Auto-Release: If a client takes no action for 3 days after submission, funds are auto-released.",
                "Late Delivery Policy: If a creator fails to provide the first submission by the agreed deadline, the client is entitled to a 100% refund of the escrowed funds upon request."
            ]
        },
        {
            title: "3. User Conduct and Safety",
            content: "The security of our community is paramount. We maintain a zero-tolerance policy for off-platform communication or payments.",
            icon: Shield,
            color: "text-indigo-500",
            bullets: [
                "Contact Info: Sharing personal contact information (email, phone, handles) is strictly prohibited.",
                "Consequences: Violation of safety policies leads to permanent account suspension.",
                "Prohibited Content: Illegal, defamatory, or IP-violating content is banned."
            ]
        },
        {
            title: "4. Intellectual Property",
            content: "Upon full release of payment, the intellectual property rights of the deliverable are transferred from the creator to the client, unless otherwise agreed upon in the project brief.",
            icon: Scale,
            color: "text-slate-900"
        },
        {
            title: "5. Dispute Resolution",
            content: "In the event of a disagreement, users may 'Report an Issue.' Workly's moderation team will review the project history to reach a final, fair decision.",
            icon: AlertTriangle,
            color: "text-rose-500"
        }
    ]

    return (
        <main className="min-h-screen bg-[#F8F9FB] pb-20 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-60" />

            {/* Premium Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/signup"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Join
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                            <Scale className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Legal</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-sans font-black text-slate-900 mb-6 leading-none tracking-tighter uppercase">
                        Terms of <br /> <span className="text-sky-500">Service.</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] opacity-80">
                        The Rules of Engagement for the Workly Collective.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200/60 shadow-xl shadow-slate-200/20 group hover:border-sky-500/20 transition-all"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform ${section.color}`}>
                                    <section.icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{section.title}</h2>
                                    <p className="text-slate-600 leading-relaxed text-base font-medium mb-6">
                                        {section.content}
                                    </p>
                                    {section.bullets && (
                                        <ul className="space-y-3">
                                            {section.bullets.map((bullet, bIdx) => (
                                                <li key={bIdx} className="flex items-start gap-3 text-sm font-bold text-slate-500 group/item">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0 group-hover/item:scale-125 transition-transform" />
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Last Updated: February 27, 2026 • Workly Operations
                </div>
            </div>
        </main>
    )
}
