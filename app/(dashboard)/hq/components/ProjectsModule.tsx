'use client'

import { useState, useTransition, useEffect } from 'react'
import { Search, Briefcase, ChevronRight, Shield, MessageSquare, FileText, Ban, CheckCircle2, Eye } from 'lucide-react'
import { cancelProject, forceReleaseFunds, syncProjectPayment } from '../actions'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ProjectsModule({ projects, events = [] }: { projects: any[], events?: any[] }) {
    const [statusFilter, setStatusFilter] = useState('all')
    const [isPending, startTransition] = useTransition()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const filteredProjects = projects.filter(p => statusFilter === 'all' || p.status === statusFilter)

    const handleCancel = (projectId: string) => {
        if (!confirm('Are you sure you want to cancel this project and refund the buyer?')) return
        startTransition(async () => {
            try {
                await cancelProject(projectId)
                toast.success('Project cancelled and refunded')
            } catch (error) {
                toast.error('Failed to cancel project')
            }
        })
    }

    const handleRelease = (projectId: string) => {
        if (!confirm('Force release funds to the creator?')) return
        startTransition(async () => {
            try {
                await forceReleaseFunds(projectId)
                toast.success('Funds released successfully')
            } catch (error) {
                toast.error('Failed to release funds')
            }
        })
    }

    const handleSync = (projectId: string) => {
        if (!confirm('Manually sync payment for this project? This will move it to "Escrow" and activate it for the creator.')) return
        startTransition(async () => {
            try {
                await syncProjectPayment(projectId)
                toast.success('Project synced and activated')
            } catch (error) {
                toast.error('Failed to sync project')
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-sans font-black font-black text-white tracking-tight uppercase">Order Stream</h2>
                    <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Full visibility of all interactions</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Pulse</span>
                    <div className="h-1 w-24 bg-blue-500/20 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 w-1/3 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide border-b border-white/5">
                {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'requested', label: 'Requested' },
                    { id: 'negotiating', label: 'Negotiating' },
                    { id: 'accepted', label: 'Accepted' },
                    { id: 'in_progress', label: 'In Progress' },
                    { id: 'submitted', label: 'Submitted' },
                    { id: 'revision_requested', label: 'In Revision' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'cancelled', label: 'Cancelled' }
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setStatusFilter(f.id)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${statusFilter === f.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                            : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
                            }`}
                    >
                        {f.label} ({projects.filter(p => f.id === 'all' || p.status === f.id).length})
                    </button>
                ))}
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredProjects.map((p) => {
                    const projectEvents = events.filter(e => e.project_id === p.id).slice(0, 3)

                    return (
                        <div key={p.id} className="bg-[#111111] border border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all group overflow-hidden">
                            <div className="p-8">
                                <div className="flex flex-col xl:flex-row justify-between gap-10">
                                    {/* Entity Info */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                ['in_progress', 'submitted', 'revision_requested'].includes(p.status) ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    p.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {p.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-gray-600 font-mono text-[10px] tracking-tighter">REF: {p.id.split('-')[0].toUpperCase()}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{p.title}</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xs border border-blue-500/10">ST</div>
                                                <div className="min-w-0">
                                                    <div className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Client</div>
                                                    <div className="text-white font-bold text-sm truncate">{p.client?.full_name || p.client?.display_name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono truncate">{p.client?.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 font-black text-xs border border-green-500/10">CR</div>
                                                <div className="min-w-0">
                                                    <div className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Creator</div>
                                                    <div className="text-white font-bold text-sm truncate">{p.creator?.full_name || p.creator?.display_name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono truncate">{p.creator?.email}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Interaction Timeline Snippet */}
                                        {projectEvents.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Recent Activity</span>
                                                <div className="space-y-1">
                                                    {projectEvents.map(e => (
                                                        <div key={e.id} className="flex items-center gap-2 text-[10px] text-gray-500">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30" />
                                                            <span className="font-bold text-gray-400">{e.type.replace('_', ' ')}:</span>
                                                            <span className="truncate italic">By {e.actor?.display_name || 'System'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Financial Summary */}
                                    <div className="xl:text-right flex flex-row xl:flex-col justify-between items-center xl:items-end gap-4 border-t xl:border-t-0 xl:border-l border-white/5 pt-8 xl:pt-0 xl:pl-10 min-w-[200px]">
                                        <div>
                                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Contract Value</div>
                                            <div className="text-3xl font-black text-white">AED {p.current_price || '0.00'}</div>
                                            <div className="text-[10px] text-green-500 font-black uppercase mt-2 bg-green-500/5 px-2 py-1 rounded-lg inline-block">
                                                Platform: AED {((p.current_price || 0) * 0.20).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-2 uppercase tracking-widest border ${p.funds_status === 'escrow' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                p.funds_status === 'released' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    'bg-white/5 text-gray-500 border-white/10'
                                                }`}>
                                                {p.funds_status === 'escrow' && <Shield className="w-3 h-3" />}
                                                {p.funds_status}
                                            </span>
                                            <div className="text-[9px] text-gray-600 font-mono italic">Created: {new Date(p.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    {/* Action Tools */}
                                    <div className="flex flex-row xl:flex-col gap-2 border-t xl:border-t-0 xl:border-l border-white/5 pt-8 xl:pt-0 xl:pl-10 justify-center">
                                        <Link href={`/creator/projects/${p.id}`} target="_blank">
                                            <ProjectAction icon={Eye} label="God View" color="text-blue-500 hover:bg-blue-500/10 border-blue-500/20" />
                                        </Link>
                                        <ProjectAction icon={MessageSquare} label="Chat Audit" />
                                        {['agreed', 'negotiating', 'requested'].includes(p.status) && (
                                            <ProjectAction
                                                icon={Ban}
                                                label="Intervene & Refund"
                                                color="text-red-500 hover:bg-red-500/10 border-red-500/20"
                                                onClick={() => handleCancel(p.id)}
                                                disabled={isPending}
                                            />
                                        )}
                                        {p.funds_status === 'escrow' && (
                                            <ProjectAction
                                                icon={CheckCircle2}
                                                label="Force Complete"
                                                color="text-green-500 hover:bg-green-500/10 border-green-500/20"
                                                onClick={() => handleRelease(p.id)}
                                                disabled={isPending}
                                            />
                                        )}
                                        {p.funds_status === 'pending' && (
                                            <ProjectAction
                                                icon={Shield}
                                                label="Sync Payment"
                                                color="text-yellow-500 hover:bg-yellow-500/10 border-yellow-500/20"
                                                onClick={() => handleSync(p.id)}
                                                disabled={isPending}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {filteredProjects.length === 0 && (
                    <div className="bg-[#111111] border border-dashed border-white/10 py-32 rounded-[3rem] text-center">
                        <Briefcase className="w-12 h-12 mx-auto mb-6 text-gray-800" />
                        <div className="text-gray-600 font-black tracking-[0.3em] uppercase text-xs">
                            The stream is calm
                        </div>
                        <p className="text-[10px] text-gray-700 font-medium tracking-widest mt-2 uppercase">No {statusFilter} orders found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function ProjectAction({ icon: Icon, label, color = "text-gray-500 hover:bg-white/5", onClick, disabled }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50 ${color}`}
        >
            <Icon className="w-4 h-4" />
            <span className="lg:hidden xl:block">{label}</span>
        </button>
    )
}
