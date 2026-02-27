export default function Loading() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-pulse">
            <div className="mb-12 text-center">
                <div className="h-10 w-64 bg-slate-100 rounded-xl mx-auto mb-3" />
                <div className="h-4 w-48 bg-slate-50 rounded-lg mx-auto" />
            </div>

            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-10">
                <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-[2rem]">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                    <div className="space-y-3">
                        <div className="h-5 w-40 bg-slate-100 rounded" />
                        <div className="h-4 w-24 bg-slate-50 rounded" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="h-6 w-32 bg-slate-100 rounded" />
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-28 bg-slate-50 rounded-2xl" />
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="h-6 w-32 bg-slate-100 rounded" />
                    <div className="h-32 w-full bg-slate-50 rounded-2xl" />
                </div>

                <div className="h-16 w-full bg-slate-900/5 rounded-2xl" />
            </div>
        </div>
    )
}
