'use client'

import { Shield, TrendingUp, Users, Briefcase, Activity, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function OverviewModule({ projects, profiles, stats }: { projects: any[], profiles: any[], stats: any }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">System Health</h2>
                    <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Real-time platform overview</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Systems Online</span>
                </div>
            </div>

            {/* Top Row: Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Total Users"
                    value={stats.totalUsers.toString()}
                    icon={Users}
                    sub="Cumulative registrations"
                    trend="+12% this week"
                />
                <StatCard
                    label="Platform Revenue"
                    value={`AED ${stats.totalRevenue.toFixed(2)}`}
                    icon={TrendingUp}
                    sub="Fee accumulation (17%)"
                    color="text-green-500"
                />
                <StatCard
                    label="Active Projects"
                    value={stats.activeProjects.toString()}
                    icon={Briefcase}
                    sub="Current negotiations/work"
                    color="text-purple-500"
                />
                <StatCard
                    label="Escrow Held"
                    value={`AED ${stats.escrowHeld.toFixed(2)}`}
                    icon={Shield}
                    sub="Locked in system"
                    color="text-blue-500"
                />
            </div>

            {/* Two Column Layout for Alerts and Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Critical Alerts */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Needs Attention
                    </h3>
                    <div className="space-y-4">
                        <AlertItem
                            label="Pending Payouts"
                            count={profiles.filter((p: any) => p.wallet_balance > 100).length}
                            description="Creators waiting for withdrawal"
                            severity="high"
                        />
                        <AlertItem
                            label="Flagged Projects"
                            count={0}
                            description="Reports of TOS violations"
                            severity="medium"
                        />
                        <AlertItem
                            label="Verification Queue"
                            count={profiles.filter((p: any) => p.role === 'creator' && !p.specialization).length}
                            description="New creators pending setup"
                            severity="low"
                        />
                    </div>
                </div>

                {/* Activity Feed / Pulse */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Live Pulse
                    </h3>
                    <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Event</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Entity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.slice(0, 6).map((project) => (
                                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                                                <span className="font-bold text-gray-300">Project Update</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-500 truncate block max-w-[200px]">{project.title}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-600 text-[10px]">
                                            {isMounted ? new Date(project.created_at).toLocaleTimeString() : '...'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon: Icon, sub, trend, color = "text-white" }: any) {
    return (
        <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</h3>
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
            </div>
            <p className={`text-2xl font-black ${color} tracking-tight`}>{value}</p>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-600 font-medium">{sub}</span>
                {trend && <span className="text-[10px] text-green-500 font-black">{trend}</span>}
            </div>
        </div>
    )
}

function AlertItem({ label, count, description, severity }: any) {
    const colors = {
        high: 'border-red-500/50 bg-red-500/5 text-red-500',
        medium: 'border-yellow-500/50 bg-yellow-500/5 text-yellow-500',
        low: 'border-blue-500/50 bg-blue-500/5 text-blue-500'
    }

    return (
        <div className={`p-5 rounded-2xl border ${colors[severity as keyof typeof colors]} flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all`}>
            <div>
                <h4 className="font-bold text-sm tracking-wide">{label}</h4>
                <p className="text-[10px] opacity-70 mt-1">{description}</p>
            </div>
            <div className="text-xl font-black">{count}</div>
        </div>
    )
}
