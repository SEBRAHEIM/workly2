'use client'

import { Mail, Loader2, Check } from 'lucide-react'
import { useState, useActionState } from 'react'
import { updatePayPalDetails } from '../actions'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function PayPalPayoutForm({ profile }: { profile: any }) {
    const [state, formAction, isPending] = useActionState(updatePayPalDetails, null)

    useEffect(() => {
        if (state?.success) {
            toast.success('PayPal details updated successfully')
        }
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] block ml-1">
                    PayPal Email Address
                </label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0EA5E9] transition-colors" />
                    <input
                        type="email"
                        name="paypal_email"
                        defaultValue={profile?.paypal_email || ''}
                        required
                        placeholder="your-paypal@example.com"
                        className="w-full bg-[#F9F8F4] border border-[#F0F9FF] rounded-2xl py-4 pl-12 pr-4 text-[#1E293B] font-bold focus:outline-none focus:border-[#0EA5E9] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-medium"
                    />
                </div>
                <p className="text-[10px] text-gray-400 font-medium ml-1">
                    Payments will be sent to this email address via PayPal Manual Transfer.
                </p>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full h-[64px] bg-[#0EA5E9] text-white rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-[#333e2d] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
            >
                <div className={`flex items-center gap-3 transition-transform duration-500 ${isPending ? 'translate-y-12' : 'translate-y-0'}`}>
                    <span>Save PayPal Details</span>
                </div>
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                )}
            </button>
        </form>
    )
}
