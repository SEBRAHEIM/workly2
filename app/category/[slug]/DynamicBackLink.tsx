'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function DynamicBackLink() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/20 active:scale-95 transition-all touch-manipulation group shadow-lg shadow-black/20"
        >
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back
        </button>
    )
}
