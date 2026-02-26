'use client'

import { useActionState, useEffect, useRef } from 'react'
import { LifeBuoy, Send, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { submitSupportTicket } from '@/app/actions/support'
import { toast } from 'sonner'

export default function SupportForm() {
    const [state, action, isPending] = useActionState(submitSupportTicket, null)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success) {
            toast.success('Support request submitted! We\'ll contact you via email soon.')
            formRef.current?.reset()
        }
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    if (state?.success) {
        return (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#F0F9FF] shadow-sm text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-sans font-black text-[#1E293B] mb-4 uppercase tracking-tighter">Request Received</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
                    Thank you for reaching out. We've received your ticket and our team will get back to you via email as soon as possible.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-[#0EA5E9] font-black uppercase tracking-widest text-xs hover:text-sky-600 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                    Submit another request
                    <ArrowRight size={14} />
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#F0F9FF] shadow-sm">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9]">
                    <LifeBuoy size={28} />
                </div>
                <div>
                    <h3 className="text-2xl font-sans font-black text-[#1E293B] uppercase tracking-tighter">Submit a Ticket</h3>
                    <p className="text-sm text-gray-500 font-medium">Briefly describe your issue and we'll help you out.</p>
                </div>
            </div>

            <form ref={formRef} action={action} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0EA5E9] block ml-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        required
                        placeholder="e.g. Issue with payment, profile update help..."
                        className="w-full bg-[#F9F8F4] border border-[#F0F9FF] rounded-2xl py-5 px-6 text-[#1E293B] font-bold focus:outline-none focus:border-[#0EA5E9] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-medium text-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0EA5E9] block ml-1">
                        Detailed Message
                    </label>
                    <textarea
                        name="message"
                        required
                        rows={6}
                        placeholder="Please provide as much detail as possible so we can help you faster..."
                        className="w-full bg-[#F9F8F4] border border-[#F0F9FF] rounded-2xl py-5 px-6 text-[#1E293B] font-bold focus:outline-none focus:border-[#0EA5E9] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-medium text-sm resize-none"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#0EA5E9] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                Send Message
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">
                        Our support team typically responds within 24 hours.
                    </p>
                </div>
            </form>
        </div>
    )
}
