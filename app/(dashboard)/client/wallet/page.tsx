import { Wallet, Plus, CreditCard } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function ClientWallet() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user?.id)
        .single()

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('client_id', user?.id)
        .eq('type', 'refund')
        .order('created_at', { ascending: false })

    const totalRefunded = transactions?.reduce((acc, t) => acc + (t.amount || 0), 0) || 0

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
                    <h1 className="text-5xl md:text-7xl font-sans font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Refund <br /> <span className="text-[#0EA5E9]">History.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 block">Total Refunded to You</span>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-2xl font-sans font-black text-sky-400">AED</span>
                                <span className="text-7xl md:text-8xl font-sans font-black tracking-tighter">
                                    {totalRefunded.toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-auto flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Status</p>
                                        <p className="text-xs font-bold uppercase tracking-widest">Active Secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Wallet className="absolute -bottom-12 -right-12 w-64 h-64 text-white/5 rotate-12 transition-transform duration-700 group-hover:rotate-0" />
                    </div>

                    <div className="bg-sky-50 rounded-[2.5rem] p-10 border border-sky-100 flex flex-col justify-center relative overflow-hidden">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notice</p>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            This space tracks all funds returned to your original payment method. Refunds are processed securely via Stripe.
                        </p>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl" />
                    </div>
                </div>

                <div className="max-w-4xl">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-sky-100" />
                        Refund Records
                    </h2>
                    <div className="space-y-8">
                        {transactions && transactions.length > 0 ? (
                            (() => {
                                const groups: { [key: string]: any[] } = {}
                                transactions.forEach((t: any) => {
                                    const date = new Date(t.created_at)
                                    const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                    if (!groups[key]) groups[key] = []
                                    groups[key].push(t)
                                })

                                return Object.entries(groups).map(([monthYear, items]) => (
                                    <div key={monthYear} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-[0.3em] whitespace-nowrap">{monthYear}</span>
                                            <div className="h-[1px] w-full bg-sky-50" />
                                        </div>
                                        <div className="space-y-4">
                                            {items.map((t: any) => (
                                                <div key={t.id} className="p-8 bg-white border border-sky-50 rounded-3xl flex items-center justify-between hover:shadow-xl hover:shadow-sky-50 transition-all duration-300">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-[#0EA5E9] border border-sky-100">
                                                            <CreditCard size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-800 uppercase tracking-tight text-base mb-1">
                                                                {t.metadata?.reason || 'Refund Processed'}
                                                            </p>
                                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">{new Date(t.created_at).toLocaleDateString()} • REF_{t.id.slice(0, 8)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Refunded</p>
                                                        <p className="font-sans font-black text-slate-900 text-xl tracking-tighter">+ AED {t.amount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            })()
                        ) : (
                            <div className="p-16 text-center bg-slate-50 border border-slate-100 rounded-3xl">
                                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">No refund history found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
