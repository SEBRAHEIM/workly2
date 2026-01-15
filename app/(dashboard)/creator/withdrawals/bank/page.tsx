'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Building2,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { requestWithdrawal } from '../../actions'

export default function BankWithdrawalPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [amount, setAmount] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const numAmount = parseFloat(amount)
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount')
            return
        }

        if (numAmount > (profile?.wallet_balance || 0)) {
            setError('Insufficient balance')
            return
        }

        if (!profile?.bank_iban || !profile?.bank_name) {
            setError('Please set up your bank details in profile first')
            return
        }

        setSubmitting(true)
        try {
            const result = await requestWithdrawal(numAmount, 'bank', {
                bank_name: profile.bank_name,
                iban: profile.bank_iban,
                account_name: profile.bank_account_name
            })

            if (result.error) {
                setError(result.error)
                return
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Failed to process withdrawal')
        } finally {
            setSubmitting(false)
        }
    }

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

                <div className="mb-10">
                    <div className="w-16 h-16 rounded-3xl bg-[#3E4C37] flex items-center justify-center mb-6 shadow-xl shadow-[#3E4C37]/20">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-serif font-black text-[#333333] uppercase tracking-tighter mb-2">
                        Bank <span className="text-[#C6A87C]">Transfer.</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Withdraw directly to your local or international bank account.</p>
                </div>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-[#E6E2D6] rounded-[2.5rem] p-12 text-center shadow-xl"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-black text-[#333333] mb-2 uppercase tracking-tight">Request Submitted!</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                Your withdrawal of <span className="font-bold text-[#333333]">AED {parseFloat(amount).toFixed(2)}</span> has been received and is being processed.
                            </p>
                            <Link
                                href="/creator/wallet"
                                className="inline-block bg-[#3E4C37] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#2e3b29] transition-all shadow-lg active:scale-95"
                            >
                                Back to Wallet
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white border border-[#E6E2D6] rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative"
                        >
                            <div className="space-y-8">
                                {/* Amount Input */}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Withdrawal Amount (AED)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-[#F3F0E9] border-none rounded-2xl px-6 py-5 text-3xl font-black text-[#3E4C37] focus:ring-2 focus:ring-[#3E4C37] transition-all placeholder:text-[#3E4C37]/20"
                                            required
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                            <button
                                                type="button"
                                                onClick={() => setAmount(profile?.wallet_balance?.toString() || '0')}
                                                className="text-[10px] font-black uppercase tracking-widest text-[#C6A87C] hover:text-[#3E4C37] transition-colors"
                                            >
                                                Use Max
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        Current Balance: <span className="text-[#3E4C37]">AED {profile?.wallet_balance?.toFixed(2) || '0.00'}</span>
                                    </p>
                                </div>

                                {/* Bank Details Preview */}
                                <div className="p-6 bg-[#F3F0E9]/50 rounded-2xl border border-[#E6E2D6]">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payout Destination</h3>
                                    {profile?.bank_iban ? (
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Bank Name</p>
                                                <p className="font-bold text-[#333333]">{profile.bank_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">IBAN</p>
                                                <p className="font-mono text-sm font-bold text-[#333333] break-all">{profile.bank_iban}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Account Holder</p>
                                                <p className="font-bold text-[#333333]">{profile.bank_account_name || profile.full_name}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/creator/profile"
                                            className="flex items-center text-red-500 hover:text-red-600 transition-colors group"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-bold">Missing Bank Details. Click to set up.</span>
                                        </Link>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center text-red-600 text-sm font-bold">
                                        <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting || !profile?.bank_iban}
                                    className="w-full bg-[#333333] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#3E4C37] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95 flex items-center justify-center"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        'Request Payout'
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
