'use client'

import { useState } from 'react'
import { respondToOffer } from '../../actions'
import { Clock, MessageSquare, AlertCircle, Loader2, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AEDIcon from '@/app/components/AEDIcon'

interface ProjectEvent {
    id: string
    type: string
    payload: any
    created_at: string
}

interface NegotiationConsoleProps {
    projectId: string
    projectStatus: string
    currentPrice: number
    latestOffer?: {
        sender_id: string
        price: number
    }
    isActionRequired: boolean
    iAmSender: boolean
    events?: ProjectEvent[]
}

export default function NegotiationConsole({
    projectId,
    projectStatus,
    currentPrice,
    latestOffer,
    isActionRequired,
    iAmSender,
    events = []
}: NegotiationConsoleProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showTimeline, setShowTimeline] = useState(false)
    const router = useRouter()

    async function handleAccept() {
        if (!confirm(`Are you sure you want to accept the offer of AED ${latestOffer?.price}?`)) return

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('projectId', projectId)
            formData.append('action', 'accept')

            const result = await respondToOffer(formData) as any

            if (result && result.success) {
                // Force hard reload to ensure state update
                window.location.reload()
            } else {
                alert(result?.message || 'Failed to accept offer.')
                setIsSubmitting(false)
            }
        } catch (error) {
            console.error(error)
            alert('An unexpected error occurred.')
            setIsSubmitting(false)
        }
    }

    async function handleDecline() {
        if (!confirm('Are you sure you want to decline this offer? The project will be marked as declined.')) return

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('projectId', projectId)
            formData.append('action', 'decline')

            const result = await respondToOffer(formData) as any

            if (result && result.success) {
                window.location.reload()
            } else {
                alert(result?.message || 'Failed to decline offer.')
                setIsSubmitting(false)
            }
        } catch (error) {
            console.error(error)
            alert('An unexpected error occurred.')
            setIsSubmitting(false)
        }

    }

    return (
        <div className="relative z-10">
            {/* Compact Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-2 rounded-full bg-[#F3F0E9] mb-3">
                    <TrendingUp className="w-4 h-4 text-[#3E4C37]" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#3E4C37] mb-1">
                    AED {currentPrice || '0.00'}
                </h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    {projectStatus === 'requested' ? (currentPrice > 0 ? 'Proposed Price' : 'Waiting for offer') : 'Current Price'}
                </p>
            </div>

            {/* NEGOTIATION UI */}
            {isActionRequired && (
                <div className="space-y-3">
                    <div className="bg-[#3E4C37]/5 border border-[#3E4C37]/10 p-3 rounded-xl mb-4 text-center">
                        <p className="text-[10px] text-[#3E4C37] font-bold uppercase tracking-wider mb-1">Incoming Offer</p>
                        <p className="text-2xl font-bold text-[#3E4C37]">AED {latestOffer?.price || currentPrice}</p>
                    </div>

                    <button
                        onClick={handleAccept}
                        disabled={isSubmitting}
                        className="w-full bg-[#3E4C37] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#2e3b29] active:scale-95 transition-all shadow-lg shadow-[#3E4C37]/20 touch-manipulation disabled:opacity-50 flex justify-center items-center h-[44px]"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                            `Accept AED ${latestOffer?.price || currentPrice}`
                        )}
                    </button>

                    <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-gray-400">
                            <span className="px-2 bg-white">or counter</span>
                        </div>
                    </div>

                    <form action={async (formData) => {
                        setIsSubmitting(true)
                        formData.append('projectId', projectId)
                        formData.append('action', 'counter')
                        const result = await respondToOffer(formData) as any

                        if (result && result.success) {
                            window.location.reload()
                        } else {
                            alert(result?.message || 'Failed to submit offer.')
                            setIsSubmitting(false)
                        }
                    }}>
                        <textarea
                            name="notes"
                            placeholder="Add notes (optional)..."
                            className="w-full p-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#3E4C37]/20 focus:border-[#3E4C37] outline-none text-xs h-16 resize-none mb-2 bg-[#F3F0E9] font-medium"
                        ></textarea>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <AEDIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Amount"
                                    required
                                    className="w-full pl-8 pr-3 py-3 rounded-xl bg-white border border-gray-200 text-[#333333] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3E4C37]/20 focus:border-[#3E4C37] transition-all font-medium h-[44px]"
                                />
                            </div>
                            <button
                                disabled={isSubmitting}
                                className="px-4 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all disabled:opacity-50 h-[44px] flex justify-center items-center whitespace-nowrap"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Counter'}
                            </button>
                        </div>
                    </form>

                    <button
                        type="button"
                        onClick={handleDecline}
                        disabled={isSubmitting}
                        className="w-full text-red-400 font-bold text-[10px] uppercase tracking-wider py-2 hover:text-red-600 transition-colors flex items-center justify-center gap-1 mt-2"
                    >
                        {isSubmitting ? 'Processing...' : 'Decline Offer'}
                    </button>
                </div>
            )}

            {/* WAITING STATES (negotiating, pending, countered) */}
            {['negotiating', 'pending', 'countered'].includes(projectStatus) && iAmSender && (
                <div className="text-center py-6 bg-[#F3F0E9] rounded-xl border border-[#E6E2D6]">
                    <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="font-bold text-[#333333] text-sm">Offer Sent</p>
                    <p className="text-xs text-gray-500">Waiting for response...</p>
                </div>
            )}

            {projectStatus === 'requested' && (
                <div className="text-center py-6 bg-[#F3F0E9] rounded-xl border border-[#E6E2D6]">
                    <MessageSquare className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="font-bold text-[#333333] text-sm">Request Sent</p>
                    <p className="text-xs text-gray-500">
                        {currentPrice > 0 ? 'Waiting for creator to confirm' : 'Waiting for offer...'}
                    </p>
                </div>
            )}

            {/* CLOSED STATES */}
            {['accepted', 'agreed', 'in_progress'].includes(projectStatus) && (
                <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800 text-sm">Offer Accepted!</p>
                    <p className="text-xs text-green-600">Project is active.</p>
                </div>
            )}

            {['declined', 'cancelled'].includes(projectStatus) && (
                <div className="text-center py-6 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <p className="font-bold text-red-800 text-sm">Offer Declined</p>
                    <p className="text-xs text-red-600">This negotiation is closed.</p>
                </div>
            )}

            {/* TIMELINE */}
            {events && events.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => setShowTimeline(!showTimeline)}
                        className="w-full flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#3E4C37] transition-colors mb-4"
                    >
                        <span>History & Timeline</span>
                        <span>{showTimeline ? 'Hide' : 'Show'}</span>
                    </button>

                    {showTimeline && (
                        <div className="space-y-4 relative">
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                            {events.map((e, idx) => (
                                <div key={e.id || idx} className="relative pl-6">
                                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white 
                                        ${['accepted', 'agreed'].includes(e.type) ? 'bg-green-400' :
                                            ['declined', 'cancelled'].includes(e.type) ? 'bg-red-400' :
                                                ['offer_sent', 'counter_sent'].includes(e.type) ? 'bg-orange-400' : 'bg-gray-300'
                                        }`}
                                    />
                                    <p className="text-xs font-bold text-[#333333]">
                                        {e.type === 'offer_sent' ? 'Offer Sent' :
                                            e.type === 'counter_sent' ? 'Counter Offer' :
                                                e.type === 'accepted' ? 'Offer Accepted' :
                                                    e.type === 'declined' ? 'Offer Declined' :
                                                        e.type === 'message_sent' ? 'Message' : e.type}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                        {new Date(e.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
