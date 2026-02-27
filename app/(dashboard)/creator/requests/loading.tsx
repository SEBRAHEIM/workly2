import { Briefcase, Clock, FileText, Download, ExternalLink } from 'lucide-react'

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            {/* Header Area */}
            <div className="mb-12">
                <div className="h-8 w-64 bg-slate-100 rounded-lg mb-4" />
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 w-28 bg-slate-50 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Request Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-4 w-24 bg-slate-100 rounded" />
                            <div className="h-6 w-20 bg-slate-50 rounded-full" />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                            <div className="space-y-2 flex-1">
                                <div className="h-5 w-3/4 bg-slate-100 rounded" />
                                <div className="h-4 w-1/2 bg-slate-50 rounded" />
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="h-3 w-full bg-slate-50 rounded" />
                            <div className="h-3 w-5/6 bg-slate-50 rounded" />
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-50 space-y-3">
                            <div className="h-12 w-full bg-slate-100 rounded-2xl" />
                            <div className="h-12 w-full bg-slate-50 rounded-2xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
