'use client'

import { useState, useEffect } from 'react'
import { updateClientIdentity } from './actions'
import { Save } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { toast } from 'sonner'

interface Props {
    profile: any
}

export default function ClientIdentityForm({ profile }: Props) {
    const [isSaving, setIsSaving] = useState(false)
    const [phone, setPhone] = useState(profile?.whatsapp_phone || '')

    // Sync state if profile update comes from outside
    useEffect(() => {
        setPhone(profile?.whatsapp_phone || '')
    }, [profile?.whatsapp_phone])

    return (
        <form
            action={async (formData) => {
                setIsSaving(true)

                // Add phone from state
                if (phone) formData.set('smsPhone', phone)

                const result = await updateClientIdentity(formData)
                setIsSaving(false)

                if (result?.error) {
                    toast.error(result.error)
                } else {
                    toast.success('Profile saved!')
                }
            }}
            className="space-y-6"
        >
            {/* Full Name */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2 uppercase tracking-widest text-[10px]">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Your legal name"
                    readOnly={!!profile?.full_name}
                    className={`w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all ${profile?.full_name ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                />
            </div>

            {/* Display Name */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2 uppercase tracking-widest text-[10px]">Display Name</label>
                <input
                    type="text"
                    name="displayName"
                    defaultValue={profile?.display_name || ''}
                    placeholder="e.g. Ahmed M."
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all shadow-sm"
                />
            </div>

            {/* Username */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2 uppercase tracking-widest text-[10px]">Username (@)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                    <input
                        type="text"
                        name="username"
                        defaultValue={profile?.username?.replace(/^@/, '') || ''}
                        placeholder="unique_handle"
                        readOnly={!!profile?.username}
                        className={`w-full bg-white border border-gray-200 rounded-xl p-4 pl-8 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all shadow-sm ${profile?.username ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                    />
                </div>
            </div>

            {/* SMS Phone */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2">SMS Phone Number</label>
                <div className="flex gap-2 isolate">
                    <div className="flex-1 sms-phone-wrapper">
                        <PhoneInput
                            international
                            defaultCountry="AE"
                            value={phone}
                            onChange={(val) => setPhone(val || '')}
                            placeholder="e.g. +971 50 123 4567"
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-base focus-within:ring-2 focus-within:ring-[#0EA5E9] focus-within:border-transparent transition-all h-[58px]"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Enter your phone number to receive **immediate SMS alerts** when a creator submits work for your project.
                </p>

                <style jsx global>{`
                    .sms-phone-wrapper .PhoneInputInput {
                        background: transparent;
                        border: none !important;
                        outline: none !important;
                        padding: 0 10px;
                        font-size: 1rem;
                    }
                    .sms-phone-wrapper .PhoneInputCountry {
                        margin-right: 10px;
                        padding-left: 5px;
                    }
                `}</style>
            </div>

            <button
                disabled={isSaving}
                className="w-full bg-[#0EA5E9] text-white font-bold py-4 rounded-xl hover:bg-[#2e3b29] active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50"
            >
                {isSaving ? 'Saving...' : (
                    <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Settings
                    </>
                )}
            </button>
        </form>
    )
}
