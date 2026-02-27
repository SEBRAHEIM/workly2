export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-pulse">
            <div className="mb-12">
                <div className="h-10 w-48 bg-slate-100 rounded-xl mb-3" />
                <div className="h-4 w-64 bg-slate-50 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl mb-6" />
                        <div className="h-6 w-32 bg-slate-100 rounded mb-3" />
                        <div className="h-4 w-full bg-slate-50 rounded mb-2" />
                        <div className="h-4 w-2/3 bg-slate-50 rounded" />
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-6">
                <div className="h-6 w-40 bg-slate-100 rounded mb-8" />
                <div className="space-y-4">
                    <div className="h-4 w-24 bg-slate-50 rounded" />
                    <div className="h-12 w-full bg-slate-50 rounded-2xl" />
                </div>
                <div className="space-y-4">
                    <div className="h-4 w-24 bg-slate-50 rounded" />
                    <div className="h-32 w-full bg-slate-50 rounded-2xl" />
                </div>
                <div className="h-14 w-full bg-slate-900/5 rounded-2xl" />
            </div>
        </div>
    )
}
