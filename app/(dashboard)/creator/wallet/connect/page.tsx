'use client'

import { connectStripeAccount } from '@/utils/stripe/actions'
import { Shield, Check, ExternalLink } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import { useFormState } from 'react-dom'

const initialState = {
    error: '',
}

export default function ConnectWallet() {
    const [state, formAction] = useFormState(connectStripeAccount, initialState)

    return (
        <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#F0F9FF]">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <AEDIcon className="w-8 h-8 text-[#0EA5E9]" />
                    </div>
                    <h1 className="font-serif font-bold text-4xl text-[#0EA5E9] mb-3">
                        Set up your Payouts
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Get paid directly to your bank account securely.
                    </p>
                </div>

                {/* Fee Breakdown Card */}
                <div className="bg-[#F8F6F1] rounded-2xl p-6 mb-8 border border-[#F0F9FF]">
                    <h3 className="font-bold text-[#1E293B] mb-4 uppercase tracking-wider text-sm flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Transparency Promise
                    </h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600">Platform Commission</span>
                            <span className="font-bold text-[#1E293B]">17%</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600">Your Earnings</span>
                            <span className="font-bold text-green-600">83%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex items-center">
                                Stripe Processing Fees
                                <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />
                            </span>
                            <span className="text-sm text-gray-400">Standard rates apply</span>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400 leading-relaxed bg-white/50 p-3 rounded-lg">
                        Processing fees are charged by Stripe (our payment processor) and are deducted automatically before funds reach your account.
                    </div>
                </div>

                {/* Terms Agreement */}
                <form action={formAction}>
                    <div className="mb-8 flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="w-4 h-4 text-[#0EA5E9] border-gray-300 rounded focus:ring-[#0EA5E9]"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                                I agree to the <a href="#" className="text-[#0EA5E9] underline">Terms of Service</a> and the fee structure outlined above.
                            </label>
                        </div>
                    </div>

                    {state?.error && (
                        <p className="text-red-500 text-sm text-center mb-4 font-bold">{state.error}</p>
                    )}

                    <button className="w-full bg-[#0EA5E9] text-white font-bold py-4 rounded-xl hover:bg-[#2e3b29] transition-all shadow-lg flex items-center justify-center text-lg">
                        Agree & Connect Stripe
                    </button>
                    <div className="flex items-center justify-center mt-4 text-gray-400 text-sm">
                        <Shield className="w-4 h-4 mr-1" />
                        SECURE PAYMENTS BY STRIPE
                    </div>
                </form>
            </div>
        </div>
    )
}
