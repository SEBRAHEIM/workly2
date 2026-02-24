'use client'

import { useState, useActionState } from 'react'
import { Shield, ArrowRight, ExternalLink, CheckCircle2, CreditCard, Landmark, AlertCircle, Loader2, Send } from 'lucide-react'
import BankPayoutForm from './profile/BankPayoutForm'
import PayPalPayoutForm from './profile/PayPalPayoutForm'

interface PayoutSettingsProps {
    profile: any
}

export default function PayoutSettings({ profile }: PayoutSettingsProps) {
    const [selectedMethod, setSelectedMethod] = useState<'bank' | 'paypal'>(
        profile?.payout_preference === 'paypal' ? 'paypal' : 'bank'
    )

    return (
        <div className="space-y-8">
            {/* Method Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${selectedMethod === 'bank'
                        ? 'border-[#0EA5E9] bg-[#000000] text-white shadow-xl translate-y-[-4px]'
                        : 'border-[#F0F9FF] bg-[#F9F8F4] text-gray-600 hover:border-[#0EA5E9]/30'
                        }`}
                >
                    <div className="relative z-10">
                        <Landmark className={`w-6 h-6 mb-4 ${selectedMethod === 'bank' ? 'text-white' : 'text-gray-400'}`} />
                        <div className="font-black text-sm uppercase tracking-widest mb-1">UAE Bank Transfer</div>
                        <div className={`text-[10px] uppercase font-bold tracking-tight opacity-60`}>
                            Direct transfer to UAE accounts (3-5 days).
                        </div>
                    </div>
                    {selectedMethod === 'bank' && (
                        <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-400/10" />
                        </div>
                    )}
                </button>

                <button
                    onClick={() => setSelectedMethod('paypal')}
                    className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${selectedMethod === 'paypal'
                        ? 'border-[#0EA5E9] bg-[#000000] text-white shadow-xl translate-y-[-4px]'
                        : 'border-[#F0F9FF] bg-white text-gray-600 hover:border-[#0EA5E9]/30'
                        }`}
                >
                    <div className="relative z-10">
                        <Send className={`w-6 h-6 mb-4 ${selectedMethod === 'paypal' ? 'text-white' : 'text-gray-400'}`} />
                        <div className="font-black text-sm uppercase tracking-widest mb-1">PayPal</div>
                        <div className={`text-[10px] uppercase font-bold tracking-tight opacity-60`}>
                            International Payouts via PayPal.
                        </div>
                    </div>
                    {selectedMethod === 'paypal' && (
                        <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-400/10" />
                        </div>
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                {selectedMethod === 'bank' ? (
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#F0F9FF] shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-2xl font-sans font-black font-black text-[#0EA5E9] mb-2">UAE Bank Details</h3>
                            <p className="text-gray-500 font-medium italic text-sm">Funds will be manually transferred to your UAE bank account.</p>
                        </div>
                        <BankPayoutForm profile={profile} />
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#F0F9FF] shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-2xl font-sans font-black font-black text-[#0EA5E9] mb-2">PayPal Details</h3>
                            <p className="text-gray-500 font-medium italic text-sm">Funds will be manually transferred to your PayPal account.</p>
                        </div>
                        <PayPalPayoutForm profile={profile} />
                    </div>
                )}
            </div>
        </div>
    )
}
