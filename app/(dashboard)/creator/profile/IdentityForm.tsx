import { useState, useEffect, useRef } from 'react'
import { updateCreatorIdentity, uploadProfileImage } from './actions'
import { Save, Check, AlertTriangle, User as UserIcon, Camera, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

import { toast } from 'sonner'
import { containsContactInfo } from '@/utils/content-safety'

interface Props {
    profile: any
    onSuccess?: () => void
}

export default function IdentityForm({ profile, onSuccess }: Props) {
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const [bannerUrl, setBannerUrl] = useState(profile?.banner_url || '')
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [isUploadingBanner, setIsUploadingBanner] = useState(false)

    const avatarInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0]
        if (!file) return

        if (type === 'avatar') setIsUploadingAvatar(true)
        else setIsUploadingBanner(true)

        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', type)

        try {
            const result = await uploadProfileImage(formData)
            if (result.success && result.url) {
                if (type === 'avatar') setAvatarUrl(result.url)
                else setBannerUrl(result.url)
                toast.success(`${type === 'avatar' ? 'Photo' : 'Banner'} uploaded!`)
            } else {
                toast.error(result.error || 'Upload failed')
            }
        } catch (err) {
            toast.error('Upload failed')
        } finally {
            if (type === 'avatar') setIsUploadingAvatar(false)
            else setIsUploadingBanner(false)
        }
    }

    return (
        <form
            className="space-y-8 font-outfit"
            action={async (formData) => {
                setError('')
                setIsSaving(true)

                // Add urls to form data
                formData.set('avatarUrl', avatarUrl)
                formData.set('bannerUrl', bannerUrl)

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
                    toast.success('Profile updated successfully!')
                    if (onSuccess) onSuccess()
                }
            }}
        >
            {/* Visual Profile Preview Section */}
            <div className="relative mb-12">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                        Profile Aesthetics
                    </label>
                </div>

                {/* Banner Preview */}
                <div
                    className="relative h-32 md:h-40 w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 group cursor-pointer"
                    onClick={() => bannerInputRef.current?.click()}
                >
                    {bannerUrl ? (
                        <Image
                            src={bannerUrl}
                            alt="Banner"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 opacity-20" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                            {isUploadingBanner ? (
                                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                            ) : (
                                <ImageIcon className="w-4 h-4 text-sky-500" />
                            )}
                            <span className="text-xs font-bold text-slate-900">Change Banner</span>
                        </div>
                    </div>
                </div>

                {/* Avatar Preview */}
                <div className="absolute -bottom-8 left-6 md:left-10 z-20">
                    <div
                        className="relative w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-white p-1.5 shadow-2xl shadow-sky-900/10 cursor-pointer group"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        <div className="w-full h-full rounded-[22px] bg-slate-50 overflow-hidden relative border border-slate-100">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-sky-200" />
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                {isUploadingAvatar ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                ) : (
                                    <Camera className="w-5 h-5 text-white" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <input
                    type="file"
                    ref={avatarInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                />
                <input
                    type="file"
                    ref={bannerInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-bold text-[#1E293B] mb-2 uppercase tracking-widest text-[10px]">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        defaultValue={profile?.full_name || ''}
                        placeholder="Your legal name"
                        required
                        readOnly={!!profile?.full_name}
                        dir="auto"
                        className={`w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all shadow-sm ${profile?.full_name ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-bold text-[#1E293B] mb-2 uppercase tracking-widest text-[10px]">Username (@)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</span>
                        <input
                            type="text"
                            name="username"
                            defaultValue={profile?.username?.replace(/^@/, '') || ''}
                            placeholder="unique_handle"
                            required
                            readOnly={!!profile?.username}
                            dir="auto"
                            className={`w-full bg-white border border-gray-200 rounded-xl p-4 pl-8 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all shadow-sm ${profile?.username ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm font-bold text-[#1E293B] mb-2 uppercase tracking-widest text-[10px]">Professional Title</label>
                    <input
                        type="text"
                        name="tagline"
                        defaultValue={profile?.tagline || ''}
                        placeholder="e.g. Video Editor & Motion Graphics Artist"
                        required
                        dir="auto"
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all"
                    />
                </div>
            </div>

            {/* Working Languages */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-3 uppercase tracking-widest text-[10px]">Working Languages</label>
                <div className="flex gap-4">
                    {[
                        { label: 'English', value: 'English' },
                        { label: 'العربية', value: 'العربية' }
                    ].map((lang) => (
                        <label key={lang.value} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3 cursor-pointer hover:border-[#0EA5E9] transition-all flex-1 shadow-sm">
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
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{lang.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Bio */}
            <div>
                <label className="block text-sm font-bold text-[#1E293B] mb-2 uppercase tracking-widest text-[10px]">About Me</label>
                <textarea
                    name="bio"
                    defaultValue={profile?.bio || ''}
                    placeholder="Share your experience, skills, and what makes you unique..."
                    rows={4}
                    required
                    dir="auto"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all resize-none shadow-sm"
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
                disabled={isSaving || isUploadingAvatar || isUploadingBanner}
                className="w-full bg-[#0EA5E9] text-white font-black uppercase tracking-[0.2em] py-5 rounded-xl hover:bg-slate-900 active:scale-95 transition-all shadow-xl shadow-sky-100 flex items-center justify-center disabled:opacity-50 text-[10px]"
            >
                {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                    </>
                )}
            </button>
        </form>
    )
}
