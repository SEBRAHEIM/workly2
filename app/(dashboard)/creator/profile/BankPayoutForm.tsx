'use client'

import { useState } from 'react'
import { Building2, Landmark, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { updateBankDetails } from '../actions'

interface BankPayoutFormProps {
    profile: any
}

const UAE_BANKS = [
    "Emirates NBD",
    "First Abu Dhabi Bank (FAB)",
    "Abu Dhabi Commercial Bank (ADCB)",
    "Mashreq Bank",
    "Dubai Islamic Bank (DIB)",
    "Abu Dhabi Islamic Bank (ADIB)",
    "Commercial Bank of Dubai (CBD)",
    "RAKBANK",
    "Emirates Islamic",
    "Sharjah Islamic Bank",
    "Ajman Bank",
    "National Bank of Fujairah (NBF)",
    "Bank of Sharjah",
    "Wio Bank",
    "Citibank (UAE)",
    "HSBC Middle East (UAE)",
    "Standard Chartered (UAE)",
    "Zand Bank",
    "Al Maryah Community Bank",
    "Mbank (Al Maryah)",
    "Other"
]

export default function BankPayoutForm({ profile }: BankPayoutFormProps) {
    const [loading, setLoading] = useState(false)
    const [bankName, setBankName] = useState(profile?.bank_name || UAE_BANKS[0])
    const [accountName, setAccountName] = useState(profile?.bank_account_name || '')
    const [iban, setIban] = useState(profile?.bank_iban || '')

    // Keep track of what is actually in the DB to show "Saved" state
    const [lastSaved, setLastSaved] = useState({
        bankName: profile?.bank_name || UAE_BANKS[0],
        accountName: profile?.bank_account_name || '',
        iban: profile?.bank_iban || ''
    })

    const isModified =
        bankName !== lastSaved.bankName ||
        accountName !== lastSaved.accountName ||
        iban !== lastSaved.iban

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simple IBAN validation (UAE starts with AE)
        const cleanIban = iban.replace(/\s/g, '')
        if (!cleanIban.startsWith('AE') || cleanIban.length !== 23) {
            toast.error('Invalid UAE IBAN. Must start with AE and be 23 characters long.')
            setLoading(false)
            return
        }

        const formData = new FormData()
        formData.append('bank_name', bankName)
        formData.append('bank_account_name', accountName)
        formData.append('bank_iban', cleanIban)
        formData.append('payout_preference', 'bank')

        const result = await updateBankDetails(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Bank details saved! Payouts will now be sent via manual transfer.')
            setLastSaved({ bankName, accountName, iban: cleanIban })
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800 mb-6">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <p>
                    <strong>Manual Payouts:</strong> Selecting this option means we will manually transfer your earnings to your bank account. Transfers usually take 3-5 business days.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bank Name</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none"
                            required
                        >
                            {UAE_BANKS.map(bank => (
                                <option key={bank} value={bank}>{bank}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
                    <div className="relative">
                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            placeholder="Exact name on account"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">IBAN (UAE)</label>
                    <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-black/5 focus:border-black transition-all uppercase"
                        placeholder="AE00 0000 0000 0000 0000 000"
                        maxLength={23}
                        required
                    />
                    <p className="text-xs text-gray-500">Must be a valid UAE IBAN starting with 'AE'.</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !isModified}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${!isModified
                        ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                        : 'bg-black text-white hover:bg-gray-900 shadow-lg active:scale-[0.98]'
                    }`}
            >
                {loading ? (
                    'Saving...'
                ) : !isModified ? (
                    <>
                        <Check className="w-5 h-5" />
                        Bank Details Saved
                    </>
                ) : (
                    <>
                        <Check className="w-5 h-5" />
                        Save Bank Details & Use Manual Payouts
                    </>
                )}
            </button>
        </form>
    )
}
