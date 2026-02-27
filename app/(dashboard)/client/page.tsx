import Hero from '@/app/components/Hero'
import Categories from '@/app/components/Categories'
import Footer from '@/app/components/Footer'
import ClientDashboardOverview from '@/app/components/ClientDashboardOverview'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ClientDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null // Handled by middleware redirect

    // Parallel fetching for dashboard stats
    const [profileResponse, projectsResponse] = await Promise.all([
        supabase.from('profiles').select('full_name, username, wallet_balance').eq('id', user.id).single(),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('client_id', user.id).in('status', ['pending', 'countered', 'negotiating', 'requested', 'accepted', 'in_progress'])
    ])

    const profile = profileResponse.data
    const projectCount = projectsResponse.count || 0
    const welcomeName = profile?.full_name?.split(' ')[0] || profile?.username || "Client"

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#E0F2FE] pt-14 md:pt-32">
                <div className="relative z-20">
                    <ClientDashboardOverview
                        projectCount={projectCount}
                        balance={`AED ${profile?.wallet_balance?.toFixed(2) || '0.00'}`}
                    />
                </div>
            </div>

            <Categories />
            <Footer />
        </div>
    )
}
