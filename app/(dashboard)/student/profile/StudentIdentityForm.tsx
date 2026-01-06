'use client'

import { useState } from 'react'
import { updateStudentIdentity } from './actions'
import { Save } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { toast } from 'sonner'

interface Props {
    profile: any
}

export default function StudentIdentityForm({ profile }: Props) {
    const [isSaving, setIsSaving] = useState(false)
    const [phone, setPhone] = useState(profile?.whatsapp_phone || '')

    return (
        <form
            action={async (formData) => {
                setIsSaving(true)

                // Add phone from state
                if (phone) formData.set('smsPhone', phone)

                const result = await updateStudentIdentity(formData)
                setIsSaving(false)

                if (result?.error) {
                    toast.error(result.error)
                } else {
                    toast.success('Settings saved!', {
                        description: phone ? `SMS notifications enabled for ${phone}` : 'Profile updated.'
                    })
                }
            }}
            className="space-y-6"
        >
            {/* SMS Phone */}
            <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">SMS Phone Number</label>
                <div className="flex gap-2 isolate">
                    <div className="flex-1 sms-phone-wrapper">
                        <PhoneInput
                            international
                            defaultCountry="AE"
                            value={phone}
                            onChange={(val) => setPhone(val || '')}
                            placeholder="e.g. +971 50 123 4567"
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-base focus-within:ring-2 focus-within:ring-[#3E4C37] focus-within:border-transparent transition-all h-[58px]"
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
                className="w-full bg-[#3E4C37] text-white font-bold py-4 rounded-xl hover:bg-[#2e3b29] active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50"
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
