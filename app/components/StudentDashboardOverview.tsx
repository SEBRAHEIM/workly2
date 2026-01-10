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
    color?: string
}

function DashboardCard({ val, label, sublabel, href, icon: Icon, color = "#3E4C37" }: DashboardCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group relative bg-[#F8F7F2] border border-[#E6E2D6] overflow-hidden"
        >
            <Link href={href} className="block p-8 md:p-10 h-full relative z-10 transition-all duration-700">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-[#F8F7F2] border border-[#E6E2D6] flex items-center justify-center text-[#3E4C37] group-hover:bg-[#3E4C37] group-hover:text-white transition-all shadow-sm">
                        <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#333333]/30 group-hover:text-[#3E4C37] transition-colors">
                        Protocol // 0{label.length % 5 + 1}
                    </span>
                </div>

                <div className="mb-10">
                    <h3 className="text-4xl md:text-5xl font-black font-serif text-[#3E4C37] leading-none mb-2 tracking-tighter">
                        {val}
                    </h3>
                    <p className="text-xl font-bold text-[#333333] uppercase tracking-tight">
                        {label}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                        {sublabel}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-[#3E4C37] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-xl flex items-center gap-2">
                        Initialize
                        <ArrowRight size={12} />
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                    <TrendingUp size={120} className="text-[#3E4C37] -rotate-12" />
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
        <section className="px-6 py-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#E6E2D6] border border-[#E6E2D6]">
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
                    val="Search"
                    label="Find Creators"
                    sublabel="Locate top-tier domain experts for your next task."
                    href="/student/directory"
                    icon={Search}
                />
            </div>
        </section>
    )
}
