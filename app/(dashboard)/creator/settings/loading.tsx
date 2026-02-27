export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-pulse">
            <div className="mb-12">
                <div className="h-10 w-56 bg-slate-100 rounded-xl mb-3" />
                <div className="h-4 w-72 bg-slate-50 rounded-lg" />
            </div>

            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                                <div className="h-5 w-32 bg-slate-100 rounded" />
                            </div>
                            <div className="h-6 w-6 bg-slate-50 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-12 w-full bg-slate-50 rounded-xl" />
                            <div className="h-12 w-full bg-slate-50 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
