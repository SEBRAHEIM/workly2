export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm mb-8">
                <div className="p-8 md:p-12 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl mb-6" />
                    <div className="h-6 w-32 bg-slate-100 rounded mb-2" />
                    <div className="h-10 w-48 bg-slate-100 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 border-t border-slate-50 px-8 py-6">
                    <div className="text-center border-r border-slate-50">
                        <div className="h-3 w-16 bg-slate-50 rounded mx-auto mb-2" />
                        <div className="h-6 w-12 bg-slate-100 rounded mx-auto" />
                    </div>
                    <div className="text-center">
                        <div className="h-3 w-16 bg-slate-50 rounded mx-auto mb-2" />
                        <div className="h-6 w-12 bg-slate-100 rounded mx-auto" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-6 w-40 bg-slate-100 rounded" />
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-slate-100 rounded" />
                                    <div className="h-3 w-20 bg-slate-50 rounded" />
                                </div>
                            </div>
                            <div className="h-5 w-20 bg-slate-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
