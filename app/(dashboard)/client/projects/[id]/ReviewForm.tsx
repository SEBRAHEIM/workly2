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
        <div className="bg-white rounded-3xl p-8 border border-sky-50 shadow-xl shadow-sky-100/50 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-100">
                    <Star className="w-8 h-8 text-[#0EA5E9] fill-[#0EA5E9]" />
                </div>
                <h3 className="font-serif font-black text-2xl text-slate-900 mb-2 uppercase tracking-tight">Review {creatorName}</h3>
                <p className="text-slate-500 text-sm font-medium">Your feedback helps maintain the high quality of our platform.</p>
            </div>

            <div className="space-y-8">
                {/* Star Rating */}
                <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0EA5E9] mb-4">Select Rating (Mandatory)</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-all transform active:scale-90 outline-none"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={42}
                                    className={`${(hover || rating) >= star ? 'fill-[#0EA5E9] text-[#0EA5E9]' : 'text-slate-200 fill-transparent'} transition-colors duration-200`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment Area */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-[#0EA5E9]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Experience (Optional)</span>
                    </div>
                    <textarea
                        placeholder="Tell other clients about the quality of work and communication..."
                        dir="auto"
                        className="w-full p-5 rounded-2xl border border-slate-100 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-[#0EA5E9] outline-none h-32 bg-slate-50/50 transition-all placeholder:text-slate-300"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || rating === 0}
                    className="w-full bg-[#0EA5E9] text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#0284c7] transition-all shadow-xl shadow-sky-100 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Submit Review
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
