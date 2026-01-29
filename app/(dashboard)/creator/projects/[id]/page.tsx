import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { submitWork } from '../actions'
import { User, FileText, Check, Clock, Shield, Briefcase, Upload, AlertCircle } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import Link from 'next/link'
import SubmitWorkForm from './SubmitWorkForm'
import MarkdownRenderer from '@/app/components/MarkdownRenderer'
import EarningsBreakdown from '@/app/components/EarningsBreakdown'

export default async function CreatorProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = await params
    const id = rawId?.trim()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect(`/login?next=/creator/projects/${encodeURIComponent(id)}`)
    }

    const { data: project } = await supabase
        .from('projects')
        .select(`
            *,
            student:student_id (
                full_name,
                username,
                avatar_url
            )
        `)
        .eq('id', id)
        .single()

    if (!project) {
        notFound()
    }

    // Strict Privacy: Only the creator can view this page
    if (project.creator_id !== user.id) {
        notFound()
    }

    // Auto-transition 'requested' -> 'negotiating' to remove from dashboard "Recent Requests"
    if (project.status === 'requested') {
        const { error: updateError } = await supabase
            .from('projects')
            .update({ status: 'negotiating' })
            .eq('id', id)

        if (!updateError) {
            project.status = 'negotiating'
        }
    }

    // Calculate time remaining
    const dueDate = project.due_date ? new Date(project.due_date) : null
    const daysLeft = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 pt-24 md:pt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 px-2 md:px-0">
                <div className="flex-1">
                    <div className="flex items-center text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link href="/creator/requests" className="hover:text-[#0EA5E9] transition-colors">Workspace</Link>
                        <span className="mx-2 opacity-30">/</span>
                        <span>Terminal</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-800 mb-2 uppercase tracking-tighter leading-tight" dir="auto">{project.title}</h1>
                    <div className="flex items-center text-slate-500 text-xs mt-4">
                        <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 overflow-hidden mr-3 flex items-center justify-center">
                            {project.student.avatar_url ? (
                                <img src={project.student.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-sky-300" />
                            )}
                        </div>
                        <span className="uppercase tracking-widest text-[10px] font-black">Operator: <span className="text-[#0EA5E9]">{project.student.full_name || project.student.username}</span></span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`px-5 py-3 rounded-2xl border flex items-center shadow-sm w-full md:w-auto justify-center md:justify-start ${project.status === 'in_progress' ? 'bg-sky-50 border-sky-100 text-[#0EA5E9]' :
                    project.status === 'agreed' ? 'bg-green-50 border-green-100 text-green-700' :
                        project.status === 'submitted' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                            'bg-white border-sky-50 text-slate-400'
                    }`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${project.status === 'in_progress' ? 'bg-[#0EA5E9]' :
                        project.status === 'agreed' ? 'bg-green-500' :
                            project.status === 'submitted' ? 'bg-purple-500' :
                                'bg-slate-200'
                        }`} />
                    <span className="font-black uppercase text-[10px] tracking-widest">{project.status.replace('_', ' ')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Project Context */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Requirements Card */}
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-sky-50 shadow-sm">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Briefing</h2>
                        <MarkdownRenderer content={project.description} className="text-slate-600 leading-relaxed text-sm" />
                        {project.file_url && (
                            <div className="mt-6 p-4 bg-[#F0F9FF] rounded-xl flex items-center border border-[#F0F9FF]/50">
                                <FileText className="w-5 h-5 text-[#0EA5E9] mr-3" />
                                <span className="font-medium text-[#1E293B]">Attached File</span>
                                <button className="ml-auto text-sm text-[#0EA5E9] font-bold hover:underline">Download</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Action Console */}
                <div className="space-y-6">
                    {/* Financial Status */}
                    <div className="bg-[#1E293B] rounded-[2rem] p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs mb-4">Financial Status</h3>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl font-bold">AED {project.current_price || '0.00'}</span>
                                {project.funds_status === 'escrow' ? (
                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center">
                                        <Shield className="w-3 h-3 mr-1" />
                                        In Escrow
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                                        {project.funds_status}
                                    </span>
                                )}
                            </div>

                            <EarningsBreakdown price={Number(project.current_price)} dark compact />

                            {project.funds_status === 'escrow' ? (
                                <p className="text-sm text-white/70">
                                    Student has deposited the funds. They are held safely by the platform until you complete the work.
                                </p>
                            ) : (
                                <p className="text-sm text-white/50">
                                    Waiting for student to deposit funds. Do not start working yet.
                                </p>
                            )}
                        </div>
                        <AEDIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
                    </div>

                    {/* Delivery Panel */}
                    {project.status === 'in_progress' && project.funds_status === 'escrow' && (
                        <div className="bg-white rounded-[2rem] p-6 border-2 border-blue-500/10 shadow-lg shadow-blue-500/5">
                            <div className="flex items-center mb-4 text-blue-600">
                                <Clock className="w-5 h-5 mr-2" />
                                <span className="font-bold">Time Remaining: {daysLeft} Days</span>
                            </div>

                            <h3 className="font-bold text-[#1E293B] text-lg mb-2">Submit Your Work</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Upload your final files here. The student will review them before funds are released.
                            </p>

                            <SubmitWorkForm
                                projectId={project.id}
                                projectTitle={project.title}
                            />
                        </div>
                    )}

                    {/* Submitted State */}
                    {project.status === 'submitted' && (
                        <div className="bg-purple-50 rounded-[2rem] p-6 border border-purple-100 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Check className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-purple-900 mb-1">Work Submitted!</h3>
                            <p className="text-sm text-purple-700">Waiting for student review.</p>
                        </div>
                    )}

                    {/* Warning if working before escrow */}
                    {project.status === 'agreed' && project.funds_status !== 'escrow' && (
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-800 leading-relaxed">
                                <strong>Wait for Escrow!</strong><br />
                                Do not start working until the status card above shows "In Escrow".
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
