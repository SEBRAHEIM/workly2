
import { ArrowLeft } from 'lucide-react'

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton - Matches Theme */}
            <div className="bg-slate-900 pt-10 md:pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 animate-pulse">
                    <div className="mb-6">
                        <div className="h-8 w-24 bg-white/10 rounded-full"></div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl"></div>
                        <div className="h-3 w-32 bg-white/10 rounded"></div>
                    </div>

                    <div className="max-w-3xl">
                        <div className="h-12 md:h-20 w-3/4 bg-white/10 rounded-xl mb-4"></div>
                        <div className="h-12 md:h-20 w-1/2 bg-white/10 rounded-xl mb-6"></div>
                        <div className="h-4 w-full bg-white/5 rounded max-w-2xl"></div>
                        <div className="h-4 w-2/3 bg-white/5 rounded max-w-2xl mt-2"></div>
                    </div>
                </div>
            </div>

            {/* Creators Grid Skeleton */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
                <div className="flex items-center gap-4 mb-12 animate-pulse">
                    <div className="h-[1px] flex-1 bg-sky-50" />
                    <div className="h-3 w-32 bg-slate-100 rounded"></div>
                    <div className="h-[1px] flex-1 bg-sky-50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-[#F0F9FF] shadow-sm animate-pulse">
                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-24 bg-slate-100 rounded mb-2"></div>
                                    <div className="h-3 w-32 bg-slate-50 rounded"></div>
                                </div>
                            </div>
                            <div className="h-10 w-full bg-slate-100 rounded-lg mt-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
