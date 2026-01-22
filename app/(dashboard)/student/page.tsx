import Hero from '@/app/components/Hero'
import Categories from '@/app/components/Categories'
import Footer from '@/app/components/Footer'
import StudentDashboardOverview from '@/app/components/StudentDashboardOverview'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function StudentDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Parallel fetching for dashboard stats
    const [profileResponse, projectsResponse] = await Promise.all([
        supabase.from('profiles').select('full_name, username, wallet_balance').eq('id', user.id).single(),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('student_id', user.id).in('status', ['pending', 'countered', 'negotiating', 'requested', 'accepted', 'in_progress'])
    ])

    const profile = profileResponse.data
    const projectCount = projectsResponse.count || 0
    const welcomeName = profile?.full_name?.split(' ')[0] || profile?.username || "Student"

    return (
        <div className="min-h-screen">
            <Hero
                hideCta={true}
                title="Workly."
                subtitle={`Desk.`}
            />

            <div className="relative -mt-32 z-20">
                <StudentDashboardOverview
                    projectCount={projectCount}
                    balance={`AED ${profile?.wallet_balance?.toFixed(2) || '0.00'}`}
                />
            </div>

            <Categories />
            <Footer />
        </div>
    )
}
