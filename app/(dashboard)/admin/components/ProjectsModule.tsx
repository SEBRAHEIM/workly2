'use client'

import { useState, useTransition } from 'react'
import { Search, Briefcase, ChevronRight, Shield, MessageSquare, FileText, Ban, CheckCircle2 } from 'lucide-react'
import { cancelProject, forceReleaseFunds } from '../actions'
import { toast } from 'sonner'

export default function ProjectsModule({ projects }: { projects: any[] }) {
    const [statusFilter, setStatusFilter] = useState('all')
    const [isPending, startTransition] = useTransition()

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">Order Stream</h2>
                <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Active negotiations and deliveries</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'requested', 'negotiating', 'agreed', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                                : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredProjects.map((p) => (
                    <div key={p.id} className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] hover:border-white/20 transition-all group relative overflow-hidden">
                        {/* Background subtle indicator */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.status === 'completed' ? 'bg-green-500' :
                                p.status === 'negotiating' ? 'bg-yellow-500' :
                                    p.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                            } opacity-30`} />

                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            {/* Entity Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded ${p.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                            p.status === 'negotiating' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {p.status}
                                    </span>
                                    <span className="text-gray-600 font-mono text-[9px] tracking-tighter">ID: {p.id.slice(0, 8)}...</span>
                                </div>

                                <h3 className="text-xl font-bold text-white tracking-tight">{p.title}</h3>

                                <div className="flex items-center gap-6 text-[11px] font-medium tracking-wide">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10" />
                                        Buyer: <span className="text-gray-200">{p.student?.email?.split('@')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10" />
                                        Seller: <span className="text-gray-200">{p.creator?.email?.split('@')[0]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="lg:text-right flex flex-row lg:flex-col justify-between items-center lg:items-end gap-2 border-l border-white/5 lg:pl-10">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Project Price</div>
                                    <div className="text-2xl font-black text-white">AED {p.current_price || '0.00'}</div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${p.funds_status === 'escrow' ? 'bg-blue-500/10 text-blue-400' :
                                            p.funds_status === 'released' ? 'bg-green-500/10 text-green-500' :
                                                'bg-gray-500/10 text-gray-500'
                                        }`}>
                                        {p.funds_status === 'escrow' && <Shield className="w-2.5 h-2.5" />}
                                        {p.funds_status}
                                    </span>
                                </div>
                            </div>

                            {/* Action Tools */}
                            <div className="flex lg:flex-col gap-2 border-l border-white/5 lg:pl-10 justify-center">
                                <ProjectAction icon={MessageSquare} label="View Chat" />
                                <ProjectAction icon={FileText} label="Evidence" />
                                {['agreed', 'negotiating', 'requested'].includes(p.status) && (
                                    <ProjectAction
                                        icon={Ban}
                                        label="Cancel & Refund"
                                        color="text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleCancel(p.id)}
                                        disabled={isPending}
                                    />
                                )}
                                {p.funds_status === 'escrow' && (
                                    <ProjectAction
                                        icon={CheckCircle2}
                                        label="Force Release"
                                        color="text-green-500 hover:bg-green-500/10"
                                        onClick={() => handleRelease(p.id)}
                                        disabled={isPending}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="py-20 text-center text-gray-600 font-medium tracking-widest uppercase text-xs">
                        The order stream is quiet.
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
