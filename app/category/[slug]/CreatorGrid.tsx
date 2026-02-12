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
            .select('id, display_name, full_name, avatar_url, tagline, level, languages')
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

                        {/* Overlay Link - Makes whole card clickable */}
                        {user && (
                            <Link href={profileUrl} className="absolute inset-0 z-10 rounded-2xl" aria-label={`View ${creator.display_name}'s profile`} />
                        )}

                        {/* Header: Identity */}
                        <div className="flex items-start gap-3 mb-3 relative">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-[#F0F9FF] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-center group-hover:scale-105 transition-transform relative">
                                    {creator.avatar_url ? (
                                        <Image
                                            src={creator.avatar_url}
                                            alt={creator.display_name || ''}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center justify-between">
                                    <div className="group-hover:text-[#0EA5E9] transition-colors">
                                        <h3 className="font-serif font-bold text-base text-[#1E293B] truncate pr-2">
                                            {creator.display_name || creator.full_name || 'Creator'}
                                        </h3>
                                    </div>
                                    {user && (
                                        <div className="flex-shrink-0 relative z-20"> {/* Button above overlay */}
                                            <FavoriteButton creatorId={creator.id} initialIsFavorite={isFavorite} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                    {creator.tagline || 'Student Creator'}
                                </p>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 font-medium mb-4 pt-3 border-t border-[#F9F7F2] relative">
                            <span className="bg-[#F0F9FF] text-[#555] px-2 py-0.5 rounded-md whitespace-nowrap">
                                Level {creator.level || 1}
                            </span>
                            {creator.languages && creator.languages.length > 0 && (
                                <div className="flex gap-1 items-center">
                                    {creator.languages.map((lang: string) => {
                                        const displayAbbr = lang === 'English' ? 'EN' : lang === 'العربية' ? 'ع' : lang.substring(0, 2).toUpperCase()
                                        return (
                                            <span key={lang} className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-[#0EA5E9]/5 text-[#0EA5E9] rounded-md border border-[#0EA5E9]/10">
                                                {displayAbbr}
                                            </span>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {!user ? (
                            <Link
                                href="/join"
                                className="block w-full bg-[#1E293B] text-white text-center font-bold text-sm py-3 rounded-lg hover:bg-[#0EA5E9] active:scale-95 transition-all shadow-sm relative z-20"
                            >
                                Contact
                            </Link>
                        ) : (
                            <Link
                                href={`/student/hire/${creator.id}`}
                                className="block w-full bg-[#1E293B] text-white text-center font-bold text-sm py-3 rounded-lg hover:bg-[#0EA5E9] active:scale-95 transition-all shadow-sm group-hover:shadow-md relative z-20"
                            >
                                Hire
                            </Link>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
