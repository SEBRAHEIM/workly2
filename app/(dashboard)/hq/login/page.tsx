'use client'

import { hqLogin } from '../actions'
import { useFormState } from 'react-dom'
import { Shield, Lock, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function HQLogin() {
    const [state, formAction] = useFormState(hqLogin, initialState)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 selection:bg-red-500 selection:text-white">
            {/* Background Texture Overlay */}
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-500 hover:text-white transition-all mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Civilization</span>
                </Link>

                <div className="bg-[#111111] rounded-[2.5rem] p-10 md:p-14 border border-white/5 shadow-2xl shadow-red-900/10">
                    <div className="flex justify-center mb-10">
                        <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-pulse">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="font-sans font-black text-3xl md:text-4xl text-white mb-3 tracking-tighter uppercase leading-[0.95]">
                            Workly HQ
                        </h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                            Restricted Command Sector
                        </p>
                    </div>

                    <form action={formAction} className="flex flex-col space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity Terminal</label>
                            <div className="relative group">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter Admin Identifier"
                                    required
                                    className="w-full bg-black/50 rounded-2xl border border-white/5 px-5 py-4 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Security Key</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-black/50 rounded-2xl border border-white/5 px-5 py-4 pr-14 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {state?.error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                                <Lock className="w-4 h-4 flex-shrink-0" />
                                {state.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-red-600 py-5 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-[0.98] transition-all duration-300 mt-4 group flex items-center justify-center gap-2"
                        >
                            Establish Connection
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-white/5">
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">
                            Biometric & IP encryption active | UAE Sector 1
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
