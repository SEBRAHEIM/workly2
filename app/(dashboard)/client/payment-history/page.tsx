'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Download, Clock, Receipt } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import PaymentReceiptModal from '@/app/components/PaymentReceiptModal'

export default function PaymentHistory() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<any[]>([])
    const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null)
    const [userProfile, setUserProfile] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch user profile for receipt
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, username')
                .eq('id', user.id)
                .single()

            setUserProfile({ ...profile, email: user.email })

            // Fetch both transactions and projects with funds (projects as real-time bridge)
            const [transRes, projectsRes] = await Promise.all([
                supabase
                    .from('transactions')
                    .select('*')
                    .eq('client_id', user.id)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('projects')
                    .select('*, creator:creator_id(full_name)')
                    .eq('client_id', user.id)
                    .or('funds_status.in.(escrow,released),and(funds_status.eq.pending,status.in.(accepted,in_progress,submitted,completed))')
                    .order('created_at', { ascending: false })
            ])

            const mergedMap = new Map()

            // First add projects (ensures visibility even if webhook is slow)
            projectsRes.data?.forEach(p => {
                const isPaid = ['escrow', 'released'].includes(p.funds_status)
                mergedMap.set(p.id, {
                    id: p.id,
                    project_id: p.id,
                    amount: p.current_price || 0,
                    status: isPaid ? 'completed' : 'processing',
                    created_at: p.updated_at || p.created_at,
                    project_title: p.title,
                    creator_name: p.creator?.full_name || 'Workly Creator',
                    is_project_fallback: true,
                    stripe_session_id: p.payment_intent_id || 'PENDING_VERIFICATION'
                })
            })

            // Then overwrite with absolute source-of-truth transactions
            transRes.data?.forEach(t => {
                const existing = mergedMap.get(t.project_id || t.id)
                mergedMap.set(t.project_id || t.id, {
                    ...t,
                    project_title: t.metadata?.project_title || existing?.project_title || 'Project Payment',
                    creator_name: existing?.creator_name || 'Workly Creator',
                    is_project_fallback: false
                })
            })

            const sorted = Array.from(mergedMap.values()).sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )

            setTransactions(sorted)
            setLoading(false)
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto animate-pulse">
                <div className="h-10 w-64 bg-slate-100 rounded-lg mb-6" />
                <div className="bg-white rounded-3xl h-96 border border-[#F0F9FF]" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-[#0EA5E9] mb-2">Payment History</h1>
            <p className="text-gray-400 font-medium mb-8 text-sm">Official logs of all secure escrow payments.</p>

            <div className="bg-white rounded-3xl border border-[#F0F9FF] shadow-xl shadow-sky-900/5 overflow-hidden">
                <div className="p-6 border-b border-[#F0F9FF] flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-[#1E293B] uppercase tracking-widest text-[10px]">Payment Ledger</h2>
                    <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] hover:text-[#0284c7] transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Export All
                    </button>
                </div>

                <div className="divide-y divide-[#F0F9FF]">
                    {transactions.length > 0 ? (
                        (() => {
                            const groups: { [key: string]: any[] } = {}
                            transactions.forEach(t => {
                                const date = new Date(t.created_at)
                                const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                if (!groups[key]) groups[key] = []
                                groups[key].push(t)
                            })

                            return Object.entries(groups).map(([monthYear, items]) => (
                                <div key={monthYear} className="animate-in fade-in duration-500">
                                    <div className="px-8 py-4 bg-gray-50/50 border-y border-[#F0F9FF]">
                                        <h3 className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-[0.3em]">{monthYear}</h3>
                                    </div>
                                    <div className="divide-y divide-[#F0F9FF]">
                                        {items.map((t) => (
                                            <div key={t.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-sky-50/30 transition-all duration-200 group relative border-l-4 border-transparent hover:border-[#0EA5E9]">
                                                <div className="flex items-center gap-5 mb-4 md:mb-0">
                                                    <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-[#0EA5E9] border border-sky-100 group-hover:bg-[#0EA5E9] group-hover:text-white transition-all shrink-0">
                                                        <CreditCard className="w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-lg text-[#1E293B] capitalize mb-0.5 truncate max-w-[200px] md:max-w-md" dir="auto">
                                                            {t.project_title}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <span className="flex items-center text-[#0EA5E9]">
                                                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                                {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                <span className="mx-2 opacity-30">|</span>
                                                                {new Date(t.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0">
                                                    <div className="text-left md:text-right">
                                                        <p className="font-serif font-black text-2xl text-[#1E293B]">AED {t.amount.toFixed(2)}</p>
                                                        <div className={`flex items-center md:justify-end gap-1.5 text-[9px] font-black uppercase tracking-widest mt-0.5 ${t.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'completed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500 animate-pulse'}`} />
                                                            {t.status === 'completed' ? 'Verified Payment' : 'Processing Ledger'}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setSelectedReceipt(t)}
                                                        className="md:mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#0EA5E9] hover:shadow-lg hover:shadow-sky-200 transition-all flex items-center gap-2 group/btn"
                                                    >
                                                        <Receipt className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                                        Get Receipt
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        })()
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <CreditCard className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#1E293B] mb-2">No payment history yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto text-sm">Once you pay for your first project, it will show up here with a detailed receipt.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedReceipt && (
                <PaymentReceiptModal
                    showReceipt={true}
                    projectName={selectedReceipt.project_title}
                    amount={selectedReceipt.amount}
                    date={new Date(selectedReceipt.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                    transactionId={selectedReceipt.stripe_session_id || 'LOCAL-SYNC'}
                    clientName={userProfile?.full_name}
                    clientEmail={userProfile?.email}
                    creatorName={selectedReceipt.creator_name}
                    onClose={() => setSelectedReceipt(null)}
                />
            )}
        </div>
    )
}
