'use client'

import { useState } from 'react'
import { Landmark, Check, Loader2, AlertCircle } from 'lucide-react'
import { updateBankDetails } from '../actions'
import { toast } from 'sonner'

interface BankPayoutFormProps {
    profile: any
}

export default function BankPayoutForm({ profile }: BankPayoutFormProps) {
    const [isPending, setIsPending] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        try {
            const result = await updateBankDetails(formData)
            if (result.success) {
                toast.success('Bank details saved successfully')
                setHasChanges(false)
            } else {
                toast.error(result.error || 'Failed to update bank details')
            }
        } catch (err: any) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    const uaeBanks = [
        "Emirates NBD",
        "First Abu Dhabi Bank (FAB)",
        "Abu Dhabi Commercial Bank (ADCB)",
        "Mashreq Bank",
        "Dubai Islamic Bank",
        "Abu Dhabi Islamic Bank (ADIB)",
        "Commercial Bank of Dubai (CBD)",
        "RakBank",
        "Wio Bank",
        "Al Maryah Community Bank",
        "Zand Bank",
        "Other"
    ]

    return (
        <form action={handleSubmit} onChange={() => setHasChanges(true)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        Bank Name
                    </label>
                    <select
                        name="bank_name"
                        defaultValue={profile?.bank_name || ""}
                        required
                        className="w-full bg-[#F0F9FF] border border-[#F0F9FF] rounded-2xl px-5 py-4 text-[#333] font-bold focus:outline-none focus:border-[#0EA5E9] transition-colors appearance-none"
                    >
                        <option value="" disabled>Select your bank</option>
                        {uaeBanks.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                        ))}
                    </select>
                </div>

                {/* Account Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        Account Holder Name
                    </label>
                    <input
                        type="text"
                        name="bank_account_name"
                        defaultValue={profile?.bank_account_name || ""}
                        required
                        placeholder="John Doe"
                        className="w-full bg-[#F0F9FF] border border-[#F0F9FF] rounded-2xl px-5 py-4 text-[#333] font-bold placeholder:text-gray-300 focus:outline-none focus:border-[#0EA5E9] transition-colors"
                    />
                </div>

                {/* IBAN */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        IBAN (UAE)
                    </label>
                    <input
                        type="text"
                        name="bank_iban"
                        defaultValue={profile?.bank_iban || ""}
                        required
                        placeholder="AE00 0000 0000 0000 0000 000"
                        pattern="^AE[0-9]{2}[0-9]{19}$"
                        className="w-full bg-[#F0F9FF] border border-[#F0F9FF] rounded-2xl px-5 py-4 text-[#333] font-mono font-bold placeholder:text-gray-300 focus:outline-none focus:border-[#0EA5E9] transition-colors uppercase"
                    />
                    <p className="text-[9px] text-gray-400 ml-1 uppercase tracking-tighter">
                        Must be a valid UAE IBAN starting with AE followed by 21 digits.
                    </p>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending || (!hasChanges && profile?.bank_iban)}
                    className="w-full flex items-center justify-center bg-[#0EA5E9] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#333e2d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                    ) : (
                        <Check className="w-5 h-5 mr-3" />
                    )}
                    {isPending ? 'Saving...' : (hasChanges || !profile?.bank_iban ? 'Save Bank Details' : 'Details Saved')}
                </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-orange-700 font-medium leading-relaxed">
                    Manual bank transfers are processed weekly. Ensure your IBAN is correct to avoid delays. Standard processing time is 3-5 business days.
                </p>
            </div>
        </form>
    )
}
