'use client'

import { Shield, LayoutDashboard, Users, Briefcase, Wallet, Scale, Settings, LogOut, CreditCard, LifeBuoy } from 'lucide-react'
import Link from 'next/link'

type Tab = 'overview' | 'users' | 'projects' | 'finances' | 'moderation' | 'payouts' | 'support'

interface AdminSidebarProps {
    activeTab: Tab
    setActiveTab: (tab: Tab) => void
    adminEmail?: string
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function AdminSidebar({ activeTab, setActiveTab, adminEmail, isOpen, setIsOpen }: AdminSidebarProps) {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'projects', label: 'Projects & Orders', icon: Briefcase },
        { id: 'finances', label: 'Financials', icon: Wallet },
        { id: 'payouts', label: 'Payout Requests', icon: CreditCard },
        { id: 'moderation', label: 'Moderation', icon: Scale },
        { id: 'support', label: 'Tickets', icon: LifeBuoy },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:sticky top-0 left-0 z-[70]
                w-72 lg:w-64 bg-black border-r border-white/10 
                flex flex-col h-screen transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Close Button for Mobile */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-[-50px] p-3 bg-red-600 rounded-xl lg:hidden shadow-lg shadow-red-600/40"
                >
                    <LogOut className="w-5 h-5 text-white rotate-180" />
                </button>
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-sans font-black font-black text-white tracking-tighter text-xl">Workly.</span>
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
        </>
    )
}
