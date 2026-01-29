import { CreditCard, Download, Clock } from 'lucide-react'
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
            <h1 className="text-4xl font-serif font-bold text-[#0EA5E9] mb-6">Payment History</h1>

            <div className="bg-white rounded-3xl border border-[#F0F9FF] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#F0F9FF] flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-[#1E293B]">All Transactions</h2>
                    <button className="flex items-center text-sm text-[#0EA5E9] hover:underline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                    </button>
                </div>

                <div className="divide-y divide-[#F0F9FF]">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((t: any) => (
                            <div key={t.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-5 mb-4 md:mb-0">
                                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100 group-hover:bg-green-100 transition-colors">
                                        <CreditCard className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-[#1E293B] capitalize mb-1" dir="auto">
                                            {t.metadata?.project_title || 'Project Payment'}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-gray-400">
                                            <span className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(t.created_at).toLocaleDateString()} at {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="font-mono text-[10px] uppercase">Ref: {t.stripe_session_id?.slice(-12).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0">
                                    <p className="font-black text-2xl text-[#0EA5E9] mb-1">AED {t.amount.toFixed(2)}</p>
                                    <div className={`flex items-center md:justify-end gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${t.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${t.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                        {t.status === 'completed' ? 'SECURED VIA STRIPE' : 'PROCESSING PAYMENT...'}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <CreditCard className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#1E293B] mb-2">No payment history yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Once you pay for your first project, it will show up here with a detailed receipt.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
