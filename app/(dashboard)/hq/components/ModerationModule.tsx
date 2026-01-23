'use client'

import { Scale, Flag, ShieldAlert, MessageSquare, ThumbsDown, Trash2, Eye, CheckCircle } from 'lucide-react'

export default function ModerationModule({ projects, profiles }: { projects: any[], profiles: any[] }) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">Justice & Security</h2>
                <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Dispute arbitration and platform safety</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Disputes */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-8 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" /> Open Disputes
                    </h3>

                    <div className="space-y-4">
                        <div className="py-20 text-center text-gray-600 border border-dashed border-white/10 rounded-3xl">
                            <Scale className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Silence is golden</p>
                            <span className="text-[9px] opacity-50 font-medium italic">No active disputes requiring arbitration.</span>
                        </div>
                    </div>
                </div>

                {/* Content Moderation Queue */}
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-8 flex items-center gap-2">
                        <Flag className="w-5 h-5" /> Flagged Content
                    </h3>

                    <div className="space-y-4">
                        {/* Example Flagged Item */}
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-yellow-500/30 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                        <ThumbsDown className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Suspicious Service Listing</h4>
                                        <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Listing contained off-platform contact information.</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Contact Violation</span>
                                            <span className="text-[9px] text-gray-600 font-mono tracking-tighter">Reported 2h ago</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 group/btn">
                                        <Eye className="w-4 h-4 group-hover/btn:text-white" />
                                    </button>
                                    <button className="p-2 hover:bg-green-500/10 rounded-lg text-gray-400 group/btn">
                                        <CheckCircle className="w-4 h-4 group-hover/btn:text-green-500" />
                                    </button>
                                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 group/btn">
                                        <Trash2 className="w-4 h-4 group-hover/btn:text-red-500" />
                                    </button>
                                </div>
                            </div>
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
                    <button className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:underline">View Full Logs</button>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-white/[0.02] last:border-0 italic">
                            <div className="flex items-center gap-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                                <span className="text-[11px] text-gray-500 font-medium">System activity log entry #0392{i} initialized...</span>
                            </div>
                            <span className="text-[9px] text-gray-800 font-mono">12.01.2026 11:2{i}:45</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
