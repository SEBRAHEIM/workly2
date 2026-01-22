import { Wallet, Plus, CreditCard } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function StudentWallet() {
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
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3)

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif font-bold text-[#3E4C37]">Wallet</h1>
                <button className="flex items-center bg-[#333333] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#3E4C37] rounded-3xl p-8 text-white shadow-lg md:col-span-2 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-white/60 font-medium mb-1 uppercase text-sm tracking-wider">Total Balance</p>
                        <h2 className="text-4xl font-bold mb-8">AED {profile?.wallet_balance?.toFixed(2) || '0.00'}</h2>
                        <div className="flex space-x-4">
                            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <span className="text-xs text-white/60 block">Account Status</span>
                                <span className="font-medium text-sm">Active</span>
                            </div>
                        </div>
                    </div>
                    <Wallet className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 rotate-12" />
                </div>

                <div className="bg-white rounded-3xl p-8 border border-[#E6E2D6] shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-gray-500 text-sm mb-2">Monthly Spending</p>
                    <h3 className="text-2xl font-bold text-[#333333] mb-1">AED 0.00</h3>
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+0% from last month</span>
                </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-[#333333] mb-4">Recent Usage</h2>
            <div className="bg-white rounded-3xl border border-[#E6E2D6] shadow-sm divide-y divide-[#E6E2D6]">
                {transactions && transactions.length > 0 ? (
                    transactions.map((t: any) => (
                        <div key={t.id} className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#3E4C37]">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#333333]">{t.metadata?.project_title || 'Payment'}</p>
                                    <p className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="font-black text-[#333333]">- AED {t.amount.toFixed(2)}</p>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">No recent transactions</div>
                )}
            </div>
        </div>
    )
}
