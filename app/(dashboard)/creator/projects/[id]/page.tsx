
'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { submitWork } from '../actions'
import { User, FileText, Check, Clock, Shield, Briefcase, Upload, AlertCircle, ChevronLeft, Zap } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import Link from 'next/link'
import SubmitWorkForm from './SubmitWorkForm'
import MarkdownRenderer from '@/app/components/MarkdownRenderer'
import EarningsBreakdown from '@/app/components/EarningsBreakdown'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreatorProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = use(params)
    const id = rawId?.trim()
    const router = useRouter()
    const supabase = createClient()

    const [project, setProject] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push(`/login?next=/creator/projects/${encodeURIComponent(id)}`)
                return
            }
            setUser(user)

            const { data: projectResponse } = await supabase
                .from('projects')
                .select(`
                    *,
                    client:client_id (
                        full_name,
                        display_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('id', id)
                .single()

            if (!projectResponse || projectResponse.creator_id !== user.id) {
                router.push('/404')
                return
            }

            setProject(projectResponse)
            setLoading(false)

            // Auto-transition 'requested' -> 'negotiating' and mark as read
            if (projectResponse.status === 'requested' || !projectResponse.is_read) {
                const updateData: any = { is_read: true }
                if (projectResponse.status === 'requested') updateData.status = 'negotiating'

                await supabase.from('projects').update(updateData).eq('id', id)
            }
        }
        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
                <div className="w-12 h-12 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
        )
    }

    const isRevision = project.status === 'revision_requested'
    const deadlineStr = isRevision ? project.revision_due_date : project.due_date
    const dueDate = deadlineStr ? new Date(deadlineStr) : null
    const daysLeft = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
    const isOverdue = daysLeft < 0

    const statusColors: any = {
        in_progress: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', border: 'border-emerald-100' },
        agreed: { bg: 'bg-sky-50', text: 'text-sky-600', dot: 'bg-sky-500', border: 'border-sky-100' },
        submitted: { bg: 'bg-slate-900', text: 'text-white', dot: 'bg-sky-400', border: 'border-slate-800' },
        completed: { bg: 'bg-slate-900', text: 'text-slate-400', dot: 'bg-slate-500', border: 'border-slate-800' },
        revision_requested: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500', border: 'border-amber-100' },
        negotiating: { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500', border: 'border-indigo-100' }
    }

    const currentStatus = statusColors[project.status] || { bg: 'bg-white', text: 'text-slate-400', dot: 'bg-slate-200', border: 'border-slate-100' }

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-20">
            {/* Project Terminal Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/creator/requests"
                            className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl border border-slate-200 transition-all text-slate-500 hover:text-slate-900"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex w-8 h-8 rounded-lg bg-slate-900 items-center justify-center shadow-lg shadow-slate-900/20">
                                <Zap className="w-4 h-4 text-sky-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter hidden sm:block">Creator Terminal</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-full border ${currentStatus.bg} ${currentStatus.border} ${currentStatus.text} flex items-center gap-2 shadow-sm transition-all duration-300`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} ${project.status === 'in_progress' ? 'animate-pulse' : ''}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                {project.status.replace('_', ' ')}
                            </span>
                        </div>
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
                        {/* Title Section */}
                        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <Briefcase className="w-48 h-48 text-slate-900" />
                            </div>

                            <div className="relative z-10">
                                <h1 className="text-4xl md:text-5xl font-sans font-black font-black text-slate-900 mb-8 uppercase tracking-tighter leading-tight" dir="auto">
                                    {project.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden ring-4 ring-white shadow-md">
                                            {project.client.avatar_url ? (
                                                <img src={project.client.avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-50 uppercase font-black text-slate-300 text-xs">
                                                    {(project.client.display_name || project.client.full_name || 'U').charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Operator</p>
                                            <p className="text-sm font-bold text-slate-900">{project.client.display_name || project.client.full_name}</p>
                                        </div>
                                    </div>

                                    <div className="h-8 w-[1px] bg-slate-100"></div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref No.</p>
                                        <p className="text-sm font-mono font-bold text-slate-600 uppercase tracking-tighter">
                                            #{project.id.slice(0, 8)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Briefing Card */}
                        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200/60 shadow-sm">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-sky-500" />
                                Mission Details
                            </h2>
                            <div className="prose prose-slate max-w-none prose-sm">
                                <MarkdownRenderer content={project.description} className="text-slate-600 leading-relaxed text-base" />
                            </div>

                            {project.file_url && (
                                <div className="mt-12 pt-8 border-t border-slate-100">
                                    <a
                                        href={project.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 p-5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-sky-200 hover:shadow-xl rounded-2xl transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <Upload className="w-6 h-6 text-sky-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Document</p>
                                            <p className="text-sm font-bold text-slate-900">Download Requirement File</p>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (4 units) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Financial Hub */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <AEDIcon className="w-32 h-32 text-sky-400" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-sky-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                            {project.funds_status === 'escrow' ? 'Secured in Escrow' : 'Payment Awaited'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Project Payout</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-sans font-black font-black">AED {project.current_price}</span>
                                    </div>
                                </div>

                                <EarningsBreakdown price={Number(project.current_price)} dark compact />

                                {project.funds_status !== 'escrow' && (
                                    <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl">
                                        <div className="flex items-center gap-3 text-rose-400 mb-2">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">Warning</span>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed">
                                            Do not initiate work. Workspace is awaiting client deposit.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delivery Control */}
                        {(project.status === 'in_progress' || project.status === 'revision_requested') && project.funds_status === 'escrow' && (
                            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-lg relative overflow-hidden">
                                <div className={`flex items-center gap-3 mb-10 ${isOverdue ? 'text-rose-600' : 'text-sky-600'}`}>
                                    <div className={`w-10 h-10 rounded-xl ${isOverdue ? 'bg-rose-50' : 'bg-sky-50'} flex items-center justify-center`}>
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {isRevision ? 'Revision Deadline' : 'Active Deadline'}
                                        </p>
                                        <p className="text-sm font-bold">
                                            {isOverdue ? `Overdue by ${Math.abs(daysLeft)} Days` : `${daysLeft} Days Remaining`}
                                        </p>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isRevision && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-amber-50 border border-amber-100 rounded-3xl p-6 mb-8"
                                        >
                                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">Revision Directive</p>
                                            <p className="text-xs text-amber-800 leading-relaxed italic mb-4" dir="auto">"{project.revision_notes}"</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-1 bg-amber-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400"
                                                        style={{ width: `${(project.revisions_used / (project.revisions_total || 1)) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-amber-400 uppercase">
                                                    {project.revisions_used}/{project.revisions_total || '∞'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                                        <h3 className="text-lg font-black text-slate-900 mb-2">Deliver Output</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-8">
                                            Upload your finalized work. The platform will secure your earnings upon client acceptance.
                                        </p>
                                        <SubmitWorkForm projectId={project.id} projectTitle={project.title} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submitted Observer */}
                        {project.status === 'submitted' && (
                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white text-center shadow-xl">
                                <div className="w-16 h-16 bg-sky-500 flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-lg shadow-sky-500/20">
                                    <Check className="w-8 h-8 text-slate-900" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Mission Transmitted</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Your work is under client review. Funds will be released to your wallet automatically upon acceptance or after 72 hours.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
