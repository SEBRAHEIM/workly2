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
        <div className="min-h-screen bg-white">
            {/* Header - Renders Instantly */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-6 relative overflow-hidden group">
                {/* Background Sky Soft Glows */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0EA5E9] rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 opacity-20 transition-opacity duration-1000 group-hover:opacity-30" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <Suspense fallback={<div className="h-6 w-32 bg-white/10 rounded mb-10 animate-pulse" />}>
                        <div className="mb-10">
                            <DynamicBackLink />
                        </div>
                    </Suspense>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    <category.icon className="w-7 h-7 text-sky-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">Official Category</span>
                            </div>

                            <h1 className="font-serif text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
                                {category.title.split(' ')[0]} <br />
                                <span className="text-[#0EA5E9]">{category.title.split(' ').slice(1).join(' ') || 'Services.'}</span>
                            </h1>

                            <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                                {category.fullDesc}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Background Icon */}
                <category.icon className="absolute -right-20 -bottom-20 w-[500px] h-[500px] text-white opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
            </div>

            {/* Creators Grid - Streams in */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-[1px] flex-1 bg-sky-50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Available Talent</span>
                    <div className="h-[1px] flex-1 bg-sky-50" />
                </div>
                <Suspense fallback={<GridSkeleton />}>
                    <CreatorGrid categorySlug={slug} />
                </Suspense>
            </div>
        </div>
    )
}
