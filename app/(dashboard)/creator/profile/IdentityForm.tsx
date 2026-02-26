'use client'

import { useState, useEffect } from 'react'
import { updateCreatorIdentity } from './actions'
import { Save, Check, AlertTriangle } from 'lucide-react'

import { toast } from 'sonner'
import { containsContactInfo } from '@/utils/content-safety'

interface Props {
    profile: any
    onSuccess?: () => void
}

export default function IdentityForm({ profile, onSuccess }: Props) {
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')



    return (
        <form
            className="space-y-6 font-outfit"
            action={async (formData) => {
                setError('')
                setIsSaving(true)

                // Client-side quick check
                const bio = formData.get('bio') as string
                const tagline = formData.get('tagline') as string
                const bioCheck = containsContactInfo(bio)
                const taglineCheck = containsContactInfo(tagline)

                if (bioCheck.hasContactInfo || taglineCheck.hasContactInfo) {
                    setError(`Validation failed: ${bioCheck.reason || taglineCheck.reason}. Sharing contact info is strictly prohibited.`)
                    setIsSaving(false)
                    return
                }

                const result = await updateCreatorIdentity(formData)
                setIsSaving(false)

                if (result?.error) {
                    setError(result.error)
                    toast.error(result.error)
                } else {
                    toast.success('Identity saved successfully!')
                    if (onSuccess) onSuccess()
                }
            }}
        >
            {/* Full Name */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Your legal name"
                    required
                    readOnly={!!profile?.full_name}
                    dir="auto"
                    className={`w-full bg-white border border-gray-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all shadow-sm ${profile?.full_name ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                />
            </div>

            {/* Username */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2">Username (@)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                    <input
                        type="text"
                        name="username"
                        defaultValue={profile?.username?.replace(/^@/, '') || ''}
                        placeholder="unique_handle"
                        required
                        readOnly={!!profile?.username}
                        dir="auto"
                        className={`w-full bg-white border border-gray-200 rounded-xl p-4 pl-8 text-base focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all shadow-sm ${profile?.username ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                    />
                </div>
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
                    readOnly={!!profile?.display_name}
                    dir="auto"
                    className={`w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all shadow-sm ${profile?.display_name ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                />
            </div>

            {/* Title / Tagline */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2">Professional Title</label>
                <input
                    type="text"
                    name="tagline"
                    defaultValue={profile?.tagline || ''}
                    placeholder="e.g. Video Editor & Motion Graphics Artist"
                    required
                    dir="auto"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">One line describing what you do.</p>
            </div>



            {/* Working Languages */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-3">Working Languages</label>
                <div className="flex gap-4">
                    {[
                        { label: 'English', value: 'English' },
                        { label: 'العربية', value: 'العربية' }
                    ].map((lang) => (
                        <label key={lang.value} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#0EA5E9] transition-all flex-1">
                            <input
                                type="checkbox"
                                name="languages"
                                value={lang.value}
                                defaultChecked={
                                    profile?.languages?.includes(lang.value) ||
                                    (lang.value === 'العربية' && profile?.languages?.includes('Arabic')) ||
                                    (lang.value === 'English' && !profile?.languages)
                                }
                                className="w-5 h-5 rounded border-gray-300 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                            />
                            <span className="text-base font-medium text-gray-700">{lang.label}</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Select the languages you can provide services in.</p>
            </div>

            {/* Bio */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2">About Me</label>
                <textarea
                    name="bio"
                    defaultValue={profile?.bio || ''}
                    placeholder="Share your experience, skills, and what makes you unique..."
                    rows={4}
                    required
                    dir="auto"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all resize-none"
                />
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3 h-3" />
                    No phone numbers or emails allowed. Sharing contact info will result in a ban.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <button
                disabled={isSaving}
                className="w-full bg-[#0EA5E9] text-white font-bold py-4 rounded-xl hover:bg-[#2e3b29] active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50"
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
