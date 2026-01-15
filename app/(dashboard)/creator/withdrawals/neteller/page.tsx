'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Wallet,
    ArrowLeft,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NetellerWithdrawalPage() {
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
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/creator/withdrawals"
                    className="flex items-center text-gray-400 hover:text-[#3E4C37] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Methods
                </Link>

                <div className="mb-10 text-center">
                    <h1 className="text-xl font-black text-[#333333] uppercase tracking-tight mb-8">Withdraw Through Neteller</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#E6E2D6] rounded-[2.5rem] p-12 text-center shadow-xl"
                >
                    <div className="mb-8 flex justify-center">
                        <div className="text-4xl font-black italic tracking-tighter text-[#81B22B]">NETELLER</div>
                    </div>

                    <div className="bg-[#F3F0E9] rounded-2xl p-8 mb-8">
                        <p className="text-gray-500 font-medium leading-relaxed">
                            You did not deposit funds using Neteller. Neteller withdrawals are only available to accounts that were previously used for deposits.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <AlertCircle className="w-12 h-12 text-gray-200" />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
