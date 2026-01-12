'use client'

import { completeOnboarding } from '../actions'
import { useFormState } from 'react-dom'
import { useState, useEffect } from 'react'
import { User, PenTool, Shield } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const initialState = {
    error: '',
}

export default function Onboarding() {
    const [state, formAction] = useFormState(completeOnboarding, initialState)
    const [role, setRole] = useState<'student' | 'creator' | ''>('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email === 'workly.day@outlook.com') {
                setIsAdmin(true)
                setRole('student') // Doesn't matter, will be 'admin' in action
            }
            setLoading(false)
        }
        checkAdmin()
    }, [])

    if (loading) return null


    return (
        <main className="min-h-screen bg-[#F3F0E9] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-xl">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E6E2D6]">
                    <div className="text-center mb-10">
                        <p className="text-[#333333] text-sm tracking-widest uppercase mb-4 opacity-60">Almost there</p>
                        <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#3E4C37] mb-3">
                            Set up your profile
                        </h1>
                        <p className="text-gray-500 font-sans">
                            Tell us how you want to use the platform
                        </p>
                    </div>

                    <form action={formAction} className="flex flex-col space-y-8">
                        {!isAdmin ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">I am a...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setRole('student')}
                                        className={`p-6 border-2 rounded-2xl flex flex-col items-center text-center transition-all duration-200 ${role === 'student'
                                            ? 'border-[#3E4C37] bg-[#F3F0E9] text-[#3E4C37]'
                                            : 'border-gray-100 hover:border-[#E6E2D6] text-gray-500'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${role === 'student' ? 'bg-[#3E4C37] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <User className="w-6 h-6" />
                                        </div>
                                        <span className="font-semibold">Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('creator')}
                                        className={`p-6 border-2 rounded-2xl flex flex-col items-center text-center transition-all duration-200 ${role === 'creator'
                                            ? 'border-[#3E4C37] bg-[#F3F0E9] text-[#3E4C37]'
                                            : 'border-gray-100 hover:border-[#E6E2D6] text-gray-500'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${role === 'creator' ? 'bg-[#3E4C37] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <PenTool className="w-6 h-6" />
                                        </div>
                                        <span className="font-semibold">Creator</span>
                                    </button>
                                </div>
                                <input type="hidden" name="role" value={role} />
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-red-900 mb-1">Admin Access Detected</h3>
                                <p className="text-red-600 text-sm">You will be granted full administrative privileges.</p>
                                <input type="hidden" name="role" value="admin" />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#3E4C37]/20 focus:border-[#3E4C37] transition-all"
                                    placeholder="unique_username"
                                />
                            </div>

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name (Optional)
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#3E4C37]/20 focus:border-[#3E4C37] transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <p className="text-red-500 text-sm">{state.error}</p>
                        )}

                        <button
                            type="submit"
                            className={`w-full rounded-xl px-4 py-4 text-white font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-[#3E4C37] hover:bg-[#2e3b29]'
                                }`}
                            disabled={!role && !isAdmin}
                        >
                            {isAdmin ? 'Initialize Admin Profile' : 'Complete Setup'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
