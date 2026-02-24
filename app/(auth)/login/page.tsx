'use client'

import { login } from '../actions'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const initialState = {
    error: '',
}

export default function Login() {
    const [state, formAction] = useFormState(login, initialState)
    const [showPassword, setShowPassword] = useState(false)

    const handleGoogleLogin = async () => {
        // TODO: Implement Google Login via Supabase
        console.log("Google Login Clicked")
    }

    const handleAppleLogin = async () => {
        // TODO: Implement Apple Login via Supabase
        console.log("Apple Login Clicked")
    }

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-50 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-50 rounded-full blur-[80px] md:blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-60" />

            <div className="w-full max-w-md relative z-10">
                <Link
                    href="/join"
                    className="inline-flex items-center px-6 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-sky-500 hover:bg-slate-50 active:scale-95 transition-all shadow-sm group mb-12"
                >
                    <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-sky-100/50 border border-sky-100 mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="font-sans font-black text-4xl md:text-5xl text-slate-900 mb-3 tracking-tighter uppercase leading-[0.95]">
                            Welcome <br /> <span className="text-[#0EA5E9]">Back.</span>
                        </h1>
                        <p className="text-slate-500 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] mt-8 opacity-70">
                            Access your Workly creative workspace.
                        </p>
                    </div>

                    <div className="pt-4">
                        {/* No social login, just email form below */}
                    </div>

                    <form action={formAction} className="flex flex-col space-y-4">
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full rounded-2xl border border-sky-100 bg-sky-50/30 px-6 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-semibold text-sm"
                            />
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                className="w-full rounded-2xl border border-sky-100 bg-sky-50/30 px-6 py-4 pr-14 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-semibold text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#0EA5E9] transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {state?.error && (
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{state.error}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#0EA5E9] px-4 py-4 text-white font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-100 active:scale-[0.98] transition-all duration-300 mt-4 shadow-lg shadow-sky-100"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-sky-50">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            New Member?{' '}
                            <Link href="/join" className="text-[#0EA5E9] font-black hover:underline">
                                Request Access
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
