'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, CreditCard, ExternalLink, Loader2 } from 'lucide-react'
import { getStripeOnboardingLink, getStripeDashboardLink } from './actions'

interface StripeConnectBannerProps {
    stripeAccountId: string | null;
}

export default function StripeConnectBanner({ stripeAccountId }: StripeConnectBannerProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleConnect = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await getStripeOnboardingLink()
            if (result.error) {
                setError(result.error)
            } else if (result.url) {
                window.location.href = result.url
            }
        } catch (err) {
            setError('Failed to connect to Stripe. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleViewDashboard = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await getStripeDashboardLink()
            if (result.error) {
                setError(result.error)
            } else if (result.url) {
                window.location.href = result.url
            }
        } catch (err) {
            setError('Failed to open Stripe dashboard.')
        } finally {
            setLoading(false)
        }
    }

    if (!stripeAccountId) {
        return (
            <div className="mb-8 bg-blue-50 border border-blue-100 rounded-[2rem] p-6 shadow-sm overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-1">Set up payouts</h3>
                            <p className="text-sm text-blue-700 max-w-md">
                                Connect your Stripe account to receive payments from students directly into your bank account.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                        Connect Stripe
                    </button>
                </div>
                {error && (
                    <div className="mt-4 text-sm text-red-600 flex items-center bg-white/50 p-2 rounded-lg">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                    </div>
                )}
                <CreditCard className="absolute -right-8 -bottom-8 w-40 h-40 text-blue-600/5 rotate-12" />
            </div>
        )
    }

    return (
        <div className="mb-8 bg-white border border-[#E6E2D6] rounded-[2rem] p-6 shadow-sm overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#333333] mb-1">Payments Connected</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            Your Stripe account is correctly configured to receive payouts.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="text-sm font-bold text-[#3E4C37] bg-[#F3F0E9] px-6 py-2.5 rounded-xl hover:bg-[#E6E2D6] transition-all flex items-center"
                    >
                        Update Info
                    </button>
                    <button
                        onClick={handleViewDashboard}
                        disabled={loading}
                        className="text-sm font-bold text-white bg-[#333333] px-6 py-2.5 rounded-xl hover:bg-black transition-all flex items-center shadow-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
                        Dashboard
                    </button>
                </div>
            </div>
            {error && (
                <div className="mt-4 text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-lg border border-red-100">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}
        </div>
    )
}
