export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-pulse">
            <div className="mb-12 text-center">
                <div className="h-10 w-72 bg-slate-100 rounded-xl mx-auto mb-3" />
                <div className="h-4 w-64 bg-slate-50 rounded-lg mx-auto" />
            </div>

            <div className="p-12 border-4 border-dashed border-slate-100 rounded-[3rem] mb-8 text-center bg-slate-50/20">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto mb-6" />
                <div className="h-6 w-48 bg-slate-100 mx-auto mb-4 rounded" />
                <div className="h-4 w-32 bg-slate-50 mx-auto rounded" />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="h-6 w-32 bg-slate-100 rounded mb-6" />
                <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-20 w-full bg-slate-50 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    )
}
