'use client'

import { useState, useActionState } from 'react'
import { Shield, ArrowRight, ExternalLink, CheckCircle2, CreditCard, Landmark, AlertCircle, Loader2, Send } from 'lucide-react'
import { createStripeOnboardingLink } from './actions'
import BankPayoutForm from './profile/BankPayoutForm'
import PayPalPayoutForm from './profile/PayPalPayoutForm'

interface PayoutSettingsProps {
    profile: any
}

export default function PayoutSettings({ profile }: PayoutSettingsProps) {
    const isConnected = !!profile?.stripe_account_id
    const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'bank' | 'paypal'>(
        profile?.payout_preference === 'bank' ? 'bank' :
            profile?.payout_preference === 'paypal' ? 'paypal' : 'stripe'
    )
    const [state, formAction, isPending] = useActionState(createStripeOnboardingLink, null)

    return (
        <div className="space-y-8">
            {/* Method Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setSelectedMethod('stripe')}
                    className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${selectedMethod === 'stripe'
                        ? 'border-[#3E4C37] bg-[#000000] text-white shadow-xl translate-y-[-4px]'
                        : 'border-[#E6E2D6] bg-white text-gray-600 hover:border-[#3E4C37]/30'
                        }`}
                >
                    <div className="relative z-10">
                        <CreditCard className={`w-6 h-6 mb-4 ${selectedMethod === 'stripe' ? 'text-white' : 'text-gray-400'}`} />
                        <div className="font-black text-sm uppercase tracking-widest mb-1">Stripe Connect</div>
                        <div className={`text-[10px] uppercase font-bold tracking-tight opacity-60`}>
                            Direct, automated payouts via Stripe.
                        </div>
                    </div>
                    {selectedMethod === 'stripe' && (
                        <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-400/10" />
                        </div>
                    )}
                </button>

                <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${selectedMethod === 'bank'
                        ? 'border-[#3E4C37] bg-[#000000] text-white shadow-xl translate-y-[-4px]'
                        : 'border-[#E6E2D6] bg-[#F9F8F4] text-gray-600 hover:border-[#3E4C37]/30'
                        }`}
                >
                    <div className="relative z-10">
                        <Landmark className={`w-6 h-6 mb-4 ${selectedMethod === 'bank' ? 'text-white' : 'text-gray-400'}`} />
                        <div className="font-black text-sm uppercase tracking-widest mb-1">Manual Bank</div>
                        <div className={`text-[10px] uppercase font-bold tracking-tight opacity-60`}>
                            UAE Bank Transfer (3-5 days).
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
                    className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${selectedMethod === 'paypal'
                        ? 'border-[#3E4C37] bg-[#000000] text-white shadow-xl translate-y-[-4px]'
                        : 'border-[#E6E2D6] bg-white text-gray-600 hover:border-[#3E4C37]/30'
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
                {selectedMethod === 'stripe' ? (
                    <div className="space-y-4">
                        <div className="bg-[#F3F0E9] rounded-[2.5rem] p-8 md:p-12 border border-[#E6E2D6] overflow-hidden relative shadow-sm">
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                                <CreditCard className="w-6 h-6 text-[#3E4C37]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#C6A87C]">Automated Payouts</p>
                                                <h3 className="text-2xl font-serif font-black text-[#3E4C37]">
                                                    {isConnected ? 'Stripe Connected' : 'Set up payouts'}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 font-medium leading-relaxed max-w-md">
                                            {isConnected
                                                ? 'Your account is connected. You can manage your payout schedule and bank details in your Stripe Dashboard.'
                                                : 'Connect your Stripe account to receive payments from students directly into your bank account.'}
                                        </p>
                                    </div>

                                    <div className="shrink-0">
                                        {isConnected ? (
                                            <a
                                                href="https://dashboard.stripe.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center bg-[#3E4C37] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#333e2d] transition-all shadow-xl active:scale-95 group"
                                            >
                                                Stripe Dashboard
                                                <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                        ) : (
                                            <form action={formAction}>
                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className="flex items-center bg-[#C6A87C] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#b0946a] transition-all shadow-xl active:scale-95 transform hover:scale-[1.02] disabled:opacity-50"
                                                >
                                                    {isPending ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : null}
                                                    {isPending ? 'Connecting...' : 'Connect Stripe'}
                                                    {!isPending && <ArrowRight className="w-5 h-5 ml-3" />}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {state?.error && (
                                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold animate-in shake duration-500">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {state.error}
                                    </div>
                                )}
                            </div>

                            <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
                                <Shield className="w-64 h-64 text-[#3E4C37]" />
                            </div>
                        </div>

                        {!isConnected && (
                            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 space-y-3 animate-in fade-in slide-in-from-top-4">
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    <strong>UAE Platform Notice:</strong> Due to local regulations, platforms based in the UAE use **Stripe Standard**. During onboarding, you will create a full Stripe account.
                                </p>
                                <p className="text-[10px] text-blue-600 font-medium leading-relaxed italic border-t border-blue-100 pt-3">
                                    Note: Stripe UAE requires a valid trade license or business registration (Individual accounts are not supported in the AE region). If you are a student without a license, please use **Manual Bank** or **PayPal**.
                                </p>
                            </div>
                        )}
                    </div>
                ) : selectedMethod === 'bank' ? (
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#E6E2D6] shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-2xl font-serif font-black text-[#3E4C37] mb-2">Manual Bank Details</h3>
                            <p className="text-gray-500 font-medium italic text-sm">Funds will be manually transferred to the account below.</p>
                        </div>
                        <BankPayoutForm profile={profile} />
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#E6E2D6] shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-2xl font-serif font-black text-[#3E4C37] mb-2">PayPal Details</h3>
                            <p className="text-gray-500 font-medium italic text-sm">Funds will be manually transferred to your PayPal account.</p>
                        </div>
                        <PayPalPayoutForm profile={profile} />
                    </div>
                )}
            </div>
        </div>
    )
}
