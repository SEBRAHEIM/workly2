'use client'

import { useState } from 'react'
import { Star, MessageSquare, Send, RefreshCw } from 'lucide-react'
import { submitReview } from '../actions'
import { toast } from 'sonner'

interface ReviewFormProps {
    projectId: string
    creatorName: string
    onSuccess: () => void
}

export default function ReviewForm({ projectId, creatorName, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a star rating.')
            return
        }

        setLoading(true)
        try {
            const result = await submitReview(projectId, rating, comment)
            if (result && result.error) {
                toast.error(result.error)
            } else {
                toast.success('Thank you for your feedback!')
                onSuccess()
            }
        } catch (e: any) {
            toast.error('Error submitting review: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

            <div className="text-center mb-10 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-200 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Star className="w-10 h-10 text-white fill-white shadow-sm" />
                </div>
                <h3 className="font-sans font-black text-3xl text-slate-900 mb-3 tracking-tight">Review {creatorName}</h3>
                <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">Your feedback helps maintain the high quality of our platform.</p>
            </div>

            <div className="space-y-10 relative z-10">
                {/* Star Rating */}
                <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 rounded-full mb-6 border border-sky-100/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0EA5E9]">Select Rating</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    </div>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-all transform hover:scale-125 active:scale-90 outline-none group"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={48}
                                    className={`${(hover || rating) >= star ? 'fill-[#0EA5E9] text-[#0EA5E9]' : 'text-slate-100 fill-slate-50'} transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-md`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment Area */}
                <div className="group">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-[#0EA5E9]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Experience (Optional)</span>
                    </div>
                    <textarea
                        placeholder="Tell other clients about the quality of work and communication..."
                        dir="auto"
                        className="w-full p-6 rounded-[1.5rem] border border-slate-100 text-slate-900 text-base focus:ring-[12px] focus:ring-sky-500/5 focus:border-[#0EA5E9] outline-none h-40 bg-slate-50/30 transition-all placeholder:text-slate-300 font-medium leading-relaxed resize-none shadow-inner"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || rating === 0}
                    className="w-full bg-[#0EA5E9] text-white font-black uppercase tracking-[0.25em] text-[10px] py-6 rounded-3xl flex items-center justify-center gap-4 hover:bg-[#0284c7] transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {loading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span className="relative z-10">Submit Review</span>
                            <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
