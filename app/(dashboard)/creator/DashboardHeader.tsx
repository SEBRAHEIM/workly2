'use client'
import { Briefcase } from 'lucide-react'

export default function DashboardHeader() {
    return (
        <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-100">
                    <Briefcase className="w-5 h-5 text-[#0EA5E9]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">Creator Control Plane</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-sans font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-4">
                Dashboard <br /> <span className="text-[#0EA5E9]">Overview.</span>
            </h1>
            <p className="text-slate-500 font-medium">Monitoring your professional trajectory and active project flow.</p>
        </div>
    )
}
