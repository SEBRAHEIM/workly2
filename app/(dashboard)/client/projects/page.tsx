import { createClient } from '@/utils/supabase/server'
import ProjectListClient from './ProjectListClient'

export const dynamic = 'force-dynamic'

export default async function ClientProjectsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    const { data: projects } = await supabase
        .from('projects')
        .select(`
            *,
            creator:creator_id (
                full_name,
                username,
                avatar_url
            )
        `)
        .eq('client_id', user.id)
        .neq('funds_status', 'unpaid')
        .order('created_at', { ascending: false })

    if (!projects) return <div>Failed to load projects</div>

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <ProjectListClient projects={projects as any} />
        </div>
    )
}
