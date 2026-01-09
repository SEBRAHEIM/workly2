
import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { respondToOffer } from '../../actions'
import { releaseFunds } from '../actions'
import { User, FileText, Check, MessageSquare, Clock, Shield, Briefcase, Download } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'

import PaymentReceiptModal from './PaymentReceiptModal'
import PaymentButton from './PaymentButton'
import NegotiationConsole from './NegotiationConsole'
import SubmissionReview from './SubmissionReview'
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

    // Determine Action State
    // "Negotiating" if status is one of the active negotiation statuses
    const isNegotiating = ['requested', 'negotiating', 'pending', 'countered'].includes(project.status)
    const isActionRequired = isNegotiating && project.waiting_on === user.id
    const iAmSender = latestOffer?.sender_id === user?.id

    return (
        <div className="max-w-5xl mx-auto p-8">
            <PaymentReceiptModal
                amount={displayPrice}
                date={new Date().toLocaleDateString()}
                projectName={project.title}
                transactionId={session_id || 'UNKNOWN'}
                showReceipt={payment === 'success'}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#333333] mb-2" dir="auto">{project.title}</h1>
                    <div className="flex items-center text-gray-500">
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                            {project?.creator?.avatar_url ? (
                                <img src={project.creator.avatar_url} alt="Creator" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-gray-400 m-1" />
                            )}
                        </div>
                        <span>Creator: <span className="font-bold text-[#333333]">{project?.creator?.full_name || 'Unknown'}</span></span>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-xl border flex items-center shadow-sm 
                    ${['accepted', 'agreed', 'in_progress', 'completed'].includes(project.status) ? 'bg-green-50 border-green-200 text-green-700' :
                        ['declined', 'cancelled'].includes(project.status) ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-white border-[#E6E2D6] text-gray-600'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 
                        ${['accepted', 'agreed', 'in_progress'].includes(project.status) ? 'bg-green-500' :
                            ['declined', 'cancelled'].includes(project.status) ? 'bg-red-500' :
                                'bg-orange-400'}`} />
                    <span className="font-bold uppercase text-sm">{project.status.replace('_', ' ')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Project Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 border border-[#E6E2D6] shadow-sm">
                        <h2 className="text-lg font-bold text-[#333333] uppercase tracking-wider mb-4">Requirements</h2>
                        <MarkdownRenderer content={project.description} className="text-gray-600 leading-relaxed" />

                        {(project.file_urls?.length > 0 || project.file_url) && (
                            <div className="mt-6 space-y-2">
                                {(project.file_urls || [project.file_url]).map((url: string, idx: number) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#F3F0E9] rounded-xl flex items-center hover:bg-[#E6E2D6] transition-colors block">
                                        <FileText className="w-5 h-5 text-[#3E4C37] mr-3" />
                                        <span className="font-medium text-[#333333]">View Requirement {project.file_urls?.length > 1 ? idx + 1 : ''}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Negotiation Console */}
                <div className="bg-white rounded-[1.5rem] p-6 border border-[#E6E2D6] relative overflow-hidden shadow-sm">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                                {project.pricing_type === 'negotiable' ? 'Price Negotiation' : 'Agreed Terms'}
                            </h3>
                            {project.pricing_type && (
                                <div className="px-2 py-1 bg-[#F3F0E9] rounded-lg border border-[#E6E2D6] flex items-center gap-1.5 transition-all hover:border-[#C6A87C] group">
                                    <AEDIcon className="w-3 h-3 text-[#3E4C37]" />
                                    <span className="text-[10px] font-bold text-[#333] uppercase">
                                        {project.pricing_type} {project.current_terms?.tier ? `(${project.current_terms.tier})` : ''}
                                    </span>
                                </div>
                            )}
                        </div>


                        {/* STATUS: AGREED/ACCEPTED -> PAY TO START */}
                        {['accepted', 'agreed'].includes(project.status) && project.funds_status === 'pending' && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                                <Check className="w-8 h-8 text-green-400 mx-auto mb-3" />
                                <p className="font-bold text-green-400 text-lg mb-1">Deal Agreed!</p>
                                <p className="text-white/60 text-sm mb-6">Pay to secure the deal and start the project.</p>

                                <PaymentButton
                                    projectId={project.id}
                                    amount={displayPrice}
                                />

                                <p className="text-[10px] text-white/30 mt-3 flex items-center justify-center">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Funds held safely by Workly until approval.
                                </p>
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
                                />
                            </div>
                        )}


                        {/* NEGOTIATION CONSOLE (Client Component) */}
                        {/* Always show console unless we are in a pure success/payment state handled above, 
                            BUT console handles "Declined" and "Closed" states internally now too for history. */}
                        <NegotiationConsole
                            projectId={project.id}
                            projectStatus={project.status}
                            currentPrice={displayPrice}
                            latestOffer={latestOffer ? {
                                sender_id: latestOffer.sender_id,
                                price: latestOffer.price
                            } : undefined}
                            isActionRequired={isActionRequired}
                            iAmSender={iAmSender}
                            events={events || []}
                        />

                    </div>
                    {/* Background decoration */}
                    <AEDIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-[#3E4C37]/5" />
                </div>
            </div>
        </div>
    )
}
