import { Wallet, TrendingUp, Download, ArrowUpRight, Settings, Check, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import WithdrawButton from './WithdrawButton'

export default async function CreatorWallet() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        profile = data
    }

    const hasBank = !!profile?.bank_iban
    const hasPayPal = !!profile?.paypal_email

    // Fetch recent withdrawals
    const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // Fetch pending transactions and escrowed projects for "Pending Clearance"
    const [txResponse, projectsResponse] = await Promise.all([
        supabase
            .from('transactions')
            .select('creator_net_amount')
            .eq('creator_id', user?.id)
            .eq('status', 'pending'),
        supabase
            .from('projects')
            .select('current_price, net_earnings')
            .eq('creator_id', user?.id)
            .in('funds_status', ['escrow', 'pending', 'unpaid', 'requested'])
            .in('status', ['accepted', 'in_progress', 'submitted', 'revision_requested', 'completed'])
    ])

    const pendingTxAmount = txResponse.data?.reduce((acc, tx) => acc + Number(tx.creator_net_amount), 0) || 0
    // If net_earnings column isn't populated yet, fallback to 80% of current_price
    const pendingProjectAmount = projectsResponse.data?.reduce((acc, p) => {
        const net = p.net_earnings ? Number(p.net_earnings) : (Number(p.current_price) * 0.8)
        return acc + net
    }, 0) || 0

    const pendingClearance = pendingTxAmount + pendingProjectAmount

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <h1 className="text-5xl md:text-7xl font-sans font-black font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                        Treasury & <br /> <span className="text-[#0EA5E9]">Payouts.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Balance Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 lg:col-span-2 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col h-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 block">Liquid Balance</span>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-2xl font-sans font-black font-bold text-sky-400">AED</span>
                                <span className="text-7xl md:text-8xl font-sans font-black font-black tracking-tighter transition-transform duration-700 group-hover:scale-105 inline-block">
                                    {profile?.wallet_balance?.toFixed(2) || '0.00'}
                                </span>
                            </div>

                            <div className="mt-auto flex flex-wrap gap-4">
                                <WithdrawButton
                                    hasBank={hasBank}
                                    hasPayPal={hasPayPal}
                                    balance={profile?.wallet_balance || 0}
                                    payoutPreference={profile?.payout_preference}
                                />
                            </div>
                        </div>
                        <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
                    </div>

                    {/* Stats */}
                    <div className="space-y-6 flex flex-col justify-center">
                        <div className="bg-sky-50 rounded-[2rem] p-8 border border-sky-100 relative overflow-hidden group">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Clearance</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-[#0EA5E9]">AED</span>
                                <h3 className="text-3xl font-black text-slate-800">{pendingClearance.toFixed(2)}</h3>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-sky-50 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-sky-50 transition-all">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completed Pipeline</p>
                            <h3 className="text-3xl font-black text-slate-800">{profile?.completed_projects || 0}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-emerald-500">Optimized Performance</p>
                        </div>
                    </div>
                </div>

                {/* Recent Withdrawals Section */}
                <div className="max-w-4xl">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                            <div className="w-12 h-[1px] bg-sky-100" />
                            Recent Settlements
                        </h2>
                        <Link href="/creator/history" className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-widest hover:underline">Full History Archive</Link>
                    </div>

                    {withdrawals && withdrawals.length > 0 ? (
                        <div className="space-y-4">
                            {withdrawals.map((w: any) => (
                                <div key={w.id} className="flex items-center justify-between p-8 bg-white border border-sky-50 rounded-[2rem] hover:shadow-xl hover:shadow-sky-50 transition-all duration-300">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${w.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-500' :
                                            w.status === 'completed' ? 'bg-sky-50 border-sky-100 text-[#0EA5E9]' : 'bg-red-50 border-red-100 text-red-500'
                                            }`}>
                                            <Download size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 uppercase tracking-tight text-base mb-1">{w.method} Settlement</p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">{new Date(w.created_at).toLocaleDateString()} • REF_{w.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="mb-2">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Debit</p>
                                            <p className="font-sans font-black font-black text-slate-900 text-xl tracking-tighter">- AED {w.amount.toFixed(2)}</p>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${w.status === 'pending' ? 'bg-amber-50/50 border-amber-100 text-amber-600' :
                                            w.status === 'completed' ? 'bg-sky-50/50 border-sky-100 text-sky-600' : 'bg-red-50/50 border-red-100 text-red-600'
                                            }`}>
                                            {w.status === 'pending' ? 'pending (3-7 days)' :
                                                w.status === 'completed' ? 'money on the way' :
                                                    w.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                            <Download className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No historical activity</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
