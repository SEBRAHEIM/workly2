'use client'

import { Download, Loader2, Landmark, CheckCircle2, Send } from 'lucide-react'
import { initiateStripeWithdrawal, requestManualPayout, requestPayPalPayout } from '../actions'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function WithdrawButton({
    isConnected,
    hasBank,
    hasPayPal,
    balance,
    payoutPreference
}: {
    isConnected: boolean,
    hasBank: boolean,
    hasPayPal: boolean,
    balance: number,
    payoutPreference?: 'stripe' | 'bank' | 'paypal'
}) {
    const [isPending, setIsPending] = useState(false)
    const [showSelection, setShowSelection] = useState(false)
    const router = useRouter()

    const handleWithdraw = async (method: 'stripe' | 'bank' | 'paypal') => {
        if (method === 'stripe' && !isConnected) {
            toast.error('Stripe not connected', {
                description: 'Please connect your Stripe account in Profile settings first.'
            })
            return
        }

        if (balance <= 0) {
            toast.error('Insufficient balance')
            return
        }

        let methodLabel = 'your connected Stripe account'
        if (method === 'paypal') methodLabel = 'your PayPal account'
        else if (method === 'bank') methodLabel = 'your bank account via Manual Transfer'

        if (!confirm(`Are you sure you want to withdraw AED ${balance.toFixed(2)} to ${methodLabel}?`)) {
            return
        }

        setIsPending(true)
        setShowSelection(false)
        try {
            let result
            if (method === 'stripe') result = await initiateStripeWithdrawal()
            else if (method === 'paypal') result = await requestPayPalPayout()
            else result = await requestManualPayout()

            if (result.success) {
                toast.success('Withdrawal requested!', {
                    description: method === 'stripe'
                        ? `AED ${balance.toFixed(2)} has been transferred to your Stripe account.`
                        : method === 'paypal'
                            ? `Your PayPal payout request for AED ${balance.toFixed(2)} has been sent.`
                            : `Your manual payout request for AED ${balance.toFixed(2)} has been sent for processing.`
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
        { id: 'stripe', label: 'Stripe', available: isConnected, icon: <Download className="w-4 h-4" /> },
        { id: 'bank', label: 'Bank Transfer', available: hasBank, icon: <Landmark className="w-4 h-4" /> },
        { id: 'paypal', label: 'PayPal', available: hasPayPal, icon: <Send className="w-4 h-4" /> }
    ].filter(m => m.available)

    if (showSelection) {
        return (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Select Method</p>
                <div className="flex flex-wrap gap-3">
                    {availableMethods.map(method => (
                        <button
                            key={method.id}
                            disabled={isPending}
                            onClick={() => handleWithdraw(method.id as any)}
                            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all border border-white/10 shadow-lg active:scale-95"
                        >
                            {method.icon}
                            {method.label}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowSelection(false)}
                        className="px-6 py-3 text-white/60 hover:text-white text-xs font-bold transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => {
                if (availableMethods.length > 1) setShowSelection(true)
                else if (availableMethods.length === 1) handleWithdraw(availableMethods[0].id as any)
                else toast.error('No payout methods set up', { description: 'Please add a payout method in your profile settings.' })
            }}
            disabled={isPending || balance <= 0}
            className="flex items-center bg-[#C6A87C] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#b0946a] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
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
