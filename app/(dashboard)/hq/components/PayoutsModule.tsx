'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, Copy, User, CreditCard, Landmark, Wallet, Mail, ExternalLink, Calendar, AlertCircle } from 'lucide-react'
import { completeWithdrawal, rejectWithdrawal } from '../actions'
import { toast } from 'sonner'

export default function PayoutsModule({ withdrawals }: { withdrawals: any[] }) {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('pending')
    const [isProcessing, setIsProcessing] = useState<string | null>(null)

    const filteredWithdrawals = withdrawals.filter(w => {
        const creatorName = w.profiles?.display_name || w.profiles?.full_name || ''
        const creatorEmail = w.profiles?.email || ''
        const matchesSearch = creatorName.toLowerCase().includes(search.toLowerCase()) ||
            creatorEmail.toLowerCase().includes(search.toLowerCase()) ||
            w.method.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === 'all' || w.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleComplete = async (id: string, amount: number) => {
        if (!confirm(`Confirm you have sent AED ${amount} to the creator? This will notify them that the money is on the way.`)) return

        setIsProcessing(id)
        try {
            await completeWithdrawal(id)
            toast.success('Payout marked as complete. Creator will see "Money on the way".')
        } catch (error: any) {
            toast.error(error.message || 'Failed to complete payout')
        } finally {
            setIsProcessing(null)
        }
    }

    const handleReject = async (id: string) => {
        const reason = prompt('Please enter the reason for rejection (this will be sent to the creator):')
        if (!reason) return

        setIsProcessing(id)
        try {
            await rejectWithdrawal(id, reason)
            toast.success('Payout request rejected and funds returned')
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject payout')
        } finally {
            setIsProcessing(null)
        }
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.info(`${label} copied to clipboard`)
    }

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'bank': return <Landmark className="w-4 h-4" />
            case 'card': return <CreditCard className="w-4 h-4" />
            case 'skrill': return <Wallet className="w-4 h-4" />
            case 'neteller': return <Wallet className="w-4 h-4" />
            case 'paypal': return <Mail className="w-4 h-4" />
            default: return <Wallet className="w-4 h-4" />
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">Payout Requests</h2>
                    <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Manage creator withdrawals</p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <div className="px-4 py-2 text-center">
                        <div className="text-[8px] text-gray-500 uppercase font-black mb-1">Pending</div>
                        <div className="text-xl font-black text-orange-500">
                            AED {withdrawals.filter(w => w.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by creator name, email or method..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'completed', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusFilter === status
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-gray-500 border-white/5 hover:border-white/20'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Creator</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Method</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Amount</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Destination Details</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Requested</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {filteredWithdrawals.map((w) => (
                            <tr key={w.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">
                                                {w.profiles?.display_name || w.profiles?.full_name || 'Unknown'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                <Mail className="w-3 h-3" /> {w.profiles?.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1.5 bg-white/5 rounded-lg text-gray-400">
                                            {getMethodIcon(w.method)}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                            {w.method}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-white font-black">
                                        AED {w.amount.toLocaleString()}
                                    </div>
                                    <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                        Total Earnings
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 group/copy">
                                        <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl flex items-center gap-3">
                                            <span className="text-xs font-mono text-gray-300 max-w-[150px] truncate">
                                                {w.details?.payout_to || 'N/A'}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(w.details?.payout_to || '', 'Payout details')}
                                                className="p-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all shadow-inner"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        {w.method === 'bank' && (
                                            <div className="text-[8px] text-gray-500 font-bold uppercase vertical-text">
                                                {w.details?.bank_name}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-gray-500 text-[10px] font-medium">
                                    <span className="flex items-center gap-1 font-mono tracking-tighter">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(w.created_at).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    {w.status === 'pending' ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                disabled={isProcessing === w.id}
                                                onClick={() => handleReject(w.id)}
                                                className="p-3 hover:bg-red-500/10 rounded-2xl text-gray-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20 group/reject"
                                                title="Reject Request"
                                            >
                                                <XCircle className="w-5 h-5 group-hover/reject:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                disabled={isProcessing === w.id}
                                                onClick={() => handleComplete(w.id, w.amount)}
                                                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all"
                                            >
                                                {isProcessing === w.id ? '...' : <><CheckCircle className="w-4 h-4" /> Mark as Sent</>}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${w.status === 'completed'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {w.status}
                                            </span>
                                            {w.status === 'rejected' && w.details?.rejection_reason && (
                                                <div className="group relative">
                                                    <AlertCircle className="w-4 h-4 text-gray-500 cursor-help" />
                                                    <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-900 border border-white/10 rounded-xl text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        {w.details.rejection_reason}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredWithdrawals.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-serif font-black text-white uppercase italic tracking-tighter">No requests found</h3>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">All quiet in the financial sector</p>
                    </div>
                )}
            </div>
        </div>
    )
}
