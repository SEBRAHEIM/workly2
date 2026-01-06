import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, ShieldCheck } from 'lucide-react'
import HireCreatorForm from './HireCreatorForm'
import { categories } from '@/app/data/categories'

export default async function HireCreatorPage({ params }: { params: Promise<{ creatorId: string }> }) {
    const supabase = await createClient()
    const { creatorId: rawId } = await params
    const creatorId = rawId?.trim()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        // Safe redirect
        return redirect(`/login?next=/student/hire/${encodeURIComponent(creatorId)}`)
    }

    // Fetch creator details
    const { data: creator } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', creatorId)
        .single()

    const { data: services } = await supabase
        .from('creator_services')
        .select('*')
        .eq('creator_id', creatorId)

    if (!creator) {
        return <div>Creator not found</div>
    }

    const specializations = creator.specializations || []

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-32">

            {/* Minimal Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-[#F3F0E9] mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                    {creator.avatar_url ? (
                        <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#333333] mb-1">
                    Hire {creator.display_name || creator.full_name || 'Creator'}
                </h1>
                {creator.username && (
                    <p className="text-sm text-gray-400 font-medium mb-2">@{creator.username}</p>
                )}
                <p className="text-gray-500 text-sm mb-4">
                    {creator.tagline}
                </p>

                <Link
                    href={`/student/creator/${creatorId}`}
                    className="text-sm font-bold text-[#3E4C37] hover:underline"
                >
                    ← Back to Full Profile
                </Link>
            </div>

            {/* The Hire Form */}
            <div className="bg-white rounded-[2rem] p-8 border border-[#E6E2D6] shadow-xl">
                <div className="mb-6 pb-6 border-b border-[#E6E2D6]">
                    <h3 className="text-xl font-bold text-[#333333] mb-2">Project Details</h3>
                    <p className="text-gray-500 text-sm">
                        Defining your project clear and early leads to better results.
                    </p>
                </div>
                <HireCreatorForm
                    creatorId={creatorId}
                    creatorPhone={creator.whatsapp_phone}
                    creatorName={creator.display_name || creator.full_name || 'Creator'}
                    specializations={specializations}
                    services={services || []}
                />
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 mx-auto mb-2" />
                <p>Protected by Student Creator Guarantee. Funds held in escrow.</p>
            </div>

        </div>
    )
}
