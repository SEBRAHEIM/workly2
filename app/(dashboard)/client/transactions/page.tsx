import { Clock, Tag } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function Transactions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('client_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-sans font-black font-bold text-[#0EA5E9] mb-6">Pending Transactions</h1>

            <div className="bg-white rounded-3xl border border-[#F0F9FF] shadow-sm overflow-hidden min-h-[400px]">
                {transactions && transactions.length > 0 ? (
                    <div className="divide-y divide-[#F0F9FF]">
                        {transactions.map((t: any) => (
                            <div key={t.id} className="p-8 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1E293B]">{t.metadata?.project_title || 'Payment'}</p>
                                        <p className="text-sm text-gray-500">Processing • {new Date(t.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-amber-600">AED {t.amount.toFixed(2)}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Pending</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center h-full pt-32 pb-32">
                        <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mb-4 text-[#0EA5E9]">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1E293B] mb-2">No pending transactions</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Any payments currently being processed will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
