import { Briefcase, Layout, Star, Clock, Wallet } from 'lucide-react'

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div>
                    <div className="h-8 w-64 bg-slate-100 rounded-lg mb-2" />
                    <div className="h-4 w-48 bg-slate-50 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    <div className="h-12 w-32 bg-slate-100 rounded-xl" />
                    <div className="h-12 w-32 bg-slate-100 rounded-xl" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl mb-4" />
                        <div className="h-4 w-16 bg-slate-50 rounded mb-2" />
                        <div className="h-6 w-24 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>

            {/* Content Preview Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                        <div className="h-5 w-40 bg-slate-100 rounded" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                                    <div className="h-3 w-1/2 bg-slate-50 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                        <div className="h-5 w-40 bg-slate-100 rounded" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl">
                                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                                    <div className="h-3 w-1/4 bg-slate-50 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
