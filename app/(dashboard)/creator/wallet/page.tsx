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

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-[#3E4C37] mb-8">Earnings & Wallet</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Balance Card */}
                <div className="bg-[#333333] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden lg:col-span-2">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-white/60 font-medium mb-2 uppercase text-sm tracking-wider">Available Balance</p>
                            <h2 className="text-6xl font-bold mb-4">AED {profile?.wallet_balance?.toFixed(2) || '0.00'}</h2>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            {isConnected ? (
                                <button className="flex items-center bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-400 transition-colors shadow-lg shadow-green-900/20">
                                    <Check className="w-5 h-5 mr-2" />
                                    Payouts Active
                                </button>
                            ) : (
                                <Link
                                    href="/creator/wallet/connect"
                                    className="flex items-center bg-white text-[#333333] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    <ArrowUpRight className="w-5 h-5 mr-2" />
                                    Set up Payouts
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
        </div>
    )
}
