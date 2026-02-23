import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, ShieldCheck, Star } from 'lucide-react'
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
            profiles:creator_id (id, display_name, full_name, avatar_url, tagline, level, rating_avg, total_reviews)
        `)
        .eq('client_id', user.id)

    // Parse the result to get a list of creators
    const creators = favorites?.map((f: any) => f.profiles) || []

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">
                        Curated <br /> <span className="text-[#0EA5E9]">Talent.</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Your collection of elite client creators.</p>
                </div>

                {creators.length === 0 ? (
                    <div className="bg-sky-50 rounded-[2.5rem] p-16 text-center border border-sky-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <User className="w-8 h-8 text-sky-200" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2 uppercase tracking-tight">No favorites yet</h2>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Star creators you like to save them here for quick access.</p>
                        <Link
                            href="/"
                            className="inline-block bg-[#0EA5E9] text-white font-black text-[10px] uppercase tracking-widest py-4 px-10 rounded-full hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
                        >
                            Browse Creators
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {creators.map((creator: any) => {
                            const profileUrl = `/client/creator/${creator.id}`
                            return (
                                <div key={creator.id} className="bg-white rounded-[2rem] p-8 border border-sky-50 shadow-sm hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 relative group flex flex-col h-full overflow-hidden">
                                    {/* Header: Identity - Now clearly interactive */}
                                    <div className="flex items-start gap-5 mb-6 relative z-20">
                                        <Link href={profileUrl} className="flex-shrink-0 group/avatar">
                                            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100 overflow-hidden text-center group-hover/avatar:scale-105 group-hover/avatar:shadow-md transition-all duration-500">
                                                {creator.avatar_url ? (
                                                    <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-6 h-6 text-sky-200" />
                                                )}
                                            </div>
                                        </Link>

                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex items-start justify-between">
                                                <Link href={profileUrl} className="group/name block truncate">
                                                    <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight leading-tight group-hover/name:text-[#0EA5E9] transition-colors truncate">
                                                        {creator.display_name || creator.full_name || 'Creator'}
                                                    </h3>
                                                </Link>
                                                <div className="flex-shrink-0 relative z-30 ml-2">
                                                    <FavoriteButton creatorId={creator.id} initialIsFavorite={true} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-amber-100">
                                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                    <span>{creator.rating_avg ? creator.rating_avg.toFixed(1) : '0.0'} ({creator.total_reviews || 0})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tagline */}
                                    <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed h-[2.5rem]">
                                        {creator.tagline || 'Excellence in client delivery and creative innovation.'}
                                    </p>

                                    {/* Spacer */}
                                    <div className="flex-1"></div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 relative z-20">
                                        <Link
                                            href={profileUrl}
                                            className="bg-white text-slate-900 border border-slate-100 text-center font-black uppercase tracking-widest text-[9px] py-4 rounded-full hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
                                        >
                                            View Portfolio
                                        </Link>
                                        <Link
                                            href={`/client/hire/${creator.id}`}
                                            className="bg-slate-900 text-white text-center font-black uppercase tracking-widest text-[9px] py-4 rounded-full hover:bg-[#0EA5E9] active:scale-95 transition-all shadow-xl group-hover:shadow-sky-100 flex items-center justify-center"
                                        >
                                            Establish Contract
                                        </Link>
                                    </div>

                                    {/* Abstract Background Design */}
                                    <div className="absolute -bottom-10 -right-10 text-[120px] font-black text-sky-50/30 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 transition-all duration-700 pointer-events-none uppercase">
                                        {(creator.display_name || creator.full_name)?.[0]}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
