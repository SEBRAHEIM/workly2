'use client'

import { useState } from 'react'
import { LifeBuoy, Mail, Clock, CheckCircle2, Search, Filter, MessageSquare, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface SupportTicket {
    id: string
    user_id: string
    subject: string
    message: string
    status: string
    created_at: string
    profiles: {
        full_name: string
        display_name: string
        username: string
        email: string
    }
}

interface SupportModuleProps {
    tickets: SupportTicket[]
}

export default function SupportModule({ tickets: initialTickets }: SupportModuleProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all')

    const filteredTickets = initialTickets.filter(ticket => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus

        return matchesSearch && matchesFilter
    })

    const openTicketsCount = initialTickets.filter(t => t.status === 'open').length

    return (
        <div className="space-y-6 font-outfit animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111111] border border-red-500/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <LifeBuoy size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Total Tickets</p>
                            <h3 className="text-2xl font-black text-white">{initialTickets.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-[#111111] border border-yellow-500/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Open Requests</p>
                            <h3 className="text-2xl font-black text-white">{openTicketsCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-[#111111] border border-green-500/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Closed Tickets</p>
                            <h3 className="text-2xl font-black text-white">{initialTickets.length - openTicketsCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111111] border border-white/5 p-4 rounded-3xl">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search tickets by subject, user, or message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-red-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-black rounded-2xl border border-white/10">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${filterStatus === 'all' ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus('open')}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${filterStatus === 'open' ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setFilterStatus('closed')}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${filterStatus === 'closed' ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                        Closed
                    </button>
                </div>
            </div>

            {/* Tickets Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] hover:border-red-500/30 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${ticket.status === 'open' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {ticket.status}
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                            <Calendar size={12} />
                                            {format(new Date(ticket.created_at), 'MMM dd, h:mm a')}
                                        </span>
                                    </div>

                                    <h4 className="text-xl font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">
                                        {ticket.subject}
                                    </h4>

                                    <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                                        <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                                            {ticket.message}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs">
                                        <div className="flex items-center gap-2 text-slate-300 font-bold">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                                <User size={14} />
                                            </div>
                                            {ticket.profiles?.display_name || ticket.profiles?.full_name || ticket.profiles?.username || 'Unknown User'}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                                            <Mail size={14} />
                                            {ticket.profiles?.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col gap-2 justify-end">
                                    <button className="bg-white/5 hover:bg-white/10 text-white/50 hover:text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Mark Resolved
                                    </button>
                                    <a
                                        href={`mailto:${ticket.profiles?.email}?subject=Re: [Workly Support] ${ticket.subject}`}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
                                    >
                                        <MessageSquare size={14} />
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#111111] border border-dashed border-white/10 p-20 rounded-[3rem] text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700 mx-auto mb-6">
                            <LifeBuoy size={40} />
                        </div>
                        <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">No tickets found</h4>
                        <p className="text-slate-600 font-medium">Clear your filters or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
