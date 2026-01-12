'use client'

import { Wallet, ArrowDownCircle, ArrowUpCircle, Shield, TrendingUp, Download, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FinancesModule({ projects, stats }: { projects: any[], stats: any }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const revenueDistribution = [
        { label: 'Marketplace Fees', percentage: 17, value: stats.totalRevenue || 0 },
        { label: 'Creator Earnings', percentage: 80, value: projects?.filter(p => p.status === 'completed').reduce((acc, p) => acc + ((p.current_price || 0) * 0.83), 0) || 0 },
        { label: 'Processing Fees', percentage: 3, value: (stats.totalRevenue || 0) * 0.15 }
    ]

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">Platform Economics</h2>
                    <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Revenue flow and treasury management</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ledger Summary */}
                <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full -mr-20 -mt-20" />

                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-10 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Global Ledger
                    </h3>

                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
                                <ArrowDownCircle className="w-4 h-4" /> Funds in Escrow
                            </div>
                            <div className="text-5xl font-black text-white tracking-tighter">AED {(stats.escrowHeld || 0).toFixed(2)}</div>
                            <p className="text-[10px] text-gray-600 mt-4 leading-relaxed max-w-[200px]">
                                Secured capital currently held for active project fulfillment.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">
                                <TrendingUp className="w-4 h-4" /> Total Platform Fee
                            </div>
                            <div className="text-5xl font-black text-green-500 tracking-tighter">AED {(stats.totalRevenue || 0).toFixed(2)}</div>
                            <p className="text-[10px] text-gray-600 mt-4 leading-relaxed max-w-[200px]">
                                Realized net revenue across all completed marketplace transactions.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-3 gap-8">
                        {revenueDistribution.map((item) => (
                            <div key={item.label}>
                                <div className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-1">{item.label} ({item.percentage}%)</div>
                                <div className="text-lg font-bold text-gray-300">AED {(item.value || 0).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payout Queue */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-2">
                        <ArrowUpCircle className="w-4 h-4 text-orange-500" /> Withdrawal Queue
                    </h3>

                    <div className="flex-1 space-y-4">
                        <p className="text-[10px] text-gray-500 italic mb-6">Pending bank transfers for creators with {'>'}AED 200 balance.</p>

                        <div className="py-12 text-center text-gray-600 border-2 border-dashed border-white/5 rounded-3xl">
                            <Wallet className="w-8 h-8 mx-auto mb-4 opacity-10" />
                            <span className="text-[10px] font-black uppercase tracking-widest">No pending payouts</span>
                        </div>
                    </div>

                    <button className="w-full mt-8 py-4 bg-orange-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-700 transition-all shadow-lg">
                        Execute Payout Run
                    </button>
                </div>
            </div>

            {/* Recent Transaction History (Mini) */}
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Recent Settlements</h3>
                    <span className="text-[10px] text-gray-500 font-mono">Real-time settlement data</span>
                </div>
                <div className="divide-y divide-white/5">
                    {projects?.filter(p => p.status === 'completed').slice(0, 5).map(p => (
                        <div key={p.id} className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm tracking-wide">Project Settlement</div>
                                    <div className="text-[9px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">PID: {p.id.slice(0, 12)}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-white">+AED {((p.current_price || 0) * 0.17).toFixed(2)}</div>
                                <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-1">Platform Fee (17%)</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
