import { CreditCard, Download, Briefcase } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CreatorHistory() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login?next=/creator/history')
    }

    // Fetch transactions with associated project info
    const { data: transactions } = await supabase
        .from('transactions')
        .select(`
            *,
            project:project_id (
                title
            )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen pt-24 md:pt-32">
            <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tighter uppercase mb-6 leading-none">
                Transaction <span className="text-[#0EA5E9]">History.</span>
            </h1>

            <div className="bg-white rounded-[2rem] border border-sky-50 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-sky-50 flex justify-between items-center bg-gray-50/30">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Financial Statements</h2>
                    <button className="flex items-center text-[10px] font-black text-[#0EA5E9] uppercase tracking-widest hover:underline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                    </button>
                </div>

                <div className="divide-y divide-sky-50">
                    {!transactions || transactions.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center justify-center h-80">
                            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-6 text-sky-200">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No transactions recorded</h3>
                            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Income and settlements will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-sky-50">
                                        <th className="px-8 py-4">Reference</th>
                                        <th className="px-8 py-4">Project</th>
                                        <th className="px-8 py-4">Amount</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sky-50">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-sky-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">TRX_{tx.id.slice(0, 8)}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0EA5E9]">
                                                        <Briefcase size={14} />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-600">{(tx.project as any)?.title || 'Platform Fee/Credit'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-base font-serif font-black text-slate-900 tracking-tighter">
                                                    AED {tx.creator_net_amount?.toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${tx.status === 'paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                        tx.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                            'bg-red-50 border-red-100 text-red-600'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(tx.created_at).toLocaleDateString()}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
