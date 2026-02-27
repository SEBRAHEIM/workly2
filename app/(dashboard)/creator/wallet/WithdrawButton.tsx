'use client'

import { Download, Loader2, Landmark, CheckCircle2, Send } from 'lucide-react'
import { requestManualPayout, requestPayPalPayout } from '../actions'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function WithdrawButton({
    hasBank,
    hasPayPal,
    balance,
    payoutPreference
}: {
    hasBank: boolean,
    hasPayPal: boolean,
    balance: number,
    payoutPreference?: 'bank' | 'paypal'
}) {
    const [withdrawAmount, setWithdrawAmount] = useState(balance)
    const [isPending, setIsPending] = useState(false)
    const [showSelection, setShowSelection] = useState(false)
    const router = useRouter()

    const handleWithdraw = async (method: 'bank' | 'paypal') => {
        const amount = Number(withdrawAmount)
        if (amount <= 0 || amount > balance) {
            toast.error('Invalid withdrawal amount')
            return
        }

        let methodLabel = method === 'paypal' ? 'your PayPal account' : 'your bank account via Manual Transfer'

        if (!confirm(`Are you sure you want to withdraw AED ${amount.toFixed(2)} to ${methodLabel}?`)) {
            return
        }

        setIsPending(true)
        setShowSelection(false)
        try {
            let result
            if (method === 'paypal') result = await requestPayPalPayout(amount)
            else result = await requestManualPayout(amount)

            if (result.success) {
                toast.success('Withdrawal requested!', {
                    description: method === 'paypal'
                        ? `Your PayPal payout request for AED ${amount.toFixed(2)} has been sent.`
                        : `Your manual payout request for AED ${amount.toFixed(2)} has been sent for processing.`
                })
                router.refresh()
            } else {
                toast.error('Withdrawal failed', {
                    description: result.error
                })
            }
        } catch (err: any) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    const availableMethods = [
        { id: 'bank', label: 'Bank Transfer', available: hasBank, icon: <Landmark className="w-4 h-4" /> },
        { id: 'paypal', label: 'PayPal', available: hasPayPal, icon: <Send className="w-4 h-4" /> }
    ].filter(m => m.available)

    if (showSelection) {
        return (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300 bg-white/5 p-6 rounded-3xl border border-white/10 max-w-md">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Withdrawal Amount</p>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sky-400 text-sm">AED</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={balance}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white font-black text-2xl focus:outline-none focus:border-sky-500/50 transition-all"
                        />
                        <button
                            onClick={() => setWithdrawAmount(balance)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-sky-400 hover:text-sky-300 transition-colors"
                        >
                            Max
                        </button>
                    </div>
                    <p className="text-[10px] font-bold text-white/20 mt-2">Available: AED {balance.toFixed(2)}</p>
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Select Payout Method</p>
                    <div className="flex flex-wrap gap-3">
                        {availableMethods.map(method => (
                            <button
                                key={method.id}
                                disabled={isPending || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > balance}
                                onClick={() => handleWithdraw(method.id as any)}
                                className="flex items-center gap-3 bg-white/10 hover:bg-[#0EA5E9] text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all border border-white/10 shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {method.icon}
                                {method.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                    <button
                        onClick={() => setShowSelection(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                        Cancel Transaction
                    </button>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => {
                if (availableMethods.length > 0) {
                    setWithdrawAmount(balance)
                    setShowSelection(true)
                }
                else toast.error('No payout methods set up', { description: 'Please add a payout method in your profile settings.' })
            }}
            disabled={isPending || balance <= 0}
            className="flex items-center bg-[#0EA5E9] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-sky-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
                <Download className="w-5 h-5 mr-3 group-hover:translate-y-0.5 transition-transform" />
            )}
            {isPending ? 'Processing...' : 'Withdraw Funds'}
        </button>
    )
}
