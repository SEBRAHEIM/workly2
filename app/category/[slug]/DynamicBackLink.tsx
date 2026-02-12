'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function DynamicBackLink() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all touch-manipulation group"
        >
            <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
        </button>
    )
}
