'use client'

import { Download, Loader2, Landmark, CheckCircle2, Send } from 'lucide-react'
import { initiateStripeWithdrawal, requestManualPayout, requestPayPalPayout } from '../actions'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function WithdrawButton({
    isConnected,
    balance,
    payoutPreference
}: {
    isConnected: boolean,
    balance: number,
    payoutPreference?: 'stripe' | 'bank' | 'paypal'
}) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleWithdraw = async () => {
        const isStripe = payoutPreference === 'stripe' || (!payoutPreference && isConnected)
        const isPayPal = payoutPreference === 'paypal'

        if (isStripe && !isConnected) {
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
        if (isPayPal) methodLabel = 'your PayPal account'
        else if (!isStripe) methodLabel = 'your bank account via Manual Transfer'

        if (!confirm(`Are you sure you want to withdraw AED ${balance.toFixed(2)} to ${methodLabel}?`)) {
            return
        }

        setIsPending(true)
        try {
            let result
            if (isStripe) result = await initiateStripeWithdrawal()
            else if (isPayPal) result = await requestPayPalPayout()
            else result = await requestManualPayout()

            if (result.success) {
                toast.success('Withdrawal requested!', {
                    description: isStripe
                        ? `AED ${balance.toFixed(2)} has been transferred to your Stripe account.`
                        : isPayPal
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

    return (
        <button
            onClick={handleWithdraw}
            disabled={isPending || balance <= 0}
            className="flex items-center bg-[#C6A87C] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#b0946a] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
                payoutPreference === 'bank' ? <Landmark className="w-5 h-5 mr-3" /> :
                    payoutPreference === 'paypal' ? <Send className="w-5 h-5 mr-3" /> :
                        <Download className="w-5 h-5 mr-3 group-hover:translate-y-0.5 transition-transform" />
            )}
            {isPending ? 'Processing...' : (
                payoutPreference === 'bank' ? 'Request Payout' :
                    payoutPreference === 'paypal' ? 'Request PayPal' :
                        'Withdraw Funds'
            )}
        </button>
    )
}
