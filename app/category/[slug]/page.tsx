import { categories } from '@/app/data/categories'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import CreatorGrid from './CreatorGrid'
import GridSkeleton from './GridSkeleton'
import DynamicBackLink from './DynamicBackLink'

// Generate static params for all categories (optional but good for SEO/Performance)
export async function generateStaticParams() {
    return categories.map((category) => ({
        slug: category.slug,
    }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const category = categories.find((c) => c.slug === slug)

    if (!category) {
        return <div className="p-10 text-center">Category not found</div>
    }

    return (
        <div className="min-h-screen bg-[#F3F0E9]">
            {/* Header - Renders Instantly */}
            <div className="bg-[#3E4C37] text-white pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <Suspense fallback={<div className="h-6 w-32 bg-white/10 rounded mb-6 animate-pulse" />}>
                        <DynamicBackLink />
                    </Suspense>
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
