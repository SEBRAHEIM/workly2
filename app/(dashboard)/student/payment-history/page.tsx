import { CreditCard, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function PaymentHistory() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-[#3E4C37] mb-6">Payment History</h1>

            <div className="bg-white rounded-3xl border border-[#E6E2D6] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#E6E2D6] flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-[#333333]">All Transactions</h2>
                    <button className="flex items-center text-sm text-[#3E4C37] hover:underline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                    </button>
                </div>

                <div className="divide-y divide-[#E6E2D6]">
                    {/* Empty State */}
                    <div className="p-12 text-center">
                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No payment history</h3>
                        <p className="text-gray-500 mt-1">You haven't made any payments yet.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
