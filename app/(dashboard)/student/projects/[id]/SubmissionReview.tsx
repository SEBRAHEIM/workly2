'use client'

import { useState } from 'react'
import { Check, Download, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { releaseFunds, requestRevision } from '../actions' // Import server actions
import { toast } from 'sonner'

interface SubmissionReviewProps {
    projectId: string
    creatorId: string
    currentPrice: number
    submissionUrl: string | null
    submissionNotes: string | null
    revisionsTotal: number
    revisionsUsed: number
}

export default function SubmissionReview({
    projectId,
    creatorId,
    currentPrice,
    submissionUrl,
    submissionNotes,
    revisionsTotal,
    revisionsUsed
}: SubmissionReviewProps) {
    const [isRevising, setIsRevising] = useState(false)
    const [revisionNotes, setRevisionNotes] = useState('')
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        if (!confirming) {
            setConfirming(true)
            // Auto-cancel confirmation after 4 seconds
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
                // Keep loading true for revalidation
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

    return (
        <div className="w-full relative">
            {/* No outer card styles (border/shadow) to avoid double-card look */}

            <div className="text-center pt-2">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Check className="w-8 h-8 text-purple-600" />
                </div>

                <h3 className="font-serif font-bold text-2xl text-[#1E293B] mb-2">Work Submitted</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
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
                            <p className="text-sm text-yellow-700">No direct link provided.</p>
                        </div>
                    )}

                    {submissionNotes && (
                        <div className="pl-2 border-l-2 border-purple-200">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Creator Notes</p>
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
                            className={`w-full font-bold py-4 rounded-xl text-white active:scale-95 transition-all shadow-lg flex items-center justify-center
                                ${confirming ? 'bg-green-600 shadow-green-200' : 'bg-[#0EA5E9] shadow-sky-200'}`}
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                            ) : null}
                            {loading ? 'Processing...' : confirming ? 'Confirm Approval?' : 'Approve & Release Funds'}
                        </button>

                        {revisionsUsed < revisionsTotal ? (
                            <button
                                onClick={() => setIsRevising(true)}
                                disabled={loading}
                                className="w-full font-bold py-3 rounded-xl border transition-all flex items-center justify-center text-sm bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Request Changes
                            </button>
                        ) : (
                            <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-bold text-red-600">Revision limit reached</span>
                            </div>
                        )}

                        <p className={`text-[10px] font-bold uppercase tracking-widest text-center mt-2 ${revisionsUsed >= revisionsTotal ? 'text-red-400' : 'text-gray-400'}`}>
                            {revisionsUsed} of {revisionsTotal} revisions used
                        </p>
                    </div>
                ) : (
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-orange-800 text-sm flex items-center">
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
                                className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
                            >
                                {loading ? 'Sending...' : 'Send Request'}
                            </button>
                            <button
                                onClick={() => setIsRevising(false)}
                                disabled={loading}
                                className="px-4 bg-white text-gray-500 font-bold py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <p className="text-[10px] text-gray-300 mt-4 text-center">
                    Flat 20% Workly commission applies.
                </p>
            </div>
        </div>
    )
}
