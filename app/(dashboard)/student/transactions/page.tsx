import { Clock, Search } from 'lucide-react'

export default function Transactions() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-[#3E4C37] mb-6">Pending Transactions</h1>

            <div className="bg-white rounded-3xl border border-[#E6E2D6] shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 text-center flex flex-col items-center justify-center h-full mt-20">
                    <div className="w-16 h-16 bg-[#F3F0E9] rounded-full flex items-center justify-center mb-4 text-[#3E4C37]">
                        <Clock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] mb-2">No pending transactions</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Any payments currently being processed will appear here.
                    </p>
                </div>
            </div>
        </div>
    )
}
