export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, ShieldCheck, ArrowLeft } from 'lucide-react'
import HireCreatorForm from './HireCreatorForm'
import { categories } from '@/app/data/categories'
import { Suspense } from 'react'

export default async function HireCreatorPage({ params }: { params: Promise<{ creatorId: string }> }) {
    const supabase = await createClient()
    const { creatorId: rawId } = await params
    const creatorId = rawId?.trim()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        // Safe redirect
        return redirect(`/login?next=/client/hire/${encodeURIComponent(creatorId)}`)
    }

    // Fetch creator details
    const { data: creator } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', creatorId)
        .single()

    console.log('[SMS DEBUG] Hire Page Fetching Creator:', creatorId, {
        found: !!creator,
        name: creator?.full_name
    })
    const { data: services } = await supabase
        .from('creator_services')
        .select('*')
        .eq('creator_id', creatorId)

    if (!creator) {
        return <div>Creator not found</div>
    }

    const specializations = creator.specializations || []

    return (
        <div className="min-h-screen bg-white pb-10">
            {/* Simple Header */}
            <div className="bg-[#E0F2FE]/40 pt-8 pb-8 px-4 relative">
                <div className="max-w-2xl mx-auto relative z-10">
                    <div className="mb-4">
                        <Link
                            href={`/client/creator/${creatorId}`}
                            className="inline-flex items-center px-6 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#0EA5E9] hover:bg-slate-50 active:scale-95 transition-all shadow-sm group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-sky-100 shadow-sm overflow-hidden flex-shrink-0">
                            {creator.avatar_url ? (
                                <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-sky-200" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-sans font-black text-slate-900 leading-tight truncate uppercase tracking-tighter">
                                Hire {creator.display_name || creator.full_name || 'Creator'}
                            </h1>
                            {creator.username && (
                                <p className="text-[10px] text-slate-500 font-medium">@{creator.username}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-4">
                <div className="bg-white rounded-[2rem] p-4 md:p-10 shadow-xl shadow-sky-100/50 border border-sky-50 relative z-20">
                    <div className="mb-6 pb-3 border-b border-slate-50">
                        <h2 className="text-base font-sans font-black text-slate-900 uppercase tracking-widest">Project Details</h2>
                    </div>

                    <div className="min-h-[400px]">
                        <Suspense fallback={
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-slate-50 rounded w-1/4"></div>
                                <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
                                <div className="h-4 bg-slate-50 rounded w-1/3 mt-8"></div>
                                <div className="h-64 bg-slate-50 rounded-[2rem] w-full"></div>
                            </div>
                        }>
                            <HireCreatorForm
                                creatorId={creatorId}
                                isBusy={!!creator.is_busy}
                                specializations={specializations}
                                services={services || []}
                                languages={creator.languages || []}
                            />
                        </Suspense>
                    </div>
                </div>

                <div className="mt-6 text-center opacity-30">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Secure Escrow</span>
                    </div>
                    <p className="text-[8px] font-medium text-slate-500">
                        Funds held safely until work is approved.
                    </p>
                </div>
            </div>
        </div>
    )
}
