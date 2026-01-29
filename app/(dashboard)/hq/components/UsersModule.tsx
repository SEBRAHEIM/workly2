'use client'

import { useState, useEffect } from 'react'
import { Search, UserCheck, ShieldAlert, MoreHorizontal, User, Mail, Calendar } from 'lucide-react'
import { verifyUser, suspendUser } from '../actions'
import { toast } from 'sonner'

export default function UsersModule({ profiles, projects = [], setActiveTab }: { profiles: any[], projects?: any[], setActiveTab: (tab: any) => void }) {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const filteredProfiles = profiles.filter(p => {
        const matchesSearch = (p.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (p.username?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (p.email?.toLowerCase() || '').includes(search.toLowerCase())
        const matchesRole = roleFilter === 'all' || p.role === roleFilter
        return matchesSearch && matchesRole
    })

    const getUserProjectCount = (userId: string) => {
        return projects.filter(p => p.student_id === userId || p.creator_id === userId).length
    }

    const handleVerify = async (userId: string) => {
        try {
            await verifyUser(userId)
            toast.success('User verified successfully')
        } catch (error) {
            toast.error('Failed to verify user')
        }
    }

    const handleSuspend = async (userId: string) => {
        if (!confirm('Are you sure you want to suspend this user?')) return
        try {
            await suspendUser(userId)
            toast.success('User suspended')
        } catch (error) {
            toast.error('Failed to suspend user')
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Stats Quick Look */}
            {/* ... stats code ... */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">User Directory</h2>
                    <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase mt-2">Manage platform inhabitants</p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <div className="px-4 py-2 text-center">
                        <div className="text-[8px] text-gray-500 uppercase font-black mb-1">Total</div>
                        <div className="text-xl font-black text-white">{profiles.length}</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="px-4 py-2 text-center">
                        <div className="text-[8px] text-gray-500 uppercase font-black mb-1">Students</div>
                        <div className="text-xl font-black text-blue-500">{profiles.filter(p => p.role === 'student').length}</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="px-4 py-2 text-center">
                        <div className="text-[8px] text-gray-500 uppercase font-black mb-1">Creators</div>
                        <div className="text-xl font-black text-red-500">{profiles.filter(p => p.role === 'creator').length}</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {/* ... controls code ... */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'student', 'creator', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${roleFilter === role
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-gray-500 border-white/5 hover:border-white/20'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">User</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Activity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Role</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Joined</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {filteredProfiles.map((p) => (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                                            {p.avatar_url ? (
                                                <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-6 h-6 text-gray-400" />
                                            )}
                                            {p.is_verified && (
                                                <div className="absolute -top-1 -right-1 p-1 bg-blue-500 rounded-full shadow-lg">
                                                    <UserCheck className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                {p.full_name || p.display_name || p.username || 'Anonymous'}
                                                {p.status === 'suspended' && <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full uppercase font-black border border-red-500/20">Suspended</span>}
                                            </div>
                                            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium">
                                                <Mail className="w-3 h-3" /> {p.email}
                                            </div>

                                            {p.role === 'creator' && (
                                                <div className="mt-3 p-3 bg-white/[0.02] rounded-xl border border-white/5 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[7px] text-gray-500 uppercase font-black tracking-widest">Payout Identity</div>
                                                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${p.payout_preference ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                                            {p.payout_preference || 'None'}
                                                        </span>
                                                    </div>

                                                    {p.payout_preference === 'bank' && (
                                                        <div className="grid grid-cols-1 gap-1">
                                                            <div className="text-[9px] text-gray-300 font-bold tracking-tight truncate">{p.bank_account_name}</div>
                                                            <div className="text-[8px] text-blue-400 font-mono tracking-tighter truncate">{p.bank_iban}</div>
                                                            <div className="text-[7px] text-gray-600 uppercase font-black tracking-widest">{p.bank_name}</div>
                                                        </div>
                                                    )}

                                                    {p.payout_preference === 'paypal' && (
                                                        <div className="text-[9px] text-blue-400 font-mono tracking-tighter truncate">
                                                            {p.paypal_email || 'Email Missing'}
                                                        </div>
                                                    )}

                                                    {!p.payout_preference && (
                                                        <div className="text-[8px] text-gray-600 italic">No payout methods configured.</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-white">{getUserProjectCount(p.id)}</span>
                                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-[0.2em]">Projects</span>
                                        </div>
                                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min(getUserProjectCount(p.id) * 10, 100)}%` }} />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div
                                        onClick={() => setActiveTab('projects')}
                                        className="space-y-2 cursor-pointer group/activity"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-white group-hover/activity:text-red-500 transition-colors">{getUserProjectCount(p.id)}</span>
                                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-[0.2em]">Projects</span>
                                        </div>
                                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min(getUserProjectCount(p.id) * 10, 100)}%` }} />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                                    <span className={`${p.role === 'admin' ? 'text-red-500' : p.role === 'creator' ? 'text-blue-400' : 'text-green-500'}`}>
                                        {p.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'suspended' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.status || 'active'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-gray-500 text-[10px] font-medium">
                                    <span className="flex items-center gap-1 font-mono tracking-tighter">
                                        <Calendar className="w-3 h-3" />
                                        {isMounted && p.created_at ? new Date(p.created_at).toLocaleDateString() : '...'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {!p.is_verified && (
                                            <button
                                                onClick={() => handleVerify(p.id)}
                                                className="p-2 hover:bg-blue-500/10 rounded-lg text-gray-500 hover:text-blue-500 transition-all group/btn" title="Verify User"
                                            >
                                                <UserCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        )}
                                        {p.status !== 'suspended' && (
                                            <button
                                                onClick={() => handleSuspend(p.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all group/btn" title="Suspend User"
                                            >
                                                <ShieldAlert className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-all">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProfiles.length === 0 && (
                    <div className="py-20 text-center">
                        <User className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-600">No matching inhabitants found</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
