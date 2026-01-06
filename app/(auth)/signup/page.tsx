'use client'

import { signup } from '../actions'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const initialState = {
    error: '',
}

export default function Signup() {
    const [state, formAction] = useFormState(signup, initialState)

    return (
        <main className="min-h-screen bg-[#F3F0E9] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    href="/join"
                    className="inline-flex items-center text-gray-500 hover:text-[#333333] transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E6E2D6]">
                    <div className="text-center mb-10">
                        <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#3E4C37] mb-3">
                            Create Account
                        </h1>
                        <p className="text-gray-500 font-sans">
                            Sign up with your email to get started
                        </p>
                    </div>

                    <form action={formAction} className="flex flex-col space-y-4">
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email address"
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#3E4C37]/20 focus:border-[#3E4C37] transition-all"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#3E4C37]/20 focus:border-[#3E4C37] transition-all"
                            />
                        </div>
                        {state?.error && (
                            <p className="text-red-500 text-sm">{state.error}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#3E4C37] px-4 py-3 text-white font-medium hover:bg-[#2e3b29] transition-colors shadow-lg mt-2"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-8 text-center bg-gray-50 -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 p-6 rounded-b-3xl border-t border-gray-100">
                        <p className="text-sm text-gray-500">
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
