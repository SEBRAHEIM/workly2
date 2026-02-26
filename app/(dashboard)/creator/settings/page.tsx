'use client'

import { useState, useActionState, useEffect } from 'react'
import { Shield, Lock, Trash2, AlertTriangle, CheckCircle2, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { updatePassword, deleteAccount } from './actions'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (passwordState?.success) {
            toast.success('Password updated successfully')
        }
        if (passwordState?.error) {
            toast.error(passwordState.error)
        }
    }, [passwordState])

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        const result = await deleteAccount()
        if (result?.error) {
            toast.error(result.error)
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 font-outfit">
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-sans font-black text-[#0EA5E9] mb-2 uppercase tracking-tighter">Account Settings</h1>
                <p className="text-sm md:text-base text-gray-500">Manage your security and account preferences.</p>
            </div>

            <div className="space-y-8">
                {/* Change Password Section */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#F0F9FF] shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9]">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-sans font-black text-[#1E293B]">Change Password</h3>
                            <p className="text-sm text-gray-500">Update your account password to keep your account secure.</p>
                        </div>
                    </div>

                    <form action={passwordAction} className="space-y-6 max-w-md">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] block ml-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-[#F9F8F4] border border-[#F0F9FF] rounded-2xl py-4 px-6 pr-14 text-[#1E293B] font-bold focus:outline-none focus:border-[#0EA5E9] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-medium text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0EA5E9] transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] block ml-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-[#F9F8F4] border border-[#F0F9FF] rounded-2xl py-4 px-6 pr-14 text-[#1E293B] font-bold focus:outline-none focus:border-[#0EA5E9] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-medium text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0EA5E9] transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] block ml-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-[#F9F8F4] border border-[#F0F9FF] rounded-2xl py-4 px-6 pr-14 text-[#1E293B] font-bold focus:outline-none focus:border-[#0EA5E9] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-medium text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0EA5E9] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPasswordPending}
                            className="w-full bg-[#0EA5E9] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
                        >
                            {isPasswordPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Update Password
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Account Deletion Section */}
                <div className="bg-red-50/30 rounded-[2.5rem] p-8 md:p-12 border border-red-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-sans font-black text-red-900">Delete Account</h3>
                            <p className="text-sm text-red-600/70">Permanently remove your account and all your data from the platform.</p>
                        </div>
                    </div>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                        >
                            Deactivate Account
                        </button>
                    ) : (
                        <div className="bg-white p-6 rounded-3xl border border-red-200 animate-in zoom-in-95 duration-200">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-900 mb-1">Are you absolutely sure?</h4>
                                    <p className="text-sm text-gray-500">
                                        This action cannot be undone. All your projects, portfolio items, and earnings history will be permanently deleted.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Yes, delete my account'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
