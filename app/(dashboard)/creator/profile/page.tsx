export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/utils/supabase/server'
import CreatorProfileClient from './CreatorProfileClient'

export default async function CreatorProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Portfolio Count (for profile completion checks inside client if needed)
    const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('creator_id', user.id)

    // Fetch Creator Services (Pricing)
    const { data: services } = await supabase
        .from('creator_services')
        .select('*')
        .eq('creator_id', user.id)

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-sans font-black text-[#0EA5E9] mb-2 uppercase tracking-tighter">Editor Profile</h1>
                    <p className="text-sm md:text-base text-gray-500">Manage your identity and expertise.</p>
                </div>

            </div>

            {/* Client Component handles the accordion flow */}
            <CreatorProfileClient
                profile={profile}
                portfolioItems={portfolioItems || []}
                services={services || []}
            />
        </div>
    )
}
