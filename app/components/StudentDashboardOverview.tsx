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
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group relative bg-white border border-slate-200 hover:border-[#0EA5E9] hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
        >
            <Link href={href} className="block p-6 h-full relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#0EA5E9]/10 group-hover:text-[#0EA5E9] transition-all duration-300 rounded-xl">
                        <Icon size={20} />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">
                        {val}
                    </h3>
                    <p className="text-sm font-semibold text-[#0EA5E9] mb-2">
                        {label}
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">
                        {sublabel}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-[#0EA5E9] text-xs font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Get Started
                        <ArrowRight size={12} />
                    </div>
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
        <section className="px-4 md:px-6 py-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
