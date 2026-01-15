'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    CreditCard,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Check
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { requestWithdrawal } from '../../actions'

const savedCards = [
    { id: 'card_1', brand: 'VISA', last4: '4476', bin: '456835' },
    { id: 'card_2', brand: 'VISA', last4: '9508', bin: '433367' },
    { id: 'card_3', brand: 'VISA', last4: '9508', bin: '433367' },
    { id: 'card_4', brand: 'VISA', last4: '9054', bin: '433367' },
]

export default function CardWithdrawalPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [amount, setAmount] = useState('')
    const [selectedCard, setSelectedCard] = useState('card_2')
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

        setSubmitting(true)
        try {
            const card = savedCards.find(c => c.id === selectedCard)
            const result = await requestWithdrawal(numAmount, 'card', {
                card_brand: card?.brand,
                card_last4: card?.last4
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

                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="flex gap-4 mb-8">
                        <div className="bg-white px-6 py-3 rounded-xl border border-[#E6E2D6] shadow-sm">
                            <span className="text-blue-800 font-bold italic text-xl">VISA</span>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-xl border border-[#E6E2D6] shadow-sm flex items-center">
                            <span className="text-red-600 font-bold text-lg mr-1">mastercard</span>
                            <div className="flex -space-x-2">
                                <div className="w-4 h-4 rounded-full bg-red-500 opacity-80" />
                                <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-80" />
                            </div>
                        </div>
                    </div>
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
                                Your withdrawal of <span className="font-bold text-[#333333]">AED {parseFloat(amount).toFixed(2)}</span> to your card has been received.
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
                            className="space-y-6"
                        >
                            <div className="bg-white border border-[#E6E2D6] rounded-[2rem] p-8 shadow-xl">
                                {/* Amount Input */}
                                <div className="mb-8">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Withdrawal Amount</label>
                                    <div className="flex items-center gap-4 bg-[#F3F0E9] rounded-2xl px-6 py-4 border border-[#E6E2D6]">
                                        <select className="bg-transparent border-none font-black text-[#333333] focus:ring-0">
                                            <option>AED</option>
                                            <option>USD</option>
                                        </select>
                                        <div className="h-8 w-[1px] bg-gray-300" />
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-transparent border-none text-2xl font-black text-[#3E4C37] focus:ring-0 placeholder:text-[#3E4C37]/20"
                                            required
                                        />
                                    </div>
                                    <p className="mt-3 text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider">
                                        Current Balance: <span className="text-[#3E4C37]">AED {profile?.wallet_balance?.toFixed(2) || '0.00'}</span>
                                    </p>
                                </div>

                                {/* Card Selection */}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select a Card</label>
                                    <div className="space-y-3">
                                        {savedCards.map((card) => (
                                            <button
                                                key={card.id}
                                                type="button"
                                                onClick={() => setSelectedCard(card.id)}
                                                className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${selectedCard === card.id
                                                    ? 'border-[#3E4C37] bg-[#F3F0E9] shadow-md'
                                                    : 'border-[#E6E2D6] bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-blue-800 font-black italic text-sm">{card.brand}</span>
                                                    <span className="text-gray-600 font-bold tracking-widest">{card.bin}******{card.last4}</span>
                                                </div>
                                                {selectedCard === card.id && (
                                                    <Check className="w-5 h-5 text-green-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center text-red-600 text-sm font-bold">
                                        <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full mt-8 bg-[#333333] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#3E4C37] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95 flex items-center justify-center"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        'Request Withdrawal'
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
