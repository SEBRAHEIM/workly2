import { Briefcase, TrendingUp, Users, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import DashboardHeader from './DashboardHeader'

export default async function CreatorDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Portfolio Count
    const { count: portfolioCount } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id)

    // Check Completion
    const hasBio = profile?.bio && profile.bio.length > 10
    const hasSpecialization = profile?.specializations && profile.specializations.length > 0
    const hasPortfolio = (portfolioCount || 0) > 0

    const isProfileComplete = hasBio && hasSpecialization && hasPortfolio

    // ----------------------------------------------------------------------
    // 1. INCOMPLETE STATE: Show "Set Up Account" CTA
    // ----------------------------------------------------------------------
    if (!isProfileComplete) {
        return (
            <div className="p-8 max-w-4xl mx-auto py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-[#3E4C37] mb-4">Welcome, Creator!</h1>
                    <p className="text-xl text-gray-500 max-w-xl mx-auto">
                        To start receiving project requests from students, you need to complete your profile identity.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-[#E6E2D6] shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-[#333333] mb-6">Action Required</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center p-4 rounded-xl bg-[#F3F0E9] border border-[#E6E2D6]">
                                {hasSpecialization && hasBio ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0" />
                                )}
                                <div>
                                    <h3 className={`font-bold ${hasSpecialization && hasBio ? 'text-[#333333]' : 'text-gray-500'}`}>
                                        Set Bio & Specializations
                                    </h3>
                                    <p className="text-sm text-gray-400">Tell students what you're good at.</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 rounded-xl bg-[#F3F0E9] border border-[#E6E2D6]">
                                {hasPortfolio ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0" />
                                )}
                                <div>
                                    <h3 className={`font-bold ${hasPortfolio ? 'text-[#333333]' : 'text-gray-500'}`}>
                                        Upload Portfolio Work
                                    </h3>
                                    <p className="text-sm text-gray-400">Showcase at least 1 example of your work.</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/creator/profile"
                            className="block w-full bg-[#3E4C37] text-white text-center font-bold py-4 rounded-xl hover:bg-[#2e3b29] transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                            Complete My Profile
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>

                    {/* Decorative Background */}
                    <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
                        <Briefcase className="w-96 h-96 text-[#3E4C37]" />
                    </div>
                </div>
            </div>
        )
    }

    // Fetch Recent Requests (Status = 'requested')
    const { data: recentRequests } = await supabase
        .from('projects')
        .select('*')
        .eq('creator_id', user.id)
        .eq('status', 'requested')
        .order('created_at', { ascending: false })
        .limit(5)

    // ----------------------------------------------------------------------
    // 2. COMPLETE STATE: Show Standard Dashboard
    // ----------------------------------------------------------------------
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <DashboardHeader />

            {/* Recent Requests */}
            <div>
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Recent Requests</h2>

                {recentRequests && recentRequests.length > 0 ? (
                    <div className="space-y-4">
                        {recentRequests.map(project => (
                            <Link
                                href={`/creator/projects/${project.id}`}
                                key={project.id}
                                className="block bg-white hover:bg-gray-50 rounded-2xl p-6 border border-[#E6E2D6] shadow-sm transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#333333] mb-1 group-hover:text-[#3E4C37] transition-colors" dir="auto">{project.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-1 max-w-md" dir="auto">{project.description}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-full md:w-auto text-[#3E4C37] font-bold text-sm bg-[#F3F0E9] px-4 py-3 md:py-2 rounded-xl">
                                        Review Request
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 border border-[#E6E2D6] shadow-sm text-center">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[#333333] mb-2">No new requests</h3>
                        <p className="text-gray-500">
                            When students send you project requirements, they will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
