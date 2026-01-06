import { categories } from '@/app/data/categories'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import CreatorGrid from './CreatorGrid'
import GridSkeleton from './GridSkeleton'

// Generate static params for all categories (optional but good for SEO/Performance)
export async function generateStaticParams() {
    return categories.map((category) => ({
        slug: category.slug,
    }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const category = categories.find((c) => c.slug === slug)
    const supabase = await createClient()

    // We can fetch user session here quickly (lightweight) OR inside the grid.
    // However, the Back button needs to know where to go.
    // Since getUser is fast (often cached or lightweight reading jwt), we can keep it for the header logic
    // But ideally we don't block the HEADER render on it if possible.
    // For now, let's keep user fetch here as it's usually < 10ms if cached, but let's separate the creator fetch.

    // Allow the page to stream:
    // 1. Resolve User (fast)
    // 2. Render Header (instant)
    // 3. Stream Grid (slow DB query)

    const { data: { user } } = await supabase.auth.getUser()

    // We need role for the back button
    let backLink = '/'
    let backText = 'Back to Home'

    if (user) {
        // Optimistic back link or quick fetch role?
        // Role fetch might add latency. Let's do a quick fetch, it's indexed usually.
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (data?.role === 'creator') {
            backLink = '/creator'
            backText = 'Back to Dashboard'
        } else {
            backLink = '/student'
            backText = 'Back to Dashboard'
        }
    }

    if (!category) {
        return <div className="p-10 text-center">Category not found</div>
    }

    return (
        <div className="min-h-screen bg-[#F3F0E9]">
            {/* Header - Renders Instantly */}
            <div className="bg-[#3E4C37] text-white pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <Link
                        href={backLink}
                        prefetch={true}
                        className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors touch-manipulation"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {backText}
                    </Link>
                    <div className="flex items-center mb-4">
                        <category.icon className="w-8 h-8 mr-3 text-[#C6A87C]" />
                        <h1 className="font-serif text-4xl md:text-5xl font-bold">{category.title}</h1>
                    </div>
                    <p className="text-xl text-white/80 max-w-2xl font-light">
                        {category.fullDesc}
                    </p>
                </div>
                {/* Decorative Background Icon */}
                <category.icon className="absolute -right-10 -bottom-20 w-96 h-96 text-white/5 rotate-12" />
            </div>

            {/* Creators Grid - Streams in */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <Suspense fallback={<GridSkeleton />}>
                    <CreatorGrid categorySlug={slug} />
                </Suspense>
            </div>
        </div>
    )
}
