import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, ShieldCheck, ArrowRight, Briefcase, TrendingUp, Star } from 'lucide-react'
import { categories } from '@/app/data/categories'
import PortfolioCategoryAccordion from '@/app/(dashboard)/creator/profile/PortfolioCategoryAccordion'

export default async function CreatorProfileView({ params }: { params: Promise<{ creatorId: string }> }) {
    const supabase = await createClient()
    const { creatorId: rawId } = await params
    const creatorId = rawId?.trim()

    // 1. Parallel Fetch: Auth, Profile, Portfolio, Services, Reviews
    const [authResponse, profileResponse, portfolioResponse, servicesResponse, reviewsResponse] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('profiles').select('*').eq('id', creatorId).single(),
        supabase.from('portfolio_items').select('*').eq('creator_id', creatorId),
        supabase.from('creator_services').select('*').eq('creator_id', creatorId),
        supabase.from('reviews')
            .select('*, client:profiles(display_name, avatar_url)')
            .eq('creator_id', creatorId)
            .order('created_at', { ascending: false })
    ])

    const user = authResponse.data.user
    const creator = profileResponse.data
    const portfolioItems = portfolioResponse.data
    const services = servicesResponse.data
    const reviews = reviewsResponse.data || []

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
                                href={`/client/hire/${creatorId}`}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0EA5E9] text-white font-bold text-sm rounded-lg hover:bg-[#0284c7] transition-all shadow-sm active:scale-95"
                            >
                                Hire Me
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 font-medium mb-6" dir="auto">
                        {creator.tagline || 'Client Creator'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-bold text-slate-900">{creator.rating_avg ? creator.rating_avg.toFixed(1) : '0.0'}</span>
                                <span className="text-[10px] text-slate-400 font-medium">({creator.total_reviews || 0})</span>
                            </div>
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

                                    {/* If Packages, show a clickable grid of tiers */}
                                    {service?.pricing_mode === 'packages' && service.service_packages && (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 px-2">
                                            {Object.entries(service.service_packages).map(([tier, pkg]: [string, any]) => (
                                                <Link
                                                    key={tier}
                                                    href={`/client/hire/${creatorId}?category=${slug}&tier=${tier}`}
                                                    className="bg-white border border-[#F0F9FF] rounded-xl p-4 shadow-sm hover:border-[#0EA5E9] hover:shadow-md hover:-translate-y-1 transition-all group/tier"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${tier === 'basic' ? 'bg-blue-50 text-blue-600' :
                                                            tier === 'standard' ? 'bg-orange-50 text-orange-600' :
                                                                'bg-purple-50 text-purple-600'
                                                            }`}>
                                                            {tier}
                                                        </span>
                                                        <span className="text-sm font-black text-[#0EA5E9]">AED {pkg.price}</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight mb-2 group-hover/tier:text-[#0EA5E9] transition-colors">{pkg.title}</h4>
                                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-4">{pkg.description}</p>
                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#0EA5E9] uppercase tracking-widest pt-2 border-t border-slate-50">
                                                        Select Package
                                                        <ArrowRight size={10} className="group-hover/tier:translate-x-1 transition-transform" />
                                                    </div>
                                                </Link>
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

            {/* Reviews Section */}
            <div className="mt-16 border-t border-slate-100 pt-16">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-xl font-bold text-[#1E293B]">Client Reviews</h3>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-bold text-amber-700">{creator.rating_avg?.toFixed(1)} Rating</span>
                        </div>
                    )}
                </div>

                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review: any) => (
                            <div key={review.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-50">
                                            {review.client?.avatar_url ? (
                                                <Image src={review.client.avatar_url} alt="" width={32} height={32} />
                                            ) : (
                                                <User className="w-4 h-4 text-slate-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{review.client?.display_name || 'Anonymous'}</p>
                                            <p className="text-[9px] text-slate-400 font-medium">Verified Hire</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className={`${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-100'}`} />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-xs text-slate-600 leading-relaxed italic" dir="auto">
                                        "{review.comment}"
                                    </p>
                                )}
                                <p className="mt-4 text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                                    {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-100">
                        <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 text-sm font-medium italic">No reviews yet. Be the first to work with {creator.display_name}!</p>
                    </div>
                )}
            </div>

            {/* Footer Hire CTA */}
            <div className="mt-12 text-center">
                <h3 className="text-2xl font-serif font-bold text-[#1E293B] mb-4">Ready to work with {creator.display_name}?</h3>
                <Link
                    href={`/client/hire/${creatorId}`}
                    className="inline-block px-8 py-4 bg-[#0EA5E9] text-white font-bold text-lg rounded-xl hover:bg-[#2e3b29] transition-all shadow-xl hover:shadow-2xl active:scale-95"
                >
                    Start a Project
                </Link>
                <div className="mt-4 flex items-center justify-center text-xs text-gray-400 gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Protected by Client Creator Guarantee</span>
                </div>
            </div>

        </div>
    )
}
