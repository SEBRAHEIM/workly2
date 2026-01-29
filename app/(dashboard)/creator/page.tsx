import { Briefcase, TrendingUp, Users, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import DashboardHeader from './DashboardHeader'

export default async function CreatorDashboard() {
    const supabase = await createClient()
    // Parallel fetch for user auth and base profile data
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    // 2. Parallel fetch for all dashboard requirements
    const [profileRes, portfolioRes, requestsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('portfolio_items').select('id', { count: 'exact', head: true }).eq('creator_id', user.id),
        supabase.from('projects').select('*').eq('creator_id', user.id).eq('status', 'requested').order('created_at', { ascending: false }).limit(5)
    ])

    const profile = profileRes.data
    const portfolioCount = portfolioRes.count || 0
    const recentRequests = requestsRes.data

    // Check Completion
    const hasBio = profile?.bio && profile.bio.length > 10
    const hasSpecialization = profile?.specializations && profile.specializations.length > 0
    const hasPortfolio = portfolioCount > 0

    const isProfileComplete = hasBio && hasSpecialization && hasPortfolio

    // ----------------------------------------------------------------------
    // 1. INCOMPLETE STATE: Show "Set Up Account" CTA
    // ----------------------------------------------------------------------
    if (!isProfileComplete) {
        return (
            <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Briefcase className="w-8 h-8 text-[#0EA5E9]" />
                        </div>
                        <h1 className="text-5xl font-serif font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
                            Welcome, <br /> <span className="text-[#0EA5E9]">Creator.</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
                            To start receiving project requests and receive payouts, establish your digital profile.
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-sky-50 shadow-2xl shadow-sky-100/50 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                <div className="w-12 h-[1px] bg-sky-100" />
                                Action Required
                            </h2>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center p-6 rounded-3xl bg-sky-50/50 border border-sky-100 transition-all group-hover:bg-white group-hover:shadow-xl group-hover:shadow-sky-50">
                                    {(hasSpecialization && hasBio) ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-5 flex-shrink-0" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 mr-5 flex-shrink-0" />
                                    )}
                                    <div>
                                        <h3 className={`font-black uppercase tracking-tight ${(hasSpecialization && hasBio) ? 'text-slate-800' : 'text-slate-400'}`}>
                                            Identity & Expertise
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium">Define your vertical and professional bio.</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-6 rounded-3xl bg-sky-50/50 border border-sky-100 transition-all group-hover:bg-white group-hover:shadow-xl group-hover:shadow-sky-50">
                                    {hasPortfolio ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-5 flex-shrink-0" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 mr-5 flex-shrink-0" />
                                    )}
                                    <div>
                                        <h3 className={`font-black uppercase tracking-tight ${hasPortfolio ? 'text-slate-800' : 'text-slate-400'}`}>
                                            Portfolio Assets
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium">Upload at least one high-quality deliverable.</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/creator/profile"
                                className="w-full bg-slate-900 text-white text-center font-black py-5 rounded-full hover:bg-[#0EA5E9] transition-all shadow-xl hover:shadow-[#0EA5E9]/20 flex items-center justify-center group uppercase tracking-widest text-xs"
                            >
                                Complete Identity Setup
                                <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        {/* Decorative Background Icon */}
                        <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none rotate-12 group-hover:rotate-0 duration-1000">
                            <Briefcase className="w-[500px] h-[500px] text-slate-900" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ----------------------------------------------------------------------
    // 2. COMPLETE STATE: Show Standard Dashboard
    // ----------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <DashboardHeader />

                {/* Recent Requests */}
                <div className="mt-20">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-sky-100" />
                        Inbound Requests
                    </h2>

                    {recentRequests && recentRequests.length > 0 ? (
                        <div className="grid gap-6">
                            {recentRequests.map(project => (
                                <Link
                                    href={`/creator/projects/${project.id}`}
                                    key={project.id}
                                    className="block bg-white hover:bg-sky-50/30 rounded-[2rem] p-8 border border-sky-50 shadow-sm transition-all duration-300 group relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 relative z-10">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-[#0EA5E9] transition-colors uppercase tracking-tight" dir="auto">{project.title}</h3>
                                            <p className="text-slate-500 font-medium line-clamp-1 max-w-2xl" dir="auto">{project.description}</p>
                                        </div>
                                        <div className="flex items-center justify-center w-full md:w-auto text-white font-black text-[10px] uppercase tracking-widest bg-slate-900 group-hover:bg-[#0EA5E9] px-8 py-4 rounded-full transition-all shadow-xl group-hover:shadow-sky-100">
                                            Review Brief
                                            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Abstract background hover design */}
                                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-[#0EA5E9]">
                                            <TrendingUp size={20} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-sky-50 rounded-[2.5rem] p-20 border border-sky-100 text-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <Briefcase className="w-8 h-8 text-sky-200" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 uppercase tracking-tight">System Status: Active</h3>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                    Your profile is visible to all students. Inbound requests will be prioritized here.
                                </p>
                            </div>

                            {/* Decorative background design */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/50 rounded-full blur-3xl" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
