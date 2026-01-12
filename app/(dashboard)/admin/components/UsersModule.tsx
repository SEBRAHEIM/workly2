'use client'

import { useState, useTransition } from 'react'
import { Search, UserCheck, ShieldAlert, MoreHorizontal, User, Mail, Calendar } from 'lucide-react'
import { verifyUser, suspendUser } from '../actions'
import { toast } from 'sonner'

export default function UsersModule({ profiles }: { profiles: any[] }) {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'creator'>('all')
    const [isPending, startTransition] = useTransition()

    const filteredProfiles = profiles.filter(p => {
        const matchesSearch = (p.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (p.username?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (p.email?.toLowerCase() || '').includes(search.toLowerCase())
        const matchesRole = roleFilter === 'all' || p.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleVerify = (userId: string) => {
        startTransition(async () => {
            try {
                await verifyUser(userId)
                toast.success('User verified successfully')
            } catch (error) {
                toast.error('Failed to verify user')
            }
        })
    }

    const handleSuspend = (userId: string) => {
        startTransition(async () => {
            try {
                await suspendUser(userId)
                toast.success('User suspended')
            } catch (error) {
                toast.error('Failed to suspend user')
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">User Directory</h2>
                    <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Manage platform inhabitants</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find user..."
                            className="bg-[#111111] border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all w-full md:w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                {['all', 'student', 'creator'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role as any)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${roleFilter === role
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
                            }`}
                    >
                        {role}s
                    </button>
                ))}
            </div>

            {/* User List */}
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Role & Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProfiles.map((p) => (
                            <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group-hover:border-red-500/30 transition-all">
                                            {p.avatar_url ? (
                                                <img src={p.avatar_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                    <User className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-white text-sm tracking-wide">{p.full_name || p.username}</div>
                                                {p.is_verified && <UserCheck className="w-3 h-3 text-blue-500" />}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono mt-1 opacity-60">@{p.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded w-fit ${p.role === 'creator' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                {p.role}
                                            </span>
                                            {p.status === 'suspended' && (
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-red-500/10 text-red-500">
                                                    Suspended
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-gray-600">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email || 'No email'}</span>
                                            <span className="flex items-center gap-1 font-mono tracking-tighter"><Calendar className="w-3 h-3" /> {new Date(p.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        {!p.is_verified && (
                                            <ActionButton
                                                icon={UserCheck}
                                                color="text-green-500"
                                                label="Verify"
                                                onClick={() => handleVerify(p.id)}
                                                disabled={isPending}
                                            />
                                        )}
                                        {p.status === 'active' && (
                                            <ActionButton
                                                icon={ShieldAlert}
                                                color="text-red-500"
                                                label="Suspend"
                                                onClick={() => handleSuspend(p.id)}
                                                disabled={isPending}
                                            />
                                        )}
                                        <ActionButton icon={MoreHorizontal} color="text-gray-500" label="More" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProfiles.length === 0 && (
                    <div className="py-20 text-center text-gray-600 font-medium tracking-widest uppercase text-xs">
                        No inhabitants found.
                    </div>
                )}
            </div>
        </div>
    )
}

function ActionButton({ icon: Icon, color, label, onClick, disabled }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all hover:scale-105 group relative disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                {label}
            </span>
        </button>
    )
}
