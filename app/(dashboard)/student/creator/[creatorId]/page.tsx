import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, ShieldCheck, ArrowRight, Briefcase, TrendingUp } from 'lucide-react'
import { categories } from '@/app/data/categories'
import PortfolioCategoryAccordion from '@/app/(dashboard)/creator/profile/PortfolioCategoryAccordion'

export default async function CreatorProfileView({ params }: { params: Promise<{ creatorId: string }> }) {
    const supabase = await createClient()
    const { creatorId: rawId } = await params
    const creatorId = rawId?.trim()

    // 1. Parallel Fetch: Auth, Profile, Portfolio, Services
    const [authResponse, profileResponse, portfolioResponse, servicesResponse] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('profiles').select('*').eq('id', creatorId).single(),
        supabase.from('portfolio_items').select('*').eq('creator_id', creatorId),
        supabase.from('creator_services').select('*').eq('creator_id', creatorId)
    ])

    const user = authResponse.data.user
    const creator = profileResponse.data
    const portfolioItems = portfolioResponse.data
    const services = servicesResponse.data

    if (!creator) {
        return <div className="p-20 text-center">Creator not found</div>
    }

    const specializations = creator.specializations || []

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-32">

            {/* Header / Identity */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left mb-8">
                <div className="relative">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-50 flex-shrink-0 flex items-center justify-center border border-slate-100 overflow-hidden relative">
                        {creator.avatar_url ? (
                            <Image
                                src={creator.avatar_url}
                                alt={creator.display_name || ''}
                                fill
                                className="object-cover"
                                sizes="112px"
                            />
                        ) : (
                            <User className="w-10 h-10 text-slate-300" />
                        )}
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1" dir="auto">
                                {creator.display_name || creator.full_name || 'Creator'}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                                {creator.username && (
                                    <span className="text-xs font-medium text-slate-400">
                                        @{creator.username}
                                    </span>
                                )}
                                {creator.languages && creator.languages.length > 0 && (
                                    <div className="flex gap-1">
                                        {creator.languages.map((lang: string) => (
                                            <span key={lang} className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <Link
                                href={`/student/hire/${creatorId}`}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0EA5E9] text-white font-bold text-sm rounded-lg hover:bg-[#0284c7] transition-all shadow-sm active:scale-95"
                            >
                                Hire Me
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 font-medium mb-6" dir="auto">
                        {creator.tagline || 'Student Creator'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level</span>
                            <span className="text-sm font-bold text-slate-900">{creator.level || 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                            <span className="text-sm font-bold text-slate-900">{creator.completed_projects || 0} Projects</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            {creator.bio && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-12">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">About Me</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
                        {creator.bio}
                    </p>
                </div>
            )}

            {/* Portfolio */}
            <div>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-xl font-bold text-[#1E293B]">Portfolio & Expertise</h3>
                </div>

                {specializations.length > 0 ? (
                    <div className="space-y-6">
                        {specializations.map((slug: string) => {
                            const category = categories.find(c => c.slug === slug)
                            if (!category) return null

                            const items = portfolioItems?.filter((i: any) => i.category_slug === slug) || []
                            const service = services?.find(s => s.category_slug === slug)

                            return (
                                <div key={slug} className="group">
                                    {/* Pricing Header for Category */}
                                    <div className="flex items-center justify-between mb-2 px-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{category.title}</span>
                                                {creator.languages && creator.languages.length > 0 && (
                                                    <div className="flex gap-1 items-center">
                                                        {creator.languages.map((lang: string) => {
                                                            const displayAbbr = lang === 'English' ? 'EN' : lang === 'العربية' ? 'ع' : lang.substring(0, 2).toUpperCase()
                                                            return (
                                                                <span key={lang} className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-sm border border-gray-200">
                                                                    {displayAbbr}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            {service?.pricing_mode === 'fixed' && (
                                                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded text-[10px] font-bold uppercase">Fixed Rate: AED {service.base_price}</span>
                                            )}
                                            {service?.pricing_mode === 'packages' && (
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-bold uppercase">Tiered Packages</span>
                                            )}
                                        </div>
                                    </div>

                                    <PortfolioCategoryAccordion
                                        category={{
                                            slug: category.slug,
                                            title: category.title
                                        }}
                                        items={items}
                                        readOnly={true}
                                    />

                                    {/* If Packages, show a compact grid of tiers */}
                                    {service?.pricing_mode === 'packages' && service.service_packages && (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 px-2">
                                            {Object.entries(service.service_packages).map(([tier, pkg]: [string, any]) => (
                                                <div key={tier} className="bg-white border border-[#F0F9FF] rounded-xl p-3 shadow-sm hover:border-[#0EA5E9] transition-all">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-bold uppercase text-gray-400">{tier}</span>
                                                        <span className="text-sm font-bold text-[#0EA5E9]">AED {pkg.price}</span>
                                                    </div>
                                                    <h4 className="text-xs font-bold text-[#333] truncate mb-1">{pkg.title}</h4>
                                                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">{pkg.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 italic p-4">This creator hasn't listed any specializations yet.</p>
                )}
            </div>

            {/* Footer Hire CTA */}
            <div className="mt-12 text-center">
                <h3 className="text-2xl font-serif font-bold text-[#1E293B] mb-4">Ready to work with {creator.display_name}?</h3>
                <Link
                    href={`/student/hire/${creatorId}`}
                    className="inline-block px-8 py-4 bg-[#0EA5E9] text-white font-bold text-lg rounded-xl hover:bg-[#2e3b29] transition-all shadow-xl hover:shadow-2xl active:scale-95"
                >
                    Start a Project
                </Link>
                <div className="mt-4 flex items-center justify-center text-xs text-gray-400 gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Protected by Student Creator Guarantee</span>
                </div>
            </div>

        </div>
    )
}
