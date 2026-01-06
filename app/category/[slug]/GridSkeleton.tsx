
export default function GridSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-[#E6E2D6] shadow-sm animate-pulse">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gray-200 mr-4"></div>
                            <div>
                                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                        {/* Bio */}
                        <div className="space-y-2 mb-6">
                            <div className="h-3 w-full bg-gray-100 rounded"></div>
                            <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                        </div>
                        {/* Stats */}
                        <div className="flex items-center justify-between border-t border-[#E6E2D6] pt-4 mb-4">
                            <div className="h-3 w-20 bg-gray-100 rounded"></div>
                            <div className="h-3 w-20 bg-gray-100 rounded"></div>
                        </div>
                        {/* Action */}
                        <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
