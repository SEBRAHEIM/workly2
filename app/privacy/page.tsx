'use client'

import Link from 'next/link'
import { ArrowLeft, User, Lock, Eye, Share2, MousePointer2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
    const sections = [
        {
            title: "1. Information We Collect",
            content: "We collect minimal information necessary to operate the platform and ensure a high-quality experience for creators and clients.",
            icon: User,
            color: "text-sky-500",
            bullets: [
                "Profile Data: Name, username, display name, and avatar.",
                "Contact Data: Email address for authentication and notifications.",
                "Privacy Note: We do NOT collect or store your phone number."
            ]
        },
        {
            title: "2. How We Use Data",
            content: "Your data is used specifically to facilitate the workspace and financial transactions.",
            icon: MousePointer2,
            color: "text-emerald-500",
            bullets: [
                "Fulfillment: Enabling the workflow between creators and clients.",
                "Payments: Processing secure transactions via Stripe.",
                "Communications: Sending vital project-related alerts via email."
            ]
        },
        {
            title: "3. Data Sharing",
            content: "We believe in radical data privacy. We do not sell your personal information to third parties.",
            icon: Share2,
            color: "text-indigo-500",
            bullets: [
                "Workspace: Essential profile data is shared with the user you are working with.",
                "Partners: Data is shared with secure providers (Supabase, Stripe, Resend) to fulfill services.",
                "Compliance: Data may be shared if required by legal authorities."
            ]
        },
        {
            title: "4. Data Security",
            content: "Workly uses industry-standard encryption and security protocols to ensure your data and funds are protected at every layer.",
            icon: Lock,
            color: "text-slate-900"
        },
        {
            title: "5. Your Rights",
            content: "You have full control over your data. You can update your profile information or delete your account at any time through our Support & Account settings.",
            icon: Eye,
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
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-slate-900" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Privacy</span>
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
                        Privacy <br /> <span className="text-[#0EA5E9]">Policy.</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] opacity-80">
                        How we protect your identity and data at Workly.
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
                    Last Updated: February 27, 2026 • Workly Data Protection
                </div>
            </div>
        </main>
    )
}
