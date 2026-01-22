import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './components/AdminDashboardClient'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Basic User Check
    if (!user) redirect('/login')

    // 2. Strict Access Control
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (user.email !== 'workly.day@outlook.com' || profile?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center justify-center mb-8">
                    <span className="text-3xl">🚫</span>
                </div>
                <h1 className="text-4xl font-serif font-black text-white mb-4 uppercase tracking-tighter italic">Access Denied</h1>
                <p className="text-gray-500 max-w-sm font-medium tracking-wide">
                    This sector is classified. Please return to your designated workspace.
                </p>
                <a href="/student" className="mt-10 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">
                    Safe Exit
                </a>
            </div>
        )
    }

    // 3. Comprehensive Data Fetching
    const [projectsResponse, profilesResponse, withdrawalsResponse] = await Promise.all([
        supabase
            .from('projects')
            .select('*, student:student_id(email), creator:creator_id(email, wallet_balance)')
            .order('created_at', { ascending: false }),
        supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false }),
        supabase
            .from('withdrawals')
            .select('*, profiles(id, full_name, display_name, email)')
            .order('created_at', { ascending: false })
    ])

    const projects = projectsResponse.data || []
    const profiles = profilesResponse.data || []
    const withdrawals = withdrawalsResponse.data || []

    // 4. Calculate Comprehensive Stats
    const stats = {
        totalUsers: profiles.length,
        totalRevenue: projects?.filter(p => p.status === 'completed').reduce((acc, curr) => acc + ((curr.current_price || 0) * 0.17), 0) || 0,
        activeProjects: projects?.filter(p => !['completed', 'cancelled'].includes(p.status)).length || 0,
        escrowHeld: projects?.filter(p => p.funds_status === 'escrow').reduce((acc, curr) => acc + (curr.current_price || 0), 0) || 0,
        pendingWithdrawals: withdrawals?.filter(w => w.status === 'pending').reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0,
    }

    const initialData = {
        projects,
        profiles,
        withdrawals,
        stats
    }

    return <AdminDashboardClient user={user} initialData={initialData} />
}

