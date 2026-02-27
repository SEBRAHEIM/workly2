'use client'

import { Wallet, ArrowDownCircle, ArrowUpCircle, Shield, TrendingUp, Download, ExternalLink, Calculator, DollarSign, User, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState, useEffect, useTransition } from 'react'
import { calculateSplit, createPayoutBatch, markBatchPaid } from '../finance_actions'
import { toast } from 'sonner'

export default function FinancesModule({ projects, stats, withdrawals = [], transactions = [], payoutBatches = [] }: { projects: any[], stats: any, withdrawals?: any[], transactions?: any[], payoutBatches?: any[] }) {
    const [isMounted, setIsMounted] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Payout Calculator State
    const [calcAmount, setCalcAmount] = useState<string>('200')
    const [splitPreview, setSplitPreview] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true)
        updateSplit(200)
    }, [])

    const updateSplit = async (val: number) => {
        const split = await calculateSplit(val)
        setSplitPreview(split)
    }

    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending')

    // Aggregate Pending Payouts per Creator
    const pendingTransactions = transactions.filter(t => t.status === 'pending')
    const creatorAggregates = pendingTransactions.reduce((acc: any, tx: any) => {
        const cid = tx.creator_id
        if (!acc[cid]) {
            acc[cid] = {
                creator: tx.creator,
                txIds: [],
                gross: 0,
                workly: 0,
                stripe: 0,
                net: 0
            }
        }
        acc[cid].txIds.push(tx.id)
        acc[cid].gross += Number(tx.gross_amount)
        acc[cid].workly += Number(tx.workly_fee_amount)
        acc[cid].stripe += Number(tx.stripe_fee_amount)
        acc[cid].net += Number(tx.creator_net_amount)
        return acc
    }, {})

    const handleCreateBatch = (creatorId: string, txIds: string[]) => {
        if (!confirm('Create a payout batch for this creator?')) return
        startTransition(async () => {
            try {
                await createPayoutBatch(creatorId, txIds)
                toast.success('Payout batch created')
            } catch (err) {
                toast.error('Failed to create batch')
            }
        })
    }

    const handleMarkPaid = (batchId: string) => {
        if (!confirm('Mark this batch as paid? This will update all associated transactions.')) return
        startTransition(async () => {
            try {
                await markBatchPaid(batchId)
                toast.success('Batch marked as paid')
            } catch (err) {
                toast.error('Failed to update batch')
            }
        })
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-sans font-black font-black text-white tracking-tight uppercase">Platform Economics</h2>
                    <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Revenue flow and treasury management</p>
                </div>
                <button className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">
                    <Download className="w-4 h-4" /> Export Ledger
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Ledger Summary */}
                <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-[2.5rem] p-6 md:p-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full -mr-20 -mt-20" />

                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-10 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Treasury Overview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
                                <ArrowDownCircle className="w-4 h-4" /> In Escrow
                            </div>
                            <div className="text-5xl font-black text-white tracking-tighter">AED {(stats.escrowHeld || 0).toFixed(2)}</div>
                            <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">
                                Secured capital currently held for active project fulfillment.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">
                                <TrendingUp className="w-4 h-4" /> Total Realized Revenue
                            </div>
                            <div className="text-5xl font-black text-green-500 tracking-tighter">AED {(stats.totalRevenue || 0).toFixed(2)}</div>
                            <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">
                                Net platform fees across all settled transactions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Payout Calculator */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8 flex items-center gap-2">
                        <Calculator className="w-4 h-4" /> Payout Calculator
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Gross Amount (AED)</label>
                            <input
                                type="number"
                                value={calcAmount}
                                onChange={(e) => {
                                    setCalcAmount(e.target.value)
                                    updateSplit(Number(e.target.value))
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        {splitPreview && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest">Creator Net (80%)</span>
                                    <span className="text-orange-500 font-black">AED {splitPreview.creatorNet.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest">Workly Fee (17%)</span>
                                    <span className="text-white font-black">AED {splitPreview.worklyFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest">Stripe Fee (2.9%+1)</span>
                                    <span className="text-white font-black">AED {splitPreview.stripeFee.toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t border-white/5">
                                    <p className="text-[9px] text-gray-600 italic">
                                        Creator receives {splitPreview.creatorNet}, Workly keeps {splitPreview.worklyFee}, Stripe takes {splitPreview.stripeFee} from gross {splitPreview.gross}.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Payout Batches & Settlements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Per-Creator Dues */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-6 md:p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 flex justify-between items-center">
                        <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> Pending Settlements</span>
                        <span className="text-gray-500">{Object.keys(creatorAggregates).length} Creators</span>
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                        {Object.values(creatorAggregates).map((item: any) => (
                            <div key={item.creator.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-emerald-500/20 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{item.creator.display_name || item.creator.full_name}</div>
                                            <div className="text-[10px] text-gray-500 font-mono">{item.creator.email}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Net Due</div>
                                        <div className="text-2xl font-black text-emerald-500">AED {item.net.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <div className="text-[8px] text-gray-600 font-black uppercase mb-1">Gross (x{item.txIds.length})</div>
                                        <div className="text-xs font-bold text-gray-300">AED {item.gross.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <div className="text-[8px] text-gray-600 font-black uppercase mb-1">Fees</div>
                                        <div className="text-xs font-bold text-gray-300 text-red-500/70">AED {(item.workly + item.stripe).toFixed(2)}</div>
                                    </div>
                                    <div className="bg-emerald-500/5 rounded-xl p-3 text-center border border-emerald-500/10">
                                        <div className="text-[8px] text-emerald-500/70 font-black uppercase mb-1">Net Payout</div>
                                        <div className="text-xs font-bold text-emerald-500">AED {item.net.toFixed(2)}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCreateBatch(item.creator.id, item.txIds)}
                                    disabled={isPending}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    Generate Payout Batch
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payout Batches */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-6 md:p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" /> Payout Audit Logs
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                        {payoutBatches.map((batch: any) => (
                            <div key={batch.id} className="p-5 border border-white/5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Batch Batch Ref</div>
                                        <div className="text-sm font-bold text-white uppercase">{batch.id.split('-')[0]}</div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${batch.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                        }`}>
                                        {batch.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <span className="text-[8px] text-gray-600 font-bold block mb-1">PAYOUT TOTAL</span>
                                        <span className="text-lg font-black text-white">AED {batch.total_creator_net.toFixed(2)}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] text-gray-600 font-bold block mb-1">DATE CREATED</span>
                                        <span className="text-sm font-medium text-gray-400">{new Date(batch.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {batch.status === 'draft' && (
                                    <button
                                        onClick={() => handleMarkPaid(batch.id)}
                                        disabled={isPending}
                                        className="w-full py-2 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Mark as Paid
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Global Ledger (Audit Trail) */}
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Global Ledger Audit</h3>
                    <div className="flex gap-4">
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Traceable
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Immutable
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">Order / Project</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">Creator</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">Gross</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 text-red-500/70">Fees</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 text-emerald-500">Net Due</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {transactions.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-white mb-1">{tx.project?.title || 'Unknown Project'}</div>
                                        <div className="text-[9px] text-gray-500 font-mono uppercase tracking-tighter">REF: {tx.id.split('-')[0]}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-medium text-gray-300">{tx.creator?.display_name || 'Creator'}</div>
                                        <div className="text-[9px] text-gray-500 font-mono">{tx.creator?.email}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-white">AED {Number(tx.gross_amount).toFixed(2)}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="text-[9px] text-gray-500 flex justify-between">
                                                <span>Workly:</span>
                                                <span className="font-bold">AED {Number(tx.workly_fee_amount).toFixed(2)}</span>
                                            </div>
                                            <div className="text-[9px] text-gray-500 flex justify-between">
                                                <span>Stripe:</span>
                                                <span className="font-bold">AED {Number(tx.stripe_fee_amount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-emerald-500">AED {Number(tx.creator_net_amount).toFixed(2)}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-dashed ${tx.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
