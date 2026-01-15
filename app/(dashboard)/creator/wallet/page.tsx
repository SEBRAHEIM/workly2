import { Wallet, TrendingUp, Download, ArrowUpRight, Settings, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function CreatorWallet() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        profile = data
    }

    const isConnected = !!profile?.stripe_account_id

    // Fetch recent withdrawals
    const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-[#3E4C37] mb-8">Earnings & Wallet</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Balance Card */}
                <div className="bg-[#333333] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden lg:col-span-2">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-white/60 font-medium mb-2 uppercase text-sm tracking-wider">Available Balance</p>
                            <h2 className="text-6xl font-bold mb-4">AED {profile?.wallet_balance?.toFixed(2) || '0.00'}</h2>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                href="/creator/withdrawals"
                                className="flex items-center bg-[#C6A87C] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#b0946a] transition-all shadow-lg active:scale-95"
                            >
                                <Download className="w-5 h-5 mr-3" />
                                Withdraw Funds
                            </Link>

                            {!isConnected && (
                                <Link
                                    href="/creator/wallet/connect"
                                    className="flex items-center bg-white text-[#333333] px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                                >
                                    <ArrowUpRight className="w-5 h-5 mr-3" />
                                    Set up Stripe
                                </Link>
                            )}
                        </div>
                    </div>
                    <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
                </div>

                {/* Stats */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-[#E6E2D6] shadow-sm">
                        <p className="text-gray-500 text-sm mb-2">Pending Clearance</p>
                        <h3 className="text-3xl font-bold text-[#333333]">AED 0.00</h3>
                    </div>
                    <div className="bg-white rounded-3xl p-8 border border-[#E6E2D6] shadow-sm">
                        <p className="text-gray-500 text-sm mb-2">Completed Projects</p>
                        <h3 className="text-3xl font-bold text-[#3E4C37]">{profile?.completed_projects || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Withdrawals Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#E6E2D6] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#333333]">Recent Payouts</h2>
                    <Link href="/creator/history" className="text-sm font-bold text-[#3E4C37] hover:underline">View All</Link>
                </div>

                {withdrawals && withdrawals.length > 0 ? (
                    <div className="space-y-4">
                        {withdrawals.map((w: any) => (
                            <div key={w.id} className="flex items-center justify-between p-6 rounded-2xl bg-[#F3F0E9] border border-[#E6E2D6]">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${w.status === 'pending' ? 'bg-amber-100' :
                                            w.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        <Download className={`w-6 h-6 ${w.status === 'pending' ? 'text-amber-600' :
                                                w.status === 'completed' ? 'text-green-600' : 'text-red-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#333333] capitalize">{w.method} Withdrawal</p>
                                        <p className="text-xs text-gray-500">{new Date(w.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-[#333333]">- AED {w.amount.toFixed(2)}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${w.status === 'pending' ? 'text-amber-600' :
                                            w.status === 'completed' ? 'text-green-600' : 'text-red-600'
                                        }`}>{w.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Download className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No withdrawal history yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
