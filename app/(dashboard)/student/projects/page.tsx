import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Briefcase, Clock, CheckCircle, AlertCircle, TrendingUp, Archive, XCircle } from 'lucide-react'

// Helper to filter projects
const isRecent = (dateStr: string | null) => {
    if (!dateStr) return false
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
    return new Date(dateStr) > fortyEightHoursAgo
}

export default async function StudentProjectsPage(props: {
    searchParams: Promise<{ tab?: string }>
}) {
    const searchParams = await props.searchParams
    const tab = searchParams.tab || 'active'
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
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

    if (!projects) return <div>Failed to load projects</div>

    // Categorization
    const activeProjects = projects.filter(p =>
        ['pending', 'countered', 'negotiating', 'requested'].includes(p.status)
    )

    const acceptedProjects = projects.filter(p =>
        ['accepted', 'agreed', 'in_progress', 'submitted', 'completed'].includes(p.status)
    )

    const closedProjects = projects.filter(p =>
        ['declined', 'cancelled', 'expired'].includes(p.status) && isRecent(p.closed_at)
    )

    const archivedProjects = projects.filter(p =>
        p.status === 'archived' ||
        (['declined', 'cancelled', 'expired'].includes(p.status) && !isRecent(p.closed_at))
    )


    let currentList = activeProjects
    if (tab === 'accepted') currentList = acceptedProjects
    if (tab === 'closed') currentList = closedProjects
    if (tab === 'archived') currentList = archivedProjects

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <h1 className="text-4xl font-serif font-bold text-[#3E4C37] mb-8">My Projects</h1>

            {/* TABS */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                <Link href="/student/projects"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'active' ? 'bg-[#3E4C37] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    Active ({activeProjects.length})
                </Link>
                <Link href="/student/projects?tab=accepted"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'accepted' ? 'bg-[#3E4C37] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    Accepted ({acceptedProjects.length})
                </Link>
                <Link href="/student/projects?tab=closed"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'closed' ? 'bg-[#3E4C37] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    Recent ({closedProjects.length})
                </Link>
                <Link href="/student/projects?tab=archived"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'archived' ? 'bg-[#3E4C37] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    Archive ({archivedProjects.length})
                </Link>
            </div>

            {/* LIST */}
            {currentList.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#E6E2D6]">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#333333]">No {tab} projects found</h3>
                    {tab === 'active' && (
                        <Link
                            href="/"
                            className="inline-block mt-6 bg-[#3E4C37] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2e3b29] transition-colors"
                        >
                            Browse Creators
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-6">
                    {currentList.map((project) => (
                        <Link
                            key={project.id}
                            href={`/student/projects/${project.id}`}
                            className="block bg-white rounded-2xl p-6 border border-[#E6E2D6] hover:shadow-lg transition-all group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <h3 className="text-xl font-bold text-[#333333] group-hover:text-[#3E4C37] transition-colors">
                                            {project.title}
                                        </h3>
                                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold uppercase 
                                            ${['accepted', 'agreed'].includes(project.status) ? 'bg-green-100 text-green-700' :
                                                ['pending', 'countered', 'negotiating'].includes(project.status) ? 'bg-orange-100 text-orange-700' :
                                                    ['declined', 'cancelled'].includes(project.status) ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Working with <span className="font-semibold text-[#333333]">{project.creator.full_name || project.creator.username}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {project.status === 'declined' ? `Closed at ${new Date(project.closed_at).toLocaleDateString()}` : `Updated ${new Date(project.created_at).toLocaleDateString()}`}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Price</p>
                                    <p className="text-2xl font-bold text-[#3E4C37]">
                                        {project.current_price ? `AED ${project.current_price}` : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
