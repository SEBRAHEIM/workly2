import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-slate-50 py-12 px-6 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start max-w-xl">
                        <span className="text-lg font-bold text-slate-900 mb-4">Workly</span>
                        <p className="text-slate-500 text-[10px] leading-relaxed mb-0 text-center md:text-left">
                            Workly is an independent substrate for creative collaboration. We maintain no official affiliation with academic institutions. Integrity and compliance with university regulations remain the responsibility of the individual operator.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-sky-500 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-sky-500 transition-colors">Terms</Link>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>© 2026 Workly</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
