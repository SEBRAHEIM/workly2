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
        <main className="min-h-screen bg-[#F3F0E9] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-500 hover:text-[#333333] transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E6E2D6]">
                    <div className="text-center mb-10">
                        <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#3E4C37] mb-3">
                            Join Workly
                        </h1>
                        <p className="text-gray-500 font-sans">
                            Choose how you want to continue
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Google Button */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-[#333333] font-medium py-3 rounded-xl transition-all duration-200 group"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Apple Button */}
                        <button
                            onClick={handleAppleLogin}
                            className="w-full flex items-center justify-center bg-black text-white hover:bg-gray-800 font-medium py-3 rounded-xl transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-3 mb-0.5" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                            </svg>
                            Continue with Apple
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-400 font-sans">Or continue with email</span>
                            </div>
                        </div>

                        {/* Email Button */}
                        <Link
                            href="/signup"
                            className="w-full flex items-center justify-center bg-[#F3F0E9] border border-transparent hover:border-[#D4C5A9] text-[#5B5040] hover:text-[#3E4C37] font-medium py-3 rounded-xl transition-all duration-200"
                        >
                            <Mail className="w-5 h-5 mr-3 text-[#5B5040]" />
                            Sign up with Email
                        </Link>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#3E4C37] font-semibold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
