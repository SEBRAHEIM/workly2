import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, ShieldCheck } from 'lucide-react'
import FavoriteButton from '@/app/components/FavoriteButton'

export default async function FavoritesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch favorites
    const { data: favorites } = await supabase
        .from('favorite_creators')
        .select(`
            creator_id,
            profiles:creator_id (*)
        `)
        .eq('student_id', user.id)

    // Parse the result to get a list of creators
    const creators = favorites?.map((f: any) => f.profiles) || []

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-serif font-bold text-[#333333] mb-8">My Favorite Creators</h1>

            {creators.length === 0 ? (
                <div className="text-center py-24 bg-[#F9F7F2] rounded-3xl border border-[#E6E2D6]">
                    <h2 className="text-xl font-bold text-gray-400 mb-2">No favorites yet</h2>
                    <p className="text-gray-500 mb-8">Star creators you like to save them here.</p>
                    <Link
                        href="/"
                        className="inline-block bg-[#3E4C37] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#2e3b29] transition-all"
                    >
                        Browse Creators
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {creators.map((creator: any) => {
                        const profileUrl = `/student/creator/${creator.id}`
                        return (
                            <div key={creator.id} className="bg-white rounded-2xl p-5 border border-[#E6E2D6] shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full">

                                {/* Overlay Link */}
                                <Link href={profileUrl} className="absolute inset-0 z-10 rounded-2xl" aria-label={`View ${creator.display_name}'s profile`} />

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
                                            <div className="flex-shrink-0 relative z-20">
                                                <FavoriteButton creatorId={creator.id} initialIsFavorite={true} />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-1">
                                            {creator.tagline || 'Student Creator'}
                                        </p>
                                    </div>
                                </div>

                                {/* Spacer */}
                                <div className="flex-1"></div>

                                {/* Metadata Row */}
                                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-4 pt-3 border-t border-[#F9F7F2] relative">
                                    <span className="bg-[#F3F0E9] text-[#555] px-2 py-0.5 rounded-md">
                                        Level {creator.level || 1}
                                    </span>
                                </div>

                                {/* Actions */}
                                <Link
                                    href={`/student/hire/${creator.id}`}
                                    className="block w-full bg-[#333333] text-white text-center font-bold text-sm py-3 rounded-lg hover:bg-[#3E4C37] active:scale-95 transition-all shadow-sm group-hover:shadow-md relative z-20"
                                >
                                    Hire
                                </Link>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
