'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import OverviewModule from './OverviewModule'
import UsersModule from './UsersModule'
import ProjectsModule from './ProjectsModule'
import FinancesModule from './FinancesModule'
import ModerationModule from './ModerationModule'
import PayoutsModule from './PayoutsModule'

type Tab = 'overview' | 'users' | 'projects' | 'finances' | 'moderation' | 'payouts'

interface AdminDashboardClientProps {
    user: any
    initialData: {
        projects: any[]
        profiles: any[]
        withdrawals: any[]
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

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                adminEmail={user.email}
            />

            <main className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                <div className="p-8 max-w-7xl mx-auto">
                    {activeTab === 'overview' && (
                        <OverviewModule
                            projects={initialData.projects}
                            profiles={initialData.profiles}
                            stats={initialData.stats}
                        />
                    )}
                    {activeTab === 'users' && (
                        <UsersModule profiles={initialData.profiles} />
                    )}
                    {activeTab === 'projects' && (
                        <ProjectsModule projects={initialData.projects} />
                    )}
                    {activeTab === 'payouts' && (
                        <PayoutsModule withdrawals={initialData.withdrawals} />
                    )}
                    {activeTab === 'finances' && (
                        <FinancesModule projects={initialData.projects} stats={initialData.stats} />
                    )}
                    {activeTab === 'moderation' && (
                        <ModerationModule projects={initialData.projects} profiles={initialData.profiles} />
                    )}
                </div>
            </main>
        </div>
    )
}
