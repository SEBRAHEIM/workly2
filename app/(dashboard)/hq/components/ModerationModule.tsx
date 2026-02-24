'use client'

import { Scale, Flag, ShieldAlert, MessageSquare, ThumbsDown, Trash2, Eye, CheckCircle } from 'lucide-react'

export default function ModerationModule({ projects, profiles, events = [] }: { projects: any[], profiles: any[], events?: any[] }) {
    const disputes = projects.filter(p => p.status === 'disputed' || p.funds_status === 'disputed')

    const getEventLabel = (type: string) => {
        switch (type) {
            case 'status_change': return 'Status Update'
            case 'work_submitted': return 'Work Delivered'
            case 'funds_escrowed': return 'Payment Secured'
            case 'funds_released': return 'Funds Released'
            case 'declined': return 'Offer Declined'
            default: return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ... header ... */}
            <div>
                <h2 className="text-3xl font-sans font-black font-black text-white tracking-tight uppercase">Justice & Security</h2>
                <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Dispute arbitration and platform safety</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Disputes */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-8 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" /> Open Disputes
                    </h3>

                    <div className="space-y-4">
                        {disputes.length > 0 ? (
                            disputes.map(d => (
                                <div key={d.id} className="p-5 bg-red-500/5 rounded-2xl border border-red-500/10 group hover:border-red-500/30 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm text-white">{d.title}</h4>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">Escrow: AED {d.current_price}</p>
                                            <div className="flex items-center gap-3 mt-4">
                                                <button className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline">Arbitrate Dispute</button>
                                                <span className="text-[9px] text-gray-700 font-mono tracking-tighter italic">Pending Review</span>
                                            </div>
                                        </div>
                                        <Scale className="w-5 h-5 text-red-500 opacity-20" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-gray-600 border border-dashed border-white/10 rounded-3xl">
                                <Scale className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Silence is golden</p>
                                <span className="text-[9px] opacity-50 font-medium italic">No active disputes requiring arbitration.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Moderation Area (Placeholder for now but looks active) */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-8 flex items-center gap-2">
                        <Flag className="w-5 h-5" /> Flagged Content
                    </h3>

                    <div className="space-y-4">
                        <div className="py-20 text-center text-gray-600 border border-dashed border-white/10 rounded-3xl opacity-50">
                            <Flag className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pure Stream</p>
                            <span className="text-[9px] opacity-50 font-medium italic">Zero content violations reported.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Logs / Audit Trail */}
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> Global Activity Audit
                    </h3>
                    <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Live Trail</div>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-4 scrollbar-hide">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="flex items-center justify-between py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01] transition-colors rounded-lg px-2 group">
                                <div className="flex items-center gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors shadow-[0_0_8px_rgba(59,130,246,0.2)]" />
                                    <div>
                                        <span className="text-[11px] text-gray-300 font-bold mr-2">
                                            {getEventLabel(event.type)}:
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {event.actor?.display_name || event.actor?.full_name || 'System'} modified project <span className="text-gray-400">"{event.projects?.title}"</span>
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[9px] text-gray-700 font-mono group-hover:text-gray-500 transition-colors">
                                    {new Date(event.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 italic text-[10px] text-gray-700">Wait for the pulse... No events recorded yet.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
