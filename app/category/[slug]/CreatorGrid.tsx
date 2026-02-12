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
            .select('id, display_name, full_name, avatar_url, tagline, level, languages, rating_avg, total_reviews')
            .not('display_name', 'is', null)
            .contains('specializations', categorySlug ? [categorySlug] : []),
        user ? supabase
            .from('favorite_creators')
            .select('creator_id')
            .eq('student_id', user.id) : Promise.resolve({ data: null })
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creators.map((creator) => {
                const isFavorite = favoriteIds.has(creator.id)
                const profileUrl = `/student/creator/${creator.id}`

                return (
                    <div key={creator.id} className="bg-white rounded-2xl p-5 border border-[#F0F9FF] shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full">

                        {/* Header: Identity - Now clearly interactive */}
                        <div className="flex items-start gap-4 mb-4 relative z-20">
                            <Link href={profileUrl} className="flex-shrink-0 group/avatar">
                                <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-center group-hover/avatar:scale-105 group-hover/avatar:shadow-md transition-all relative">
                                    {creator.avatar_url ? (
                                        <Image
                                            src={creator.avatar_url}
                                            alt={creator.display_name || ''}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-sky-200" />
                                    )}
                                </div>
                            </Link>

                            <div className="flex-1 min-w-0 pt-1">
                                <div className="flex items-center justify-between">
                                    <Link href={profileUrl} className="group/name block truncate">
                                        <h3 className="font-serif font-black text-lg text-[#1E293B] truncate pr-2 group-hover/name:text-[#0EA5E9] transition-colors">
                                            {creator.display_name || creator.full_name || 'Creator'}
                                        </h3>
                                    </Link>
                                    {user && (
                                        <div className="flex-shrink-0">
                                            <FavoriteButton creatorId={creator.id} initialIsFavorite={isFavorite} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    {creator.tagline || 'Student Creator'}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-6 pt-4 border-t border-slate-50 relative z-20">
                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 text-[9px] font-black uppercase px-2 py-1 rounded-lg border border-amber-100">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>{creator.rating_avg ? creator.rating_avg.toFixed(1) : '0.0'} ({creator.total_reviews || 0})</span>
                            </div>
                            <span className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase px-2 py-1 rounded-lg border border-slate-100">
                                Level {creator.level || 1}
                            </span>
                            {creator.languages && creator.languages.length > 0 && (
                                <div className="flex gap-1 items-center">
                                    {creator.languages.map((lang: string) => {
                                        const displayAbbr = lang === 'English' ? 'EN' : lang === 'العربية' ? 'ع' : lang.substring(0, 2).toUpperCase()
                                        return (
                                            <span key={lang} className="text-[9px] font-black uppercase px-2 py-1 bg-sky-50 text-[#0EA5E9] rounded-lg border border-sky-100">
                                                {displayAbbr}
                                            </span>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-2 relative z-20">
                            {!user ? (
                                <Link
                                    href="/join"
                                    className="block w-full bg-[#1E293B] text-white text-center font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-[#0EA5E9] active:scale-95 transition-all shadow-xl shadow-slate-100"
                                >
                                    Join to Contact
                                </Link>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href={profileUrl}
                                        className="bg-white text-[#1E293B] border border-slate-100 text-center font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-slate-50 hover:border-[#0EA5E9]/30 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                                    >
                                        View Portfolio
                                    </Link>
                                    <Link
                                        href={`/student/hire/${creator.id}`}
                                        className="bg-[#0EA5E9] text-white text-center font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:shadow-sky-200 active:scale-95 transition-all shadow-xl shadow-sky-100 flex items-center justify-center"
                                    >
                                        Hire Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
