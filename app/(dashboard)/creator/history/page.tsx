import { CreditCard, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function CreatorHistory() {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-[#3E4C37] mb-6">Transaction History</h1>

            <div className="bg-white rounded-3xl border border-[#E6E2D6] shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-[#E6E2D6] flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-[#333333]">All Transactions</h2>
                    <button className="flex items-center text-sm text-[#3E4C37] hover:underline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                    </button>
                </div>

                <div className="divide-y divide-[#E6E2D6]">
                    {/* Empty State */}
                    <div className="p-12 text-center flex flex-col items-center justify-center h-64">
                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No transactions</h3>
                        <p className="text-gray-500 mt-1">Income and withdrawals will be listed here.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
