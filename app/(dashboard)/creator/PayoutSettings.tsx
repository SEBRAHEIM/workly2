'use client'

import { useState } from 'react'
import { Landmark, CreditCard, Check } from 'lucide-react'
import StripeConnectBanner from './StripeConnectBanner'
import BankPayoutForm from './profile/BankPayoutForm'

interface PayoutSettingsProps {
    profile: any
}

export default function PayoutSettings({ profile }: PayoutSettingsProps) {
    const [method, setMethod] = useState<'stripe' | 'bank'>(profile?.payout_preference || 'stripe')

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={() => setMethod('stripe')}
                    className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left relative ${method === 'stripe'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                        }`}
                >
                    <CreditCard className={`w-6 h-6 mb-3 ${method === 'stripe' ? 'text-white' : 'text-gray-400'}`} />
                    <div className="font-bold">Stripe Connect</div>
                    <div className={`text-xs mt-1 ${method === 'stripe' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Automated, instant payouts to your account.
                    </div>
                </button>

                <button
                    onClick={() => setMethod('bank')}
                    className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left relative ${method === 'bank'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                        }`}
                >
                    <Landmark className={`w-6 h-6 mb-3 ${method === 'bank' ? 'text-white' : 'text-gray-400'}`} />
                    <div className="font-bold">Manual Bank Transfer</div>
                    <div className={`text-xs mt-1 ${method === 'bank' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Standard UAE Bank Transfer (3-5 days).
                    </div>
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {method === 'stripe' ? (
                    <StripeConnectBanner stripeAccountId={profile?.stripe_account_id} />
                ) : (
                    <BankPayoutForm profile={profile} />
                )}
            </div>
        </div>
    )
}
