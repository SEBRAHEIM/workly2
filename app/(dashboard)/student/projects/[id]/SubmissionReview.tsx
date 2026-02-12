'use client'

import { useState } from 'react'
import { Check, Download, AlertCircle, RefreshCw, ChevronUp } from 'lucide-react'
import { releaseFunds, requestRevision } from '../actions' // Import server actions
import { toast } from 'sonner'

import ReviewForm from './ReviewForm'

interface SubmissionReviewProps {
    projectId: string
    creatorId: string
    creatorName?: string
    currentPrice: number
    submissionUrl: string | null
    submissionNotes: string | null
    revisionsTotal: number
    revisionsUsed: number
    initialIsCompleted?: boolean
}

export default function SubmissionReview({
    projectId,
    creatorId,
    creatorName = 'the Creator',
    currentPrice,
    submissionUrl,
    submissionNotes,
    revisionsTotal,
    revisionsUsed,
    initialIsCompleted = false
}: SubmissionReviewProps) {
    const [isRevising, setIsRevising] = useState(false)
    const [revisionNotes, setRevisionNotes] = useState('')
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted)
    const [showReview, setShowReview] = useState(false)

    const handleApprove = async () => {
        if (!confirming) {
            setConfirming(true)
            setTimeout(() => setConfirming(false), 4000)
            return
        }

        setLoading(true)
        try {
            const result = await releaseFunds(projectId, currentPrice, creatorId)
            if (result && (result as any).error) {
                toast.error((result as any).error)
                setLoading(false)
                setConfirming(false)
            } else {
                toast.success('Project approved and funds released!')
                setIsCompleted(true)
                setShowReview(true)
                setLoading(false)
            }
        } catch (e: any) {
            toast.error('Error approving project: ' + e.message)
            setLoading(false)
            setConfirming(false)
        }
    }

    const handleRequestRevision = async () => {
        if (!revisionNotes.trim()) {
            toast.error('Please provide notes for the revision.')
            return
        }

        setLoading(true)
        try {
            const result = await requestRevision(projectId, revisionNotes)
            if (result && result.error) {
                toast.error(result.error)
            } else {
                toast.success('Revision requested sent to creator.')
                setIsRevising(false)
            }
        } catch (e: any) {
            toast.error('Error requesting revision: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    // If completed and showReview is true, show the form
    if (isCompleted && showReview) {
        return (
            <ReviewForm
                projectId={projectId}
                creatorName={creatorName}
                onSuccess={() => setShowReview(false)}
            />
        )
    }

    // If completed but review dismissed/done, show a success message
    if (isCompleted) {
        return (
            <div className="bg-green-50 border border-green-100 rounded-3xl p-8 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-1 leading-tight uppercase tracking-tighter">Project Completed</h3>
                <p className="text-slate-500 text-sm font-medium">Transfer successful. Thank you for using Workly!</p>
            </div>
        )
    }

    return (
        <div className="w-full relative">
            <div className="text-center pt-2">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Check className="w-8 h-8 text-purple-600" />
                </div>

                <h3 className="font-serif font-bold text-2xl text-[#1E293B] mb-2 uppercase tracking-tight">Work Submitted</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto font-medium">
                    The creator has delivered the work. Please review it casually before approving.
                </p>

                {/* Submission Details Card */}
                <div className="bg-[#F9FAFB] rounded-xl p-4 border border-gray-100 text-left mb-6">
                    {submissionUrl ? (
                        <a
                            href={submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group mb-3"
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors shrink-0">
                                <Download className="w-5 h-5 text-purple-700" />
                            </div>
                            <div className="overflow-hidden min-w-0">
                                <p className="font-bold text-[#1E293B] text-sm truncate">Download Deliverable</p>
                                <p className="text-xs text-gray-400 truncate block">{submissionUrl}</p>
                            </div>
                        </a>
                    ) : (
                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100 mb-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 shrink-0" />
                            <p className="text-sm text-yellow-700 font-medium">No direct link provided.</p>
                        </div>
                    )}

                    {submissionNotes && (
                        <div className="pl-2 border-l-2 border-purple-200">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Creator Notes</p>
                            <p className="text-sm text-gray-600 italic" dir="auto">"{submissionNotes}"</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {!isRevising ? (
                    <div className="space-y-3">
                        <button
                            onClick={handleApprove}
                            disabled={loading}
                            className={`w-full font-black uppercase tracking-widest text-[10px] py-4 rounded-xl text-white active:scale-95 transition-all shadow-lg flex items-center justify-center
                                ${confirming ? 'bg-green-600 shadow-green-200' : 'bg-[#0EA5E9] shadow-sky-200'}`}
                        >
                            {loading && (
                                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                            )}
                            {loading ? 'Processing...' : confirming ? 'Confirm Approval?' : 'Approve & Release Funds'}
                        </button>

                        {revisionsUsed < revisionsTotal ? (
                            <button
                                onClick={() => setIsRevising(true)}
                                disabled={loading}
                                className="w-full font-black uppercase tracking-widest text-[10px] py-3 rounded-xl border transition-all flex items-center justify-center bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Request Changes
                            </button>
                        ) : (
                            <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-bold text-red-600 uppercase tracking-tight">Revision limit reached</span>
                            </div>
                        )}

                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] text-center mt-2 ${revisionsUsed >= revisionsTotal ? 'text-red-400' : 'text-gray-400'}`}>
                            {revisionsUsed} of {revisionsTotal} revisions used
                        </p>
                    </div>
                ) : (
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-black text-orange-800 text-[10px] uppercase tracking-widest flex items-center">
                                <RefreshCw className="w-4 h-4 mr-2" /> Request Revision
                            </h4>
                            <button onClick={() => setIsRevising(false)} className="text-gray-400 hover:text-gray-600">
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        </div>

                        <textarea
                            placeholder="Describe what changes you need..."
                            dir="auto"
                            className="w-full p-3 rounded-lg border border-orange-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none h-24 mb-3 bg-white"
                            value={revisionNotes}
                            onChange={(e) => setRevisionNotes(e.target.value)}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={handleRequestRevision}
                                disabled={loading}
                                className="flex-1 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] py-2 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                {loading ? 'Sending...' : 'Send Request'}
                            </button>
                            <button
                                onClick={() => setIsRevising(false)}
                                disabled={loading}
                                className="px-4 bg-white text-gray-500 font-black uppercase tracking-widest text-[10px] py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <p className="text-[9px] font-black tracking-widest text-gray-300 mt-4 text-center uppercase">
                    Flat 20% Workly commission applies.
                </p>
            </div>
        </div>
    )
}
