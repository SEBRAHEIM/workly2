import Link from 'next/link'
import { User, Star, Briefcase, ShieldCheck } from 'lucide-react' // Added ShieldCheck
import { createClient } from '@/utils/supabase/server'
import FavoriteButton from '@/app/components/FavoriteButton' // Added FavoriteButton

export default async function CreatorGrid({
    categorySlug,
    showAll = false
}: {
    categorySlug?: string
    showAll?: boolean
}) {
    const supabase = await createClient()

    // 1. Fetch User (for favorites)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Build Query
    let query = supabase
        .from('profiles') // Assuming creators are just profiles for now, or filtered by role check if needed
        .select('*')
        .not('display_name', 'is', null) // Only show completed profiles

    // Filter by Specialization/Category
    if (categorySlug) {
        // Since specializations is an array/text, we use 'cs' (contains) for array or ilike for text
        // Based on previous code, it seems specializations is an array of slugs
        query = query.contains('specializations', [categorySlug])
    }

    const { data: creators, error } = await query

    if (!creators || creators.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No creators found in this category yet.</p>
            </div>
        )
    }

    // 3. Fetch Favorites for this user
    let favoriteIds = new Set<string>()
    if (user) {
        const { data: favorites } = await supabase
            .from('favorite_creators')
            .select('creator_id')
            .eq('student_id', user.id)

        if (favorites) {
            favorites.forEach(f => favoriteIds.add(f.creator_id))
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creators.map((creator) => {
                const isFavorite = favoriteIds.has(creator.id)
                const profileUrl = `/student/creator/${creator.id}`

                return (
                    <div key={creator.id} className="bg-white rounded-2xl p-5 border border-[#E6E2D6] shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full">

                        {/* Overlay Link - Makes whole card clickable */}
                        {user && (
                            <Link href={profileUrl} className="absolute inset-0 z-10 rounded-2xl" aria-label={`View ${creator.display_name}'s profile`} />
                        )}

                        {/* Header: Identity */}
                        <div className="flex items-start gap-3 mb-3 relative">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-[#F3F0E9] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-center group-hover:scale-105 transition-transform">
                                    {creator.avatar_url ? (
                                        <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center justify-between">
                                    <div className="group-hover:text-[#3E4C37] transition-colors">
                                        <h3 className="font-serif font-bold text-base text-[#333333] truncate pr-2">
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
                            <span className="bg-[#F3F0E9] text-[#555] px-2 py-0.5 rounded-md whitespace-nowrap">
                                Level {creator.level || 1}
                            </span>
                        </div>

                        {/* Actions */}
                        {!user ? (
                            <Link
                                href="/join"
                                className="block w-full bg-[#333333] text-white text-center font-bold text-sm py-3 rounded-lg hover:bg-[#3E4C37] active:scale-95 transition-all shadow-sm relative z-20"
                            >
                                Contact
                            </Link>
                        ) : (
                            <Link
                                href={`/student/hire/${creator.id}`}
                                className="block w-full bg-[#333333] text-white text-center font-bold text-sm py-3 rounded-lg hover:bg-[#3E4C37] active:scale-95 transition-all shadow-sm group-hover:shadow-md relative z-20"
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
