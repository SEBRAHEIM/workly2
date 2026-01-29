export default function Footer() {
    return (
        <footer className="bg-white py-24 px-6 overflow-hidden border-t border-sky-100">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center max-w-2xl">
                    <div className="w-12 h-[1px] bg-[#0EA5E9]/20 mb-12" />

                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-6">
                        Institutional Protocol
                    </p>

                    <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed tracking-tight text-center px-4 mb-12 uppercase italic">
                        Workly operates as an independent creative substrate. We maintain no official affiliation with academic institutions. Integrity and compliance with local university regulations remain the primary responsibility of the individual operator.
                    </p>

                    <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <span>workly.day</span>
                        <div className="w-1 h-1 bg-[#0EA5E9] rounded-full" />
                        <span>© 2024 Global Creative Network</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
