'use client'

import { Suspense } from 'react'
import { verifyOtp } from '../actions'
import { useFormState } from 'react-dom'
import { useSearchParams } from 'next/navigation'

const initialState = {
    error: '',
}

function VerifyContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''
    const [state, formAction] = useFormState(verifyOtp, initialState)

    return (
        <main className="min-h-screen bg-[#F3F0E9] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E6E2D6]">
                    <div className="text-center mb-10">
                        <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#3E4C37] mb-3">
                            Check your inbox
                        </h1>
                        <p className="text-gray-500 font-sans">
                            We've sent a 6-digit code to <br /> <span className="text-[#333333] font-medium">{email}</span>
                        </p>
                    </div>

                    <form action={formAction} className="flex flex-col space-y-4">
                        <input type="hidden" name="email" value={email} />
                        <div>
                            <input
                                id="token"
                                name="token"
                                type="text"
                                required
                                pattern="[0-9]{6}"
                                maxLength={6}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-[#3E4C37]/20 focus:border-[#3E4C37] transition-all placeholder:tracking-normal"
                                placeholder="000000"
                            />
                        </div>
                        {state?.error && (
                            <p className="text-red-500 text-sm text-center">{state.error}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#3E4C37] px-4 py-3 text-white font-medium hover:bg-[#2e3b29] transition-colors shadow-lg mt-2"
                        >
                            Verify
                        </button>
                    </form>

                    <div className="mt-8 text-center bg-gray-50 -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 p-6 rounded-b-3xl border-t border-gray-100">
                        <p className="text-sm text-gray-400">
                            Didn't receive code?{' '}
                            <button className="text-[#3E4C37] font-semibold hover:underline">
                                Resend
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function Verify() {
    return (
        <div className="min-h-screen bg-[#F3F0E9]">
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    )
}
