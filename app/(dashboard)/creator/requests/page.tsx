import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, User, Clock, Download } from 'lucide-react'
import RequestCard from './RequestCard'

export default async function CreatorRequests(props: {
    searchParams: Promise<{ tab?: string }>
}) {
    const searchParams = await props.searchParams
    const tab = searchParams.tab || 'active'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login?next=/creator/requests')
    }

    // Fetch all projects for this creator
    const { data: requests } = await supabase
        .from('projects')
        .select(`
            *,
            student:student_id (
                full_name,
                username,
                avatar_url
            )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

    if (!requests) {
        console.error('[CREATOR_REQUESTS] Failed to fetch requests or requests is null');
        return <div>Failed to load requests</div>;
    }

    console.log(`[CREATOR_REQUESTS] Loaded ${requests.length} requests for user ${user.id}`);
    if (requests.length > 0) {
        console.log('[CREATOR_REQUESTS] Sample request:', requests[0]);
    }


    // Helper to filter recent closed deals (48h)
    const isRecent = (dateStr: string | null) => {
        if (!dateStr) return false
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
        return new Date(dateStr) > fortyEightHoursAgo
    }

    // Categorization
    const activeRequests = requests.filter(p =>
        ['requested', 'negotiating', 'pending', 'countered'].includes(p.status)
    )

    const ongoingRequests = requests.filter(p =>
        ['accepted', 'agreed', 'in_progress', 'submitted', 'revision_requested'].includes(p.status)
    )

    const closedRequests = requests.filter(p =>
        ['declined', 'cancelled', 'expired'].includes(p.status) && isRecent(p.closed_at)
    )

    const archivedRequests = requests.filter(p =>
        p.status === 'archived' ||
        (['declined', 'cancelled', 'expired'].includes(p.status) && !isRecent(p.closed_at))
    )


    let currentList = activeRequests
    if (tab === 'ongoing') currentList = ongoingRequests
    if (tab === 'completed') currentList = requests.filter(p => p.status === 'completed')
    if (tab === 'closed') currentList = closedRequests
    if (tab === 'archived') currentList = archivedRequests

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-serif font-bold text-[#0EA5E9]">Project Orders</h1>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                <Link href="/creator/requests"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'active' ? 'bg-[#0EA5E9] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    New Orders ({activeRequests.length})
                </Link>
                <Link href="/creator/requests?tab=ongoing"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'ongoing' ? 'bg-[#0EA5E9] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    Active Work ({ongoingRequests.length})
                </Link>
                <Link href="/creator/requests?tab=completed"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'completed' ? 'bg-[#0EA5E9] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    Completed ({requests.filter(p => p.status === 'completed').length})
                </Link>
                <Link href="/creator/requests?tab=closed"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${tab === 'closed' ? 'bg-[#0EA5E9] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    Cancelled ({closedRequests.length})
                </Link>
            </div>

            {currentList.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#F0F9FF] shadow-sm overflow-hidden min-h-[400px] flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#0EA5E9]">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1E293B] mb-2">No {tab} requests</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            {tab === 'active' ? 'Requests from students will appear here.' : `You have no ${tab} requests.`}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {currentList.map((req) => (
                        <RequestCard key={req.id} req={req} />
                    ))}
                </div>
            )}
        </div>
    )
}
