import Link from 'next/link'
import Image from 'next/image'
import { User, Star, Briefcase, ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import FavoriteButton from '@/app/components/FavoriteButton'

export default async function CreatorGrid({
    categorySlug,
    showAll = false
}: {
    categorySlug?: string
    showAll?: boolean
}) {
    const supabase = await createClient()

    // 1. Get User First (needed for favorites query)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Parallel Fetch: Creators and Favorites (if user exists)
    const [creatorsResponse, favoritesResponse] = await Promise.all([
        supabase
            .from('profiles')
            .select('id, display_name, full_name, avatar_url, banner_url, tagline, level, languages, rating_avg, total_reviews')
            .not('display_name', 'is', null)
            .contains('specializations', categorySlug ? [categorySlug] : []),
        user ? supabase
            .from('favorite_creators')
            .select('creator_id')
            .eq('client_id', user.id) : Promise.resolve({ data: null })
    ])

    const creators = creatorsResponse.data
    const favoriteIds = new Set(favoritesResponse.data?.map(f => f.creator_id) || [])

    if (!creators || creators.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No creators found in this category yet.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => {
                const isFavorite = favoriteIds.has(creator.id)
                const profileUrl = `/client/creator/${creator.id}`

                return (
                    <div key={creator.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 relative group flex flex-col h-full overflow-hidden">

                        {/* Banner Section */}
                        <div className="relative h-24 overflow-hidden bg-slate-100">
                            {creator.banner_url ? (
                                <Image
                                    src={creator.banner_url}
                                    alt="banner"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 opacity-80" />
                            )}
                            {/* Favorite Button Overlay */}
                            {user && (
                                <div className="absolute top-3 right-3 z-30">
                                    <FavoriteButton creatorId={creator.id} initialIsFavorite={isFavorite} />
                                </div>
                            )}
                        </div>

                        {/* Profile Content Container */}
                        <div className="px-5 pb-5 pt-0 flex flex-col flex-1 relative">
                            {/* Overlapping Avatar */}
                            <div className="relative -mt-10 mb-3 z-20 inline-block w-fit">
                                <Link href={profileUrl} className="block group/avatar">
                                    <div className="w-20 h-20 rounded-[22px] bg-white p-1 shadow-lg group-hover/avatar:scale-105 transition-transform duration-300">
                                        <div className="w-full h-full rounded-[18px] bg-slate-50 overflow-hidden relative border border-slate-100">
                                            {creator.avatar_url ? (
                                                <Image
                                                    src={creator.avatar_url}
                                                    alt={creator.display_name || ''}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-8 h-8 text-sky-200" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Identity */}
                            <div className="mb-4">
                                <Link href={profileUrl} className="group/name inline-block max-w-full">
                                    <h3 className="font-sans font-black text-xl text-slate-900 truncate group-hover/name:text-[#0EA5E9] transition-colors tracking-tighter uppercase leading-tight">
                                        {creator.display_name || creator.full_name || 'Creator'}
                                    </h3>
                                </Link>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 line-clamp-1">
                                    {creator.tagline || 'Expert Creative'}
                                </p>
                            </div>

                            {/* Metadata / Trust Row */}
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <div className="flex items-center gap-1.5 bg-amber-50/50 text-amber-600 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-100/50 backdrop-blur-sm">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                    <span>{creator.rating_avg ? creator.rating_avg.toFixed(1) : '0.0'} ({creator.total_reviews || 0})</span>
                                </div>
                                {creator.languages && creator.languages.length > 0 && (
                                    <div className="flex gap-1 items-center">
                                        {creator.languages.map((lang: string) => {
                                            const displayAbbr = lang === 'English' ? 'EN' : lang === 'العربية' ? 'ع' : lang.substring(0, 2).toUpperCase()
                                            return (
                                                <span key={lang} className="text-[9px] font-black uppercase px-2 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
                                                    {displayAbbr}
                                                </span>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-4 border-t border-slate-50">
                                {!user ? (
                                    <Link
                                        href="/join"
                                        className="block w-full bg-slate-900 text-white text-center font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-[#0EA5E9] active:scale-95 transition-all shadow-xl shadow-slate-100"
                                    >
                                        Join to Contact
                                    </Link>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href={profileUrl}
                                            className="bg-slate-50 text-slate-600 border border-slate-100 text-center font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-white hover:border-[#0EA5E9]/30 active:scale-95 transition-all flex items-center justify-center"
                                        >
                                            Portfolio
                                        </Link>
                                        <Link
                                            href={`/client/hire/${creator.id}`}
                                            className="bg-[#0EA5E9] text-white text-center font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:shadow-lg hover:shadow-sky-200 active:scale-95 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-2"
                                        >
                                            Hire
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
