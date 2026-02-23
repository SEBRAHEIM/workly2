
'use client'

import { useState } from 'react'
import { Check, Download, AlertCircle, RefreshCw, ChevronUp, Shield, Star, MessageSquare, Upload } from 'lucide-react'
import { releaseFunds, requestRevision } from '../actions'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

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

    if (isCompleted && showReview) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <ReviewForm
                    projectId={projectId}
                    creatorName={creatorName}
                    onSuccess={() => setShowReview(false)}
                />
            </motion.div>
        )
    }

    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-500/20 text-center flex flex-col items-center"
            >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-black mb-2 uppercase tracking-tight">Project Completed</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed">
                    Transfer successful. The creator has received their earnings.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Update</p>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">Review Work Output</h3>
                    </div>
                </div>

                {submissionUrl ? (
                    <a
                        href={submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-200 hover:shadow-lg transition-all group mb-6"
                    >
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Download className="w-7 h-7 text-indigo-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Final Result</p>
                            <p className="font-bold text-slate-900 truncate">Access Deliverable</p>
                        </div>
                    </a>
                ) : (
                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-sm font-bold text-amber-700 leading-relaxed">System Note: No direct file link attached. Check creator notes for details.</p>
                    </div>
                )}

                {submissionNotes && (
                    <div className="mb-8 p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <MessageSquare className="w-3 h-3" />
                            Creator Comments
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed italic" dir="auto">"{submissionNotes}"</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!isRevising ? (
                        <motion.div
                            key="actions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={handleApprove}
                                disabled={loading}
                                className={`w-full font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95
                                    ${confirming ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-900 shadow-slate-900/20 group hover:bg-[#0EA5E9] hover:shadow-[#0EA5E9]/20'}`}
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : confirming ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Shield className="w-4 h-4 group-hover:animate-pulse" />
                                )}
                                {loading ? 'Processing...' : confirming ? 'Confirm Acceptance' : 'Accept & Release Earnings'}
                            </button>

                            {revisionsUsed < revisionsTotal ? (
                                <button
                                    onClick={() => setIsRevising(true)}
                                    disabled={loading}
                                    className="w-full font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Request Course Correction
                                </button>
                            ) : (
                                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-center gap-2 text-rose-500">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Revision Limit Reached</span>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-2 opacity-40">
                                <div className="h-[1px] w-8 bg-slate-900"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                                    {revisionsUsed} / {revisionsTotal} Credits Used
                                </span>
                                <div className="h-[1px] w-8 bg-slate-900"></div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="revision-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-amber-50 rounded-3xl p-8 border border-amber-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-black text-amber-600 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" /> Revision Directive
                                </h4>
                                <button onClick={() => setIsRevising(false)} className="text-amber-400 hover:text-amber-600">
                                    <ChevronUp className="w-5 h-5" />
                                </button>
                            </div>

                            <textarea
                                placeholder="Detail precisely what changes are required for project success..."
                                dir="auto"
                                className="w-full p-5 rounded-2xl border border-amber-200 text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none h-32 mb-6 bg-white transition-all shadow-inner"
                                value={revisionNotes}
                                onChange={(e) => setRevisionNotes(e.target.value)}
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={handleRequestRevision}
                                    disabled={loading}
                                    className="flex-1 bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 active:scale-95"
                                >
                                    {loading ? 'Transmitting...' : 'Transmit Revision Brief'}
                                </button>
                                <button
                                    onClick={() => setIsRevising(false)}
                                    disabled={loading}
                                    className="px-6 bg-white text-slate-500 font-black uppercase tracking-widest text-[10px] py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Abort
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
