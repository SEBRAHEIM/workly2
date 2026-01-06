import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Shield, Users, Briefcase, AlertTriangle } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Strict Access Control
    if (!user || user.email !== 'workly.day@outlook.com') {
        return <div className="p-10 text-center font-bold text-red-500">Access Denied. Admin Only.</div>
    }

    // 2. Fetch All Data (RLS Policy required)
    const { data: projects } = await supabase
        .from('projects')
        .select('*, student:student_id(email), creator:creator_id(email, wallet_balance)')
        .order('created_at', { ascending: false })

    // 3. Calculate Stats
    const totalEscrow = projects?.filter(p => p.funds_status === 'escrow').reduce((acc, curr) => acc + (curr.current_price || 0), 0) || 0
    const totalRevenue = projects?.filter(p => p.status === 'completed').reduce((acc, curr) => acc + ((curr.current_price || 0) * 0.17), 0) || 0

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold flex items-center">
                        <Shield className="w-8 h-8 text-red-500 mr-3" />
                        God Mode <span className="text-gray-500 text-lg ml-3 font-normal">System Overview</span>
                    </h1>
                    <div className="text-sm text-gray-400">
                        Admin: {user.email}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Escrow Held</h3>
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">AED {totalEscrow.toFixed(2)}</p>
                    </div>

                    <div className="bg-[#333333] p-8 rounded-[2rem] border border-[#E6E2D6]/20">
                        <div className="flex items-center text-green-400 mb-2">
                            <h3 className="uppercase tracking-widest font-bold text-xs">Total Revenue (17%)</h3>
                        </div>
                        <p className="text-3xl font-bold text-green-400">AED {totalRevenue.toFixed(2)}</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Active Projects</h3>
                            <Briefcase className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {projects?.filter(p => p.status === 'in_progress').length || 0}
                        </p>
                    </div>
                </div>

                {/* Transaction Monitor */}
                <h2 className="text-xl font-bold mb-6">Live Transaction Monitor</h2>
                <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                                <th className="p-4">Project</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Funds</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {projects?.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{project.title}</div>
                                        <div className="text-xs text-gray-500">{project.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${project.status === 'completed' ? 'bg-green-900 text-green-400' :
                                            project.status === 'in_progress' ? 'bg-blue-900 text-blue-400' :
                                                'bg-gray-700 text-gray-300'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono">AED {project.current_price}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-2 ${project.funds_status === 'escrow' ? 'text-blue-400' :
                                            project.funds_status === 'released' ? 'text-green-400' : 'text-gray-500'
                                            }`}>
                                            {project.funds_status === 'escrow' && <Shield className="w-3 h-3" />}
                                            {project.funds_status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {/* Placeholder for Admin Actions */}
                                        <button className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1 rounded border border-red-500/20">
                                            Force Refund
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
