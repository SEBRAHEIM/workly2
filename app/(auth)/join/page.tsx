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
                        <div className="w-16 h-16 bg-[#0EA5E9] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sky-200">
                            <span className="text-white font-serif font-black text-3xl">W</span>
                        </div>
                        <h1 className="font-serif font-black text-4xl text-slate-900 mb-3 tracking-tighter uppercase leading-none">
                            The <br /> <span className="text-[#0EA5E9]">Collective.</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Join the elite creator ecosystem.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Google Button */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center bg-white border border-sky-100 hover:bg-sky-50 text-slate-600 font-bold py-4 rounded-full transition-all duration-200 group text-[10px] uppercase tracking-widest shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-sky-50"></div>
                            </div>
                            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black">
                                <span className="px-4 bg-white text-slate-300">Or Access via</span>
                            </div>
                        </div>

                        {/* Email Button */}
                        <Link
                            href="/signup"
                            className="w-full flex items-center justify-center bg-[#0EA5E9] border border-transparent hover:bg-sky-600 text-white font-black py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest shadow-xl shadow-sky-100 group"
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
