'use client'

import { useState } from 'react'
import { updateCreatorIdentity } from './actions'
import { Save, Check } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { toast } from 'sonner'

// Helper to check for content policy violations locally too
const contactRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/

interface Props {
    profile: any
    onSuccess?: () => void
}

export default function IdentityForm({ profile, onSuccess }: Props) {
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [phone, setPhone] = useState(profile?.whatsapp_phone || '')

    return (
        <form
            action={async (formData) => {
                setError('')
                setIsSaving(true)

                // Client-side quick check
                const bio = formData.get('bio') as string
                const tagline = formData.get('tagline') as string
                if (contactRegex.test(bio) || contactRegex.test(tagline)) {
                    setError('Bio or Tagline contains prohibited contact information.')
                    setIsSaving(false)
                    return
                }

                // Add phone from state
                if (phone) formData.set('smsPhone', phone)

                const result = await updateCreatorIdentity(formData)
                setIsSaving(false)

                if (result?.error) {
                    setError(result.error)
                    toast.error(result.error)
                } else {
                    toast.success('Identity saved successfully!', {
                        description: phone ? `SMS notifications enabled for ${phone}` : 'Identity details updated.'
                    })
                    if (onSuccess) onSuccess()
                }
            }}
            className="space-y-6"
        >
            {/* Display Name */}
            <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">Display Name</label>
                <input
                    type="text"
                    name="displayName"
                    defaultValue={profile?.display_name || profile?.full_name || ''}
                    placeholder="e.g. Ahmed M."
                    required
                    dir="auto"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-[#3E4C37] focus:border-transparent transition-all"
                />
            </div>

            {/* Title / Tagline */}
            <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">Professional Title</label>
                <input
                    type="text"
                    name="tagline"
                    defaultValue={profile?.tagline || ''}
                    placeholder="e.g. Video Editor & Motion Graphics Artist"
                    required
                    dir="auto"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-[#3E4C37] focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">One line describing what you do.</p>
            </div>

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
                <p className="text-xs text-gray-400 mt-2">Pick your country and enter your number. <strong>Important:</strong> Click "Save Identity" to enable SMS alerts for your projects.</p>

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
                    .sms-phone-wrapper .PhoneInputCountrySelect {
                        cursor: pointer;
                    }
                `}</style>
            </div>

            {/* Working Languages */}
            <div>
                <label className="block text-sm font-bold text-[#333333] mb-3">Working Languages</label>
                <div className="flex gap-4">
                    {[
                        { label: 'English', value: 'English' },
                        { label: 'العربية', value: 'العربية' }
                    ].map((lang) => (
                        <label key={lang.value} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#3E4C37] transition-all flex-1">
                            <input
                                type="checkbox"
                                name="languages"
                                value={lang.value}
                                defaultChecked={
                                    profile?.languages?.includes(lang.value) ||
                                    (lang.value === 'العربية' && profile?.languages?.includes('Arabic')) ||
                                    (lang.value === 'English' && !profile?.languages)
                                }
                                className="w-5 h-5 rounded border-gray-300 text-[#3E4C37] focus:ring-[#3E4C37]"
                            />
                            <span className="text-base font-medium text-gray-700">{lang.label}</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Select the languages you can provide services in.</p>
            </div>

            {/* Bio */}
            <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">About Me</label>
                <textarea
                    name="bio"
                    defaultValue={profile?.bio || ''}
                    placeholder="Share your experience, skills, and what makes you unique..."
                    rows={4}
                    required
                    dir="auto"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-[#3E4C37] focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">
                    Please do not include email or phone numbers. Keep it professional.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <button
                disabled={isSaving}
                className="w-full bg-[#3E4C37] text-white font-bold py-4 rounded-xl hover:bg-[#2e3b29] active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50"
            >
                {isSaving ? 'Saving...' : (
                    <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Identity
                    </>
                )}
            </button>
        </form>
    )
}
