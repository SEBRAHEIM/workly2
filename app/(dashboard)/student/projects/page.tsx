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

    // List projects that are either paid (escrow/released) or awaiting payment verification (pending)
    const confirmedProjects = projects.filter(p => ['escrow', 'released', 'pending'].includes(p.funds_status))

    // Categorization
    // 1. Active: Paid and currently in progress
    const activeProjects = confirmedProjects.filter(p =>
        ['accepted', 'agreed', 'in_progress', 'submitted'].includes(p.status)
    )

    // 2. Recent: Completed, cancelled, or declined within 48 hours
    const recentProjects = confirmedProjects.filter(p =>
        ['completed', 'cancelled', 'declined'].includes(p.status) && isRecent(p.closed_at || p.updated_at)
    )

    // 3. Archive: Everything else that was paid but is now old or closed
    const archivedProjects = confirmedProjects.filter(p =>
        !activeProjects.includes(p) && !recentProjects.includes(p)
    )

    let currentList = activeProjects
    if (tab === 'recent') currentList = recentProjects
    if (tab === 'archive') currentList = archivedProjects

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Our <br /> <span className="text-[#0EA5E9]">Projects.</span>
                    </h1>
                </div>

                {/* TABS */}
                <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide border-b border-sky-50">
                    <Link href="/student/projects"
                        className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'active' ? 'bg-[#0EA5E9] text-white shadow-lg shadow-sky-100' : 'bg-white text-slate-400 hover:text-slate-600'}`}>
                        Active ({activeProjects.length})
                    </Link>
                    <Link href="/student/projects?tab=recent"
                        className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'recent' ? 'bg-[#0EA5E9] text-white shadow-lg shadow-sky-100' : 'bg-white text-slate-400 hover:text-slate-600'}`}>
                        Recent ({recentProjects.length})
                    </Link>
                    <Link href="/student/projects?tab=archive"
                        className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'archive' ? 'bg-[#0EA5E9] text-white shadow-lg shadow-sky-100' : 'bg-white text-slate-400 hover:text-slate-600'}`}>
                        Archive ({archivedProjects.length})
                    </Link>
                </div>

                {/* LIST */}
                {currentList.length === 0 ? (
                    <div className="bg-sky-50 rounded-3xl p-16 text-center border border-sky-100">
                        <Briefcase className="w-16 h-16 text-sky-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">No {tab} projects found</h3>
                        {tab === 'active' && (
                            <Link
                                href="/"
                                className="inline-block mt-6 bg-[#0EA5E9] text-white font-black text-[10px] uppercase tracking-widest py-4 px-10 rounded-full hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
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
                                className="block bg-white rounded-[2rem] p-8 border border-sky-50 hover:shadow-2xl hover:shadow-sky-100 transition-all group relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                                    <div className="mb-6 md:mb-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-black text-slate-800 group-hover:text-[#0EA5E9] transition-colors uppercase tracking-tight" dir="auto">
                                                {project.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                                                ${['accepted', 'agreed', 'in_progress', 'submitted'].includes(project.status) ? 'bg-sky-100 text-[#0EA5E9]' :
                                                    ['pending', 'countered', 'negotiating'].includes(project.status) ? 'bg-orange-50 text-orange-600' :
                                                        ['declined', 'cancelled'].includes(project.status) ? 'bg-slate-100 text-slate-500' :
                                                            'bg-slate-50 text-slate-400'
                                                }`}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">
                                            Partnered with <span className="text-slate-900 font-bold">{project.creator.full_name || project.creator.username}</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-4">
                                            ID: {project.id.slice(0, 8)} • {project.status === 'declined' ? `Closed ${new Date(project.closed_at).toLocaleDateString()}` : `Updated ${new Date(project.created_at).toLocaleDateString()}`}
                                        </p>
                                    </div>

                                    <div className="md:text-right w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-sky-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Value</p>
                                        <div className="flex items-baseline md:justify-end gap-1">
                                            <span className="text-xs font-bold text-sky-400 uppercase">AED</span>
                                            <span className="text-3xl font-serif font-black text-slate-900">
                                                {project.current_price || '0.00'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Background Decorative Overlay */}
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-[#0EA5E9]">
                                        <TrendingUp size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
