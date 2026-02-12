import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './components/AdminDashboardClient'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Strict HQ Authorization Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id || '')
        .single()

    if (!user || user.email !== 'workly.day@outlook.com' || profile?.role !== 'admin') {
        redirect('/hq/login')
    }

    // 3. Comprehensive Data Fetching
    const [projectsResponse, profilesResponse, withdrawalsResponse, eventsResponse] = await Promise.all([
        supabase
            .from('projects')
            .select('*, student:student_id(email, full_name, display_name), creator:creator_id(email, full_name, display_name, wallet_balance)')
            .order('created_at', { ascending: false }),
        supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false }),
        supabase
            .from('withdrawals')
            .select('*, profiles(id, full_name, display_name, email)')
            .order('created_at', { ascending: false }),
        supabase
            .from('project_events')
            .select('*, actor:actor_id(display_name, full_name), projects(title)')
            .order('created_at', { ascending: false })
            .limit(20)
    ])

    const projects = projectsResponse.data || []
    const profiles = profilesResponse.data || []
    const withdrawals = withdrawalsResponse.data || []
    const events = eventsResponse.data || []

    // 4. Calculate Comprehensive Stats
    const stats = {
        totalUsers: profiles.length,
        totalRevenue: projects?.filter(p => p.status === 'completed').reduce((acc, curr) => acc + ((curr.current_price || 0) * 0.20), 0) || 0,
        activeProjects: projects?.filter(p => !['completed', 'cancelled'].includes(p.status)).length || 0,
        escrowHeld: projects?.filter(p => p.funds_status === 'escrow').reduce((acc, curr) => acc + (curr.current_price || 0), 0) || 0,
        pendingWithdrawals: withdrawals?.filter(w => w.status === 'pending').reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0,
    }

    const initialData = {
        projects,
        profiles,
        withdrawals,
        events,
        stats
    }

    return <AdminDashboardClient user={user} initialData={initialData} />
}

