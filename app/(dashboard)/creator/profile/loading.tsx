export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-pulse">
            <div className="mb-8">
                <div className="h-10 w-48 bg-slate-100 rounded-xl mb-3" />
                <div className="h-4 w-64 bg-slate-50 rounded-lg" />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-full" />
                    <div className="space-y-3">
                        <div className="h-6 w-40 bg-slate-100 rounded-lg" />
                        <div className="h-4 w-24 bg-slate-50 rounded-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="h-4 w-24 bg-slate-50 rounded" />
                        <div className="h-12 w-full bg-slate-50 rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-4 w-24 bg-slate-50 rounded" />
                        <div className="h-12 w-full bg-slate-50 rounded-2xl" />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                        <div className="h-4 w-24 bg-slate-50 rounded" />
                        <div className="h-32 w-full bg-slate-50 rounded-2xl" />
                    </div>
                </div>

                <div className="pt-4">
                    <div className="h-14 w-full bg-slate-900/5 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}
