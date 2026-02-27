'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import OverviewModule from './OverviewModule'
import UsersModule from './UsersModule'
import ProjectsModule from './ProjectsModule'
import FinancesModule from './FinancesModule'
import ModerationModule from './ModerationModule'
import PayoutsModule from './PayoutsModule'
import SupportModule from './SupportModule'

type Tab = 'overview' | 'users' | 'projects' | 'finances' | 'moderation' | 'payouts' | 'support'

interface AdminDashboardClientProps {
    user: any
    initialData: {
        projects: any[]
        profiles: any[]
        withdrawals: any[]
        events: any[]
        transactions: any[]
        payoutBatches: any[]
        tickets: any[]
        stats: {
            totalUsers: number
            totalRevenue: number
            activeProjects: number
            escrowHeld: number
        }
    }
}

export default function AdminDashboardClient({ user, initialData }: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-red-500 selection:text-white relative">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab)
                    setIsSidebarOpen(false)
                }}
                adminEmail={user.email}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <main className="flex-1 min-w-0 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                            <Menu className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-sans font-black text-white tracking-tighter text-xl">Workly.</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {activeTab === 'overview' && (
                        <OverviewModule
                            projects={initialData.projects}
                            profiles={initialData.profiles}
                            stats={initialData.stats}
                            withdrawals={initialData.withdrawals}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === 'users' && (
                        <UsersModule
                            profiles={initialData.profiles}
                            projects={initialData.projects}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === 'projects' && (
                        <ProjectsModule projects={initialData.projects} events={initialData.events} />
                    )}
                    {activeTab === 'payouts' && (
                        <PayoutsModule withdrawals={initialData.withdrawals} />
                    )}
                    {activeTab === 'finances' && (
                        <FinancesModule
                            projects={initialData.projects}
                            stats={initialData.stats}
                            withdrawals={initialData.withdrawals}
                            transactions={initialData.transactions}
                            payoutBatches={initialData.payoutBatches}
                        />
                    )}
                    {activeTab === 'moderation' && (
                        <ModerationModule
                            projects={initialData.projects}
                            profiles={initialData.profiles}
                            events={initialData.events}
                        />
                    )}
                    {activeTab === 'support' && (
                        <SupportModule
                            tickets={initialData.tickets}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}
