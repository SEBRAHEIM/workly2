export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-12">
                <div className="h-10 w-48 bg-slate-100 rounded-xl mb-3" />
                <div className="h-4 w-64 bg-slate-50 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-6 w-24 bg-slate-50 rounded-full" />
                            <div className="h-4 w-16 bg-slate-50 rounded" />
                        </div>
                        <div className="h-6 w-3/4 bg-slate-100 rounded-lg mb-4" />
                        <div className="space-y-2 mb-8">
                            <div className="h-3 w-full bg-slate-50 rounded" />
                            <div className="h-3 w-5/6 bg-slate-50 rounded" />
                        </div>
                        <div className="pt-6 border-t border-slate-50">
                            <div className="h-12 w-full bg-slate-50 rounded-2xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
