'use client'

import { motion } from 'framer-motion'
import { Briefcase, Wallet, Search, ArrowRight, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface DashboardCardProps {
    val: string | number
    label: string
    sublabel: string
    href: string
    icon: any
}

function DashboardCard({ val, label, sublabel, href, icon: Icon }: DashboardCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group relative bg-white border border-sky-50 overflow-hidden"
        >
            <Link href={href} className="block p-8 md:p-12 h-full relative z-10 transition-all duration-700">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-all shadow-sm rounded-2xl">
                        <Icon size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-[#0EA5E9] transition-colors">
                        Protocol // 0{label.length % 5 + 1}
                    </span>
                </div>

                <div className="mb-12">
                    <h3 className="text-5xl md:text-6xl font-black font-serif text-slate-900 leading-none mb-3 tracking-tighter uppercase">
                        {val}
                    </h3>
                    <p className="text-sm font-black text-[#0EA5E9] uppercase tracking-[0.2em]">
                        {label}
                    </p>
                    <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed max-w-[200px]">
                        {sublabel}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-2xl flex items-center gap-3 rounded-full">
                        Initialize
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-110">
                    <TrendingUp size={240} className="text-slate-900 -rotate-12" />
                </div>
            </Link>
        </motion.div>
    )
}

export default function StudentDashboardOverview({
    projectCount = 0,
    balance = "AED 0.00"
}: {
    projectCount?: number,
    balance?: string
}) {
    return (
        <section className="px-4 md:px-6 py-12 md:py-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-px md:bg-sky-50 md:border md:border-sky-50 shadow-2xl shadow-sky-100/50 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
                <DashboardCard
                    val={projectCount}
                    label="Active Projects"
                    sublabel="Manage your ongoing institutional collaborations."
                    href="/student/projects"
                    icon={Briefcase}
                />
                <DashboardCard
                    val={balance}
                    label="Wallet Balance"
                    sublabel="Available substrate for project allocation."
                    href="/student/wallet"
                    icon={Wallet}
                />
                <DashboardCard
                    val="Discovery"
                    label="Find Creators"
                    sublabel="Locate top-tier domain experts for your next task."
                    href="/student/directory"
                    icon={Search}
                />
            </div>
        </section>
    )
}
