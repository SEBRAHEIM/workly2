'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Building2,
    CreditCard,
    Wallet,
    ArrowRight,
    Info,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const methods = [
    {
        id: 'bank',
        title: 'Bank/Local Bank Transfer',
        icon: Building2,
        href: '/creator/withdrawals/bank',
        description: 'Direct transfer to your local or international bank account.'
    },
    {
        id: 'skrill',
        title: 'Skrill',
        icon: Wallet,
        href: '/creator/withdrawals/skrill',
        description: 'Fast and secure digital wallet withdrawals via Skrill.'
    },
    {
        id: 'neteller',
        title: 'Neteller',
        icon: Wallet,
        href: '/creator/withdrawals/neteller',
        description: 'Instant payouts to your Neteller account.'
    },
    {
        id: 'card',
        title: 'Card',
        icon: CreditCard,
        href: '/creator/withdrawals/card',
        description: 'Withdraw directly to your saved Visa or Mastercard.'
    }
]

export default function WithdrawalsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [supabase])

    if (loading) return null

    return (
        <div className="min-h-screen bg-[#F3F0E9] p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/creator/wallet"
                    className="flex items-center text-gray-400 hover:text-[#3E4C37] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Wallet
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-black text-[#3E4C37] uppercase tracking-tighter mb-2">
                        Withdraw <span className="text-[#C6A87C]">Funds.</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Select your preferred withdrawal method below.</p>
                </div>

                {/* Balance Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#333333] rounded-[2rem] p-8 text-white mb-10 shadow-xl relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Available to Withdraw</p>
                        <h2 className="text-5xl font-black tracking-tighter">AED {profile?.wallet_balance?.toFixed(2) || '0.00'}</h2>
                    </div>
                </motion.div>

                {/* Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {methods.map((method, idx) => (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                href={method.href}
                                className="block h-full bg-white border border-[#E6E2D6] rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-[#F3F0E9] flex items-center justify-center border border-[#E6E2D6] group-hover:bg-[#3E4C37] group-hover:border-[#3E4C37] transition-colors">
                                            <method.icon className="w-6 h-6 text-[#3E4C37] group-hover:text-white transition-colors" />
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#3E4C37] group-hover:translate-x-1 transition-all" />
                                    </div>

                                    <h3 className="text-xl font-black text-[#333333] uppercase tracking-tighter mb-2">
                                        {method.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        {method.description}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Info Note */}
                <div className="mt-12 p-6 rounded-2xl bg-[#E6E2D6]/30 border border-[#E6E2D6] flex gap-4">
                    <Info className="w-5 h-5 text-[#3E4C37] shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Funds are released to your selected method after verification. Standard processing time is 1-3 business days. Some methods may require prior deposit history.
                    </p>
                </div>
            </div>
        </div>
    )
}
