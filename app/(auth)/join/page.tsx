'use client'

import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function JoinPage() {

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
                    href="/"
                    className="inline-flex items-center text-slate-400 hover:text-sky-500 transition-colors mb-12 font-black text-[10px] uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-sky-100/50 border border-sky-100 mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="font-sans font-black text-5xl md:text-6xl text-slate-900 mb-3 tracking-tighter uppercase leading-[0.9]">
                            Join <br /> <span className="text-[#0EA5E9]">Workly.</span>
                        </h1>
                        <p className="text-slate-500 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] px-4 md:px-0 mt-8 opacity-70">
                            Create your workspace and join the collective.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Email Button only */}
                        <Link
                            href="/signup"
                            className="w-full flex items-center justify-center bg-[#0EA5E9] border border-transparent hover:bg-sky-600 text-white font-black py-5 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest shadow-xl shadow-sky-100 group mt-4"
                        >
                            <Mail className="w-4 h-4 mr-3 text-white/80 group-hover:text-white transition-colors" />
                            Sign up with Email
                        </Link>
                    </div>

                    <div className="mt-12 text-center pt-8 border-t border-sky-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Member?{' '}
                            <Link href="/login" className="text-[#0EA5E9] hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
