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
    const [role, setRole] = useState<'client' | 'creator' | ''>('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email === 'workly.day@outlook.com') {
                setIsAdmin(true)
                setRole('client') // Doesn't matter, will be 'admin' in action
            }
            setLoading(false)
        }
        checkAdmin()
    }, [])

    if (loading) return null


    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-50 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-50 rounded-full blur-[80px] md:blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-60" />

            <div className="w-full max-w-xl relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-sky-100/50 border border-sky-100 mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="font-sans font-black font-black text-4xl text-slate-900 mb-3 tracking-tighter uppercase leading-none">
                            Identity <br /> <span className="text-[#0EA5E9]">Setup.</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Configure your workspace profile.
                        </p>
                    </div>

                    <form action={formAction} className="flex flex-col space-y-8">
                        {!isAdmin ? (
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-6 text-center uppercase tracking-widest">Select Core Objective</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setRole('client')}
                                        className={`p-8 border rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 touch-manipulation group ${role === 'client'
                                            ? 'border-[#0EA5E9] bg-sky-50/50 text-[#0EA5E9] shadow-lg shadow-sky-100'
                                            : 'border-sky-50 bg-white text-slate-400 hover:border-sky-100'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${role === 'client' ? 'bg-[#0EA5E9] text-white shadow-lg shadow-sky-200' : 'bg-sky-50 text-sky-300'}`}>
                                            <User size={28} />
                                        </div>
                                        <span className="font-sans font-black font-black uppercase tracking-tight text-xl">Client</span>
                                        <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100 transition-opacity">Deploy Projects</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('creator')}
                                        className={`p-8 border rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 touch-manipulation group ${role === 'creator'
                                            ? 'border-[#0EA5E9] bg-sky-50/50 text-[#0EA5E9] shadow-lg shadow-sky-100'
                                            : 'border-sky-50 bg-white text-slate-400 hover:border-sky-100'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${role === 'creator' ? 'bg-[#0EA5E9] text-white shadow-lg shadow-sky-200' : 'bg-sky-50 text-sky-300'}`}>
                                            <PenTool size={28} />
                                        </div>
                                        <span className="font-sans font-black font-black uppercase tracking-tight text-xl">Creator</span>
                                        <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100 transition-opacity">Execution Elite</p>
                                    </button>
                                </div>
                                <input type="hidden" name="role" value={role} />
                            </div>
                        ) : (
                            <div className="bg-sky-50 border border-sky-100 rounded-[2rem] p-8 text-center relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-[#0EA5E9] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-200">
                                        <Shield size={32} />
                                    </div>
                                    <h3 className="font-sans font-black font-black text-2xl text-slate-900 mb-2 uppercase tracking-tight">Root Admin</h3>
                                    <p className="text-[#0EA5E9] text-[10px] font-black uppercase tracking-widest">Master Authority Granted</p>
                                </div>
                                <input type="hidden" name="role" value="admin" />
                            </div>
                        )}

                        <div className="space-y-6 pt-4">
                            <div>
                                <label htmlFor="username" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest px-1">
                                    Terminal Handle
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full rounded-2xl border border-sky-100 bg-sky-50/30 px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium text-sm"
                                    placeholder="unique_handle"
                                />
                            </div>

                            <div>
                                <label htmlFor="fullName" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest px-1">
                                    Registry Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    className="w-full rounded-2xl border border-sky-100 bg-sky-50/30 px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium text-sm"
                                    placeholder="Operator Name"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{state.error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#0EA5E9] px-6 py-5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 hover:shadow-2xl hover:shadow-sky-100 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-sky-100 disabled:opacity-50 mt-4"
                            disabled={!role && !isAdmin}
                        >
                            {isAdmin ? 'Deploy Admin Identity' : 'Secure Access'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
