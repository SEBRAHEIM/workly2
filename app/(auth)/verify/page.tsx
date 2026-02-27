'use client'

import { Suspense, useState, useEffect } from 'react'
import { verifyOtp, resendOtp } from '../actions'
import { useFormState } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const initialState = {
    error: '',
}

function VerifyContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''
    const type = (searchParams.get('type') as any) || 'signup'
    const [state, formAction] = useFormState(verifyOtp, initialState)

    const [countdown, setCountdown] = useState(0)
    const [isResending, setIsResending] = useState(false)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleResend = async () => {
        if (countdown > 0 || isResending) return

        setIsResending(true)
        const result = await resendOtp(email, type)
        setIsResending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Verification code resent!')
            setCountdown(60) // 1 minute delay
        }
    }

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-50 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-50 rounded-full blur-[80px] md:blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-60" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-sky-100/50 border border-sky-100 mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="font-sans font-black text-4xl text-slate-900 mb-3 tracking-tighter uppercase leading-[0.95]">
                            Identity <br /> <span className="text-[#0EA5E9]">Verify.</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Enter the 6-digit access code sent to <br /> <span className="text-slate-900 font-bold">{email}</span>
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
                                className="w-full rounded-2xl border border-sky-100 bg-sky-50/30 px-6 py-5 text-slate-900 text-center text-3xl tracking-[0.4em] font-sans font-black font-black focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all placeholder:tracking-normal"
                                placeholder="000000"
                            />
                        </div>
                        {state?.error && (
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{state.error}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#0EA5E9] px-4 py-4 text-white font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-100 active:scale-[0.98] transition-all duration-300 mt-4 shadow-lg shadow-sky-100"
                        >
                            Verify
                        </button>
                    </form>

                    {/* Junk Folder & Future Delivery Guide */}
                    <div className="mt-8 bg-sky-50/50 border border-sky-100 rounded-3xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                                <span className="text-[14px]">🔐</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-sky-800 uppercase tracking-widest mb-1">Finding the code</p>
                                <p className="text-[11px] font-medium text-sky-700/80 leading-relaxed">
                                    The verification code is sent from <strong>no-reply@workly.day</strong>. If you don't see it, please check your <strong>Junk/Spam</strong> folder.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 pt-4 border-t border-sky-100">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <span className="text-[14px]">💰</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Guaranteeing Future Payouts</p>
                                <p className="text-[11px] font-medium text-amber-700/80 leading-relaxed">
                                    We've also sent an <u>Inbox Guarantee</u> email from <strong>notifications@workly.day</strong>. Mark it as <strong>"Not Junk"</strong> to ensure you receive future payments!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center pt-8 border-t border-sky-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Code expired?{' '}
                            <button
                                onClick={handleResend}
                                disabled={countdown > 0 || isResending}
                                className="text-[#0EA5E9] hover:underline disabled:text-slate-300 disabled:no-underline"
                            >
                                {isResending ? 'Processing...' : countdown > 0 ? `Retry in ${countdown}s` : 'Request New Token'}
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
        <div className="min-h-screen bg-white">
            <Suspense fallback={<div className="flex items-center justify-center h-screen font-sans font-black font-black text-sky-400 animate-pulse uppercase tracking-widest">Initialising Verify Layer...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    )
}
