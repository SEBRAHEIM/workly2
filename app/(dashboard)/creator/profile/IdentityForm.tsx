'use client'

import { useState } from 'react'
import { updateCreatorIdentity } from './actions'
import { Save } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

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
                if (phone) formData.set('whatsappPhone', phone)

                const result = await updateCreatorIdentity(formData)
                setIsSaving(false)

                if (result?.error) {
                    setError(result.error)
                } else {
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
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-[#3E4C37] focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">One line describing what you do.</p>
            </div>

            {/* WhatsApp Phone */}
            <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">WhatsApp Phone Number</label>
                <div className="flex gap-2 isolate">
                    <div className="flex-1 whatsapp-phone-wrapper">
                        <PhoneInput
                            international
                            defaultCountry="AE"
                            value={phone}
                            onChange={(val) => setPhone(val || '')}
                            placeholder="e.g. +971 50 123 4567"
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-base focus-within:ring-2 focus-within:ring-[#3E4C37] focus-within:border-transparent transition-all h-[58px]"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (!phone) {
                                alert('Please enter a phone number first')
                                return
                            }
                            const cleanPhone = phone.replace(/\D/g, '')
                            const message = `Testing Workly WhatsApp Alerts! 🚀 If you can see this, students can now notify you directly via WhatsApp when you get hired.`
                            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
                        }}
                        className="bg-green-500 text-white px-6 rounded-xl font-bold hover:bg-green-600 transition-colors text-sm shadow-sm"
                    >
                        Test
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Pick your country and enter your number. This allows students to notify you instantly via WhatsApp.</p>

                <style jsx global>{`
                    .whatsapp-phone-wrapper .PhoneInputInput {
                        background: transparent;
                        border: none !important;
                        outline: none !important;
                        padding: 0 10px;
                        font-size: 1rem;
                    }
                    .whatsapp-phone-wrapper .PhoneInputCountry {
                        margin-right: 10px;
                        padding-left: 5px;
                    }
                    .whatsapp-phone-wrapper .PhoneInputCountrySelect {
                        cursor: pointer;
                    }
                `}</style>
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
