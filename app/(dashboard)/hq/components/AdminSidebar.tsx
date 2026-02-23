'use client'

import { Shield, LayoutDashboard, Users, Briefcase, Wallet, Scale, Settings, LogOut, CreditCard } from 'lucide-react'
import Link from 'next/link'

type Tab = 'overview' | 'users' | 'projects' | 'finances' | 'moderation' | 'payouts'

interface AdminSidebarProps {
    activeTab: Tab
    setActiveTab: (tab: Tab) => void
    adminEmail?: string
}

export default function AdminSidebar({ activeTab, setActiveTab, adminEmail }: AdminSidebarProps) {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'projects', label: 'Projects & Orders', icon: Briefcase },
        { id: 'finances', label: 'Financials', icon: Wallet },
        { id: 'payouts', label: 'Payout Requests', icon: CreditCard },
        { id: 'moderation', label: 'Moderation', icon: Scale },
    ]

    return (
        <aside className="w-64 bg-black border-r border-white/10 flex flex-col h-screen sticky top-0">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-serif font-black text-white tracking-widest uppercase text-xl">Workly</span>
                </div>
                <div className="text-[10px] text-red-500 font-bold tracking-[0.3em] uppercase opacity-80">
                    God Mode
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id
                            ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-red-500' : 'group-hover:text-red-500'}`} />
                        <span className="text-sm font-medium tracking-wide">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="px-4 py-3 mb-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Active Admin</div>
                    <div className="text-xs text-white font-mono truncate">{adminEmail}</div>
                </div>

                <Link
                    href="/client"
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium tracking-wide">Exit God Mode</span>
                </Link>
            </div>
        </aside>
    )
}
