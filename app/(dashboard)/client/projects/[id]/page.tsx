
'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { releaseFunds } from '../actions'
import { User, FileText, Check, MessageSquare, Clock, Shield, Briefcase, Download, AlertTriangle, ChevronRight, Star } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import { motion, AnimatePresence } from 'framer-motion'

import PaymentReceiptModal from '@/app/components/PaymentReceiptModal'
import PaymentButton from './PaymentButton'
import SubmissionReview from './SubmissionReview'
import ReportIssueForm from './ReportIssueForm'
import MarkdownRenderer from '@/app/components/MarkdownRenderer'

export default function ProjectPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ payment?: string, session_id?: string }>
}) {
    const { id: rawId } = use(params)
    const { payment, session_id } = use(searchParams)
    const id = rawId?.trim()
    const router = useRouter()

    const [project, setProject] = useState<any>(null)
    const [latestOffer, setLatestOffer] = useState<any>(null)
    const [events, setEvents] = useState<any[]>([])
    const [review, setReview] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push(`/login?next=/client/projects/${encodeURIComponent(id)}`)
                return
            }
            setUser(user)

            const [projectResponse, latestOfferResponse, eventsResponse, reviewResponse] = await Promise.all([
                supabase
                    .from('projects')
                    .select(`
                        *,
                        creator: creator_id(
                            full_name,
                            display_name,
                            username,
                            avatar_url,
                            level,
                            rating_avg
                        )
                    `)
                    .eq('id', id)
                    .single(),
                supabase
                    .from('offers')
                    .select('*')
                    .eq('project_id', id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle(),
                supabase
                    .from('project_events')
                    .select('*')
                    .eq('project_id', id)
                    .order('created_at', { ascending: true }),
                supabase
                    .from('reviews')
                    .select('*')
                    .eq('project_id', id)
                    .maybeSingle()
            ])

            if (projectResponse.error || !projectResponse.data) {
                router.push('/404')
                return
            }

            setProject(projectResponse.data)
            setLatestOffer(latestOfferResponse.data)
            setEvents(eventsResponse.data || [])
            setReview(reviewResponse.data)
            setLoading(false)

            // Lazy Auto-Release for Submitted projects (3-day rule)
            if (projectResponse.data.status === 'submitted' && projectResponse.data.submitted_at) {
                const submissionDate = new Date(projectResponse.data.submitted_at)
                const diffInDays = (Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24)
                if (diffInDays >= 3) {
                    await releaseFunds(projectResponse.data.id, projectResponse.data.current_price || 0, projectResponse.data.creator_id)
                }
            }
        }

        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
                <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    // Determine Display Price
    let displayPrice = project.current_price || 0

    const statusColors: any = {
        accepted: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', border: 'border-emerald-100' },
        in_progress: { bg: 'bg-sky-50', text: 'text-sky-600', dot: 'bg-sky-500', border: 'border-sky-100' },
        submitted: { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500', border: 'border-indigo-100' },
        completed: { bg: 'bg-slate-900', text: 'text-white', dot: 'bg-sky-400', border: 'border-slate-800' },
        declined: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', border: 'border-red-100' },
        cancelled: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-500', border: 'border-gray-100' },
        revision_requested: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500', border: 'border-amber-100' }
    }

    const currentStatus = statusColors[project.status] || { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-500', border: 'border-gray-100' }

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-20">
            <PaymentReceiptModal
                amount={displayPrice}
                date={new Date().toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
                projectName={project.title}
                transactionId={session_id || 'LOCAL-SYNC'}
                showReceipt={payment === 'success'}
                clientName={user.user_metadata?.full_name}
                clientEmail={user.email}
                creatorName={project?.creator?.full_name || project?.creator?.display_name}
            />

            {/* Premium Navigation Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
                            <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Project Control</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border ${currentStatus.bg} ${currentStatus.border} ${currentStatus.text} flex items-center gap-2 shadow-sm transition-all duration-300`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {payment === 'success' || (project.status === 'accepted' && project.funds_status === 'pending') ? 'Secured' :
                                project.status === 'revision_requested' ? 'Revision requested' :
                                    project.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* Left Column (8 units) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Hero Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <div className="relative bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <AEDIcon className="w-40 h-40 text-slate-900" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-sky-500 mb-4 font-black text-[10px] uppercase tracking-[0.2em]">
                                        <div className="w-4 h-[1px] bg-sky-500/30"></div>
                                        Active Brief
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 mb-6 leading-[1.1] tracking-tighter uppercase" dir="auto">
                                        {project.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden ring-4 ring-white shadow-md">
                                                {project?.creator?.avatar_url ? (
                                                    <img src={project.creator.avatar_url} alt="Creator" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-sky-50">
                                                        <User className="w-5 h-5 text-sky-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Creator</p>
                                                <p className="text-sm font-bold text-slate-900">{project?.creator?.display_name || project?.creator?.full_name}</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-[1px] bg-slate-100"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Model</p>
                                            <p className="text-sm font-bold text-slate-900 uppercase">{project.pricing_type} Package</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Requirements */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-sky-500" />
                                Project Briefing
                            </h2>
                            <div className="prose prose-slate max-w-none prose-sm">
                                <MarkdownRenderer content={project.description} className="text-slate-600 leading-relaxed text-base" />
                            </div>

                            {(project.file_urls?.length > 0 || project.file_url) && (
                                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                                    {(project.file_urls || [project.file_url]).map((url: string, idx: number) => (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 hover:bg-white hover:border-sky-200 hover:shadow-md transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <Download className="w-5 h-5 text-sky-500" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource {idx + 1}</p>
                                                <p className="text-xs font-bold text-slate-900">View Requirement</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (4 units) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Financial Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm group-hover:blur-0 transition-all duration-700">
                                <AEDIcon className="w-32 h-32 text-sky-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Financial Trust</span>
                                    </div>
                                    {project.due_date && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                                            <Clock className="w-3.5 h-3.5 text-rose-500" />
                                            {new Date(project.due_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 mb-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Contract Value</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl md:text-5xl font-sans font-black tracking-tighter">AED {displayPrice}</span>
                                        <span className="text-xs font-bold text-sky-400 tracking-widest uppercase">Escrowed</span>
                                    </div>
                                </div>

                                {/* Dynamic Action States */}
                                <AnimatePresence mode="wait">
                                    {/* Secured/Pending State */}
                                    {payment === 'success' && project.funds_status === 'pending' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-slate-900 animate-spin" />
                                                </div>
                                                <p className="text-sm font-bold uppercase tracking-widest leading-none">Verifying Network...</p>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                Funds are moving. Your workspace will activate automatically in a moment.
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Active Working State */}
                                    {(project.funds_status === 'escrow' || project.status === 'in_progress') && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-6 bg-sky-500/10 border border-sky-500/20 rounded-3xl"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/40">
                                                    <Shield className="w-5 h-5 text-slate-900" />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-widest leading-none">Work Secured</p>
                                            </div>
                                            <p className="text-xs text-sky-100/60 leading-relaxed mb-4">
                                                Creator is currently working on your brief. Communication remains through the platform.
                                            </p>
                                            <div className="py-3 bg-white/5 rounded-xl text-center">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected Delivery</p>
                                                <p className="text-xs font-bold">{project.due_date ? new Date(project.due_date).toLocaleDateString() : 'Direct'}</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Review Needed State */}
                                    {(project.status === 'submitted' || (project.status === 'completed' && !review)) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <SubmissionReview
                                                projectId={project.id}
                                                creatorId={project.creator_id}
                                                creatorName={project?.creator?.display_name || project?.creator?.full_name}
                                                currentPrice={displayPrice}
                                                submissionUrl={project.submission_url}
                                                submissionNotes={project.submission_notes}
                                                revisionsTotal={project.revisions_total || 0}
                                                revisionsUsed={project.revisions_used || 0}
                                                initialIsCompleted={project.status === 'completed'}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Safety & Report Card */}
                        {['in_progress', 'submitted', 'revision_requested'].includes(project.status) && (
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex flex-col items-center">
                                <AlertTriangle className="w-8 h-8 text-rose-500/40 mb-4" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Security Policy</h3>
                                <p className="text-[10px] text-slate-500 text-center leading-relaxed px-4 mb-6 italic">
                                    Payments are protected by Workly Escrow. If there is a dispute, our moderation team will intervene.
                                </p>
                                <ReportIssueForm projectId={project.id} />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
