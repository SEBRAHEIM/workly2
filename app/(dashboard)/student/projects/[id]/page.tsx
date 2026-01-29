
import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { releaseFunds } from '../actions'
import { User, FileText, Check, MessageSquare, Clock, Shield, Briefcase, Download, AlertTriangle } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'

import PaymentReceiptModal from './PaymentReceiptModal'
import PaymentButton from './PaymentButton'
import SubmissionReview from './SubmissionReview'
import ReportIssueForm from './ReportIssueForm'
import MarkdownRenderer from '@/app/components/MarkdownRenderer'

export default async function ProjectPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ payment?: string, session_id?: string }>
}) {
    const { id: rawId } = await params
    const id = rawId?.trim()
    const { payment, session_id } = await searchParams

    if (!id || id.length > 50) notFound()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect(`/login?next=/student/projects/${encodeURIComponent(id)}`)
    }

    // 1. Fetch all data in parallel
    const [projectResponse, latestOfferResponse, eventsResponse] = await Promise.all([
        supabase
            .from('projects')
            .select(`
                *,
                creator: creator_id(
                    full_name,
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
            .order('created_at', { ascending: true })
    ])

    const { data: project, error: projectError } = projectResponse
    const { data: latestOffer } = latestOfferResponse
    const { data: events } = eventsResponse

    if (projectError || !project) notFound()
    if (project.student_id !== user.id) notFound()

    // Determine Display Price (with fallback for existing projects)
    let displayPrice = project.current_price || 0
    if (displayPrice === 0 && (project.pricing_type === 'fixed' || project.pricing_type === 'packages')) {
        const { data: service } = await supabase
            .from('creator_services')
            .select('*')
            .eq('creator_id', project.creator_id)
            .eq('category_slug', project.current_terms?.category)
            .single()

        if (service) {
            if (project.pricing_type === 'fixed') {
                displayPrice = service.base_price || 0
            } else if (project.pricing_type === 'packages' && project.current_terms?.tier) {
                const pkg = service.service_packages?.[project.current_terms.tier]
                if (pkg) displayPrice = pkg.price || 0
            }
        }
    }

    // Lazy Auto-Release for Submitted projects (3-day rule)
    if (project.status === 'submitted' && project.submitted_at) {
        const submissionDate = new Date(project.submitted_at)
        const diffInDays = (Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24)
        if (diffInDays >= 3) {
            console.log(`[AUTO-RELEASE] Triggering release for project ${project.id}. Submission age: ${diffInDays.toFixed(1)} days.`)
            await releaseFunds(project.id, displayPrice, project.creator_id)
            // redirect or refresh state will happen via server action
        }
    }

    // Determine Action State
    // "Negotiating" if status is one of the active negotiation statuses
    const isNegotiating = ['requested', 'negotiating', 'pending', 'countered'].includes(project.status)
    const isActionRequired = isNegotiating && project.waiting_on === user.id
    const iAmSender = latestOffer?.sender_id === user?.id

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <PaymentReceiptModal
                amount={displayPrice}
                date={new Date().toLocaleString()}
                projectName={project.title}
                transactionId={session_id || 'UNKNOWN'}
                showReceipt={payment === 'success'}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 px-2 md:px-0">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1E293B] mb-2 leading-tight uppercase tracking-tighter" dir="auto">{project.title}</h1>
                    <div className="flex items-center text-gray-400 text-xs font-medium">
                        <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 overflow-hidden mr-3 flex items-center justify-center">
                            {project?.creator?.avatar_url ? (
                                <img src={project.creator.avatar_url} alt="Creator" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-sky-400" />
                            )}
                        </div>
                        <span className="uppercase tracking-widest text-[10px] font-black">
                            Lead: <span className="text-[#0EA5E9]">{project?.creator?.full_name || 'Unknown'}</span>
                        </span>
                    </div>
                </div>
                <div className={`px-5 py-3 rounded-2xl border flex items-center shadow-sm w-full md:w-auto justify-center md:justify-start
                    ${['accepted', 'agreed', 'in_progress', 'completed', 'submitted'].includes(project.status) ? 'bg-sky-50 border-sky-100 text-[#0EA5E9]' :
                        ['declined', 'cancelled'].includes(project.status) ? 'bg-red-50 border-red-100 text-red-600' :
                            project.status === 'revision_requested' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                'bg-white border-sky-50 text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 
                        ${['accepted', 'agreed', 'in_progress', 'completed', 'submitted'].includes(project.status) ? 'bg-[#0EA5E9]' :
                            ['declined', 'cancelled'].includes(project.status) ? 'bg-red-500' :
                                'bg-orange-400'}`} />
                    <span className="font-black uppercase text-[10px] tracking-widest">
                        {payment === 'success' || (project.status === 'accepted' && project.funds_status === 'pending') ? 'Secured' :
                            project.status === 'revision_requested' ? 'Revision requested' :
                                project.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Project Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-sky-50 shadow-sm">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Briefing</h2>
                        <MarkdownRenderer content={project.description} className="text-slate-600 leading-relaxed text-sm" />

                        {(project.file_urls?.length > 0 || project.file_url) && (
                            <div className="mt-6 space-y-2">
                                {(project.file_urls || [project.file_url]).map((url: string, idx: number) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#F0F9FF] rounded-xl flex items-center hover:bg-[#F0F9FF] transition-colors block">
                                        <FileText className="w-5 h-5 text-[#0EA5E9] mr-3" />
                                        <span className="font-medium text-[#1E293B]">View Requirement {project.file_urls?.length > 1 ? idx + 1 : ''}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Negotiation Console */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-sky-50 relative overflow-hidden shadow-sm">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                Financials
                            </h3>
                            {project.pricing_type && (
                                <div className="px-3 py-1.5 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-2">
                                    <AEDIcon className="w-3 h-3 text-[#0EA5E9]" />
                                    <span className="text-[10px] font-bold text-[#333] uppercase">
                                        {project.pricing_type} {project.current_terms?.tier ? `(${project.current_terms.tier})` : ''}
                                    </span>
                                    {project.due_date && (
                                        <span className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1 border-l border-gray-200 pl-2">
                                            <Clock className="w-2.5 h-2.5" />
                                            Due {new Date(project.due_date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>



                        {/* SUCCESS STATE: Payment was just made, waiting for sync */}
                        {payment === 'success' && project.funds_status === 'pending' && (
                            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden mb-6">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-[10px] text-white/60">Payment Received</p>
                                            <p className="text-xl font-bold font-serif">Verifying with Stripe...</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/70 mb-8 leading-relaxed">
                                        Great! We've received your payment. We're just waiting for the final confirmation from Stripe to move your project to "In Progress". This usually takes a few seconds.
                                    </p>
                                    <div className="flex items-center justify-center p-4 bg-white/10 rounded-2xl">
                                        <Clock className="w-6 h-6 mr-3 animate-spin" />
                                        <span className="font-bold uppercase tracking-widest text-sm text-white">Finalizing your order...</span>
                                    </div>
                                </div>
                                <AEDIcon className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
                            </div>
                        )}

                        {/* STATUS: IN PROGRESS / ESCROW -> WORK STARTED */}
                        {(project.funds_status === 'escrow' || project.status === 'in_progress') && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-400">
                                    <Shield className="w-6 h-6" />
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <p className="font-bold text-blue-400 text-lg mb-1">Project in Progress</p>
                                <p className="text-white/60 text-sm mb-4">Funds are secured in Escrow.</p>
                                <div className="bg-black/20 rounded-lg p-3 text-sm text-white/80">
                                    <p className="font-mono">Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'TBD'}</p>
                                </div>
                            </div>
                        )}

                        {/* STATUS: SUBMITTED -> REVIEW & RELEASE */}
                        {project.status === 'submitted' && (
                            <div className="mb-6">
                                <SubmissionReview
                                    projectId={project.id}
                                    creatorId={project.creator_id}
                                    currentPrice={displayPrice}
                                    submissionUrl={project.submission_url}
                                    submissionNotes={project.submission_notes}
                                    revisionsTotal={project.revisions_total || 0}
                                    revisionsUsed={project.revisions_used || 0}
                                />
                            </div>
                        )}


                        {/* CONSOLE REMOVED - Fixed Price Only */}
                        <div className="bg-[#F0F9FF] rounded-2xl p-6 border border-[#F0F9FF] mb-6">
                            <div className="flex flex-col items-center">
                                <AEDIcon className="w-12 h-12 text-[#0EA5E9] mb-4 opacity-20" />
                                <p className="text-3xl font-serif font-bold text-[#0EA5E9]">AED {displayPrice}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Current Price</p>
                            </div>
                        </div>


                        {/* Payment Policy & Reporting for Active/Submitted Projects */}
                        {['in_progress', 'submitted'].includes(project.status) && (
                            <div className="mt-8 border-t border-[#F0F9FF] pt-6 flex flex-col items-center gap-4">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                                    Project Policy
                                </p>
                                <p className="text-[10px] text-red-500/60 font-medium text-center px-4">
                                    No refunds are accepted once work has begun. If you have concerns, please report the issue below.
                                </p>

                                <ReportIssueForm projectId={project.id} />

                                {project.status === 'submitted' && (
                                    <p className="text-[10px] text-orange-500/80 font-bold text-center italic mt-2">
                                        Note: Funds automatically release to the creator 3 days after submission if no action is taken.
                                    </p>
                                )}
                            </div>
                        )}

                    </div>
                    {/* Background decoration */}
                    <AEDIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-[#0EA5E9]/5" />
                </div>
            </div>
        </div>
    )
}
