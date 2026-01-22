import { CreditCard, Download } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function PaymentHistory() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })

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
                    {transactions && transactions.length > 0 ? (
                        transactions.map((t: any) => (
                            <div key={t.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#333333] capitalize">{t.metadata?.project_title || 'Project Payment'}</p>
                                        <p className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()} • {t.stripe_session_id?.substring(0, 12)}...</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-[#3E4C37]">AED {t.amount.toFixed(2)}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">{t.status}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No payment history</h3>
                            <p className="text-gray-500 mt-1">You haven't made any payments yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
