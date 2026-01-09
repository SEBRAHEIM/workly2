import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, ShieldCheck, ArrowRight } from 'lucide-react'
import { categories } from '@/app/data/categories'
import PortfolioCategoryAccordion from '@/app/(dashboard)/creator/profile/PortfolioCategoryAccordion'

export default async function CreatorProfileView({ params }: { params: Promise<{ creatorId: string }> }) {
    const supabase = await createClient()
    const { creatorId: rawId } = await params
    const creatorId = rawId?.trim()

    // Public page, but nice to know if logged in
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch creator details
    const { data: creator } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', creatorId)
        .single()

    const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('creator_id', creatorId)

    // NEW: Fetch Pricing Services
    const { data: services } = await supabase
        .from('creator_services')
        .select('*')
        .eq('creator_id', creatorId)

    if (!creator) {
        return <div>Creator not found</div>
    }

    const specializations = creator.specializations || []

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-32">

            {/* Header / Identity */}
            {/* Header / Identity */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6E2D6] shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left mb-6">
                <div className="w-20 h-20 rounded-full bg-[#F3F0E9] flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-center">
                    {creator.avatar_url ? (
                        <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-serif font-bold text-[#333333] mb-1">
                        {creator.display_name || creator.full_name || 'Creator'}
                    </h1>
                    {creator.username && (
                        <p className="text-sm text-gray-400 font-medium mb-2">@{creator.username}</p>
                    )}
                    <p className="text-base text-[#3E4C37] font-medium mb-1">
                        {creator.tagline || 'Student Creator'}
                    </p>

                    {creator.languages && creator.languages.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mb-4">
                            {creator.languages.map((lang: string) => (
                                <span key={lang} className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#3E4C37]/10 text-[#3E4C37] rounded-md border border-[#3E4C37]/20">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-medium text-gray-500">
                        <span className="bg-[#F3F0E9] px-2 py-1 rounded-md text-[#333]">
                            Level {creator.level || 1}
                        </span>
                        <span>•</span>
                        <span>{creator.completed_projects || 0} Projects Completed</span>
                    </div>
                </div>

                {/* Hire Me Button (Header) */}
                <div className="flex-shrink-0 mt-4 md:mt-0">
                    <Link
                        href={`/student/hire/${creatorId}`}
                        className="inline-flex items-center px-6 py-3 bg-[#333333] text-white font-bold rounded-xl hover:bg-[#3E4C37] transition-all shadow-md active:scale-95"
                    >
                        Hire Me <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Bio */}
            {creator.bio && (
                <div className="bg-white rounded-[2rem] p-8 border border-[#E6E2D6] shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-[#333333] mb-4">About Me</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {creator.bio}
                    </p>
                </div>
            )}

            {/* Portfolio */}
            <div>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-xl font-bold text-[#333333]">Portfolio & Expertise</h3>
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
                                            {service?.pricing_mode === 'negotiable' && (
                                                <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded text-[10px] font-bold uppercase">Starting at AED {service.base_price} • Negotiable</span>
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
                                                <div key={tier} className="bg-white border border-[#E6E2D6] rounded-xl p-3 shadow-sm hover:border-[#3E4C37] transition-all">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-bold uppercase text-gray-400">{tier}</span>
                                                        <span className="text-sm font-bold text-[#3E4C37]">AED {pkg.price}</span>
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
                <h3 className="text-2xl font-serif font-bold text-[#333333] mb-4">Ready to work with {creator.display_name}?</h3>
                <Link
                    href={`/student/hire/${creatorId}`}
                    className="inline-block px-8 py-4 bg-[#3E4C37] text-white font-bold text-lg rounded-xl hover:bg-[#2e3b29] transition-all shadow-xl hover:shadow-2xl active:scale-95"
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
