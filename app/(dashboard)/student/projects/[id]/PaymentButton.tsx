'use client'

import { Shield } from 'lucide-react'
import { createCheckoutSession } from '../actions'

export default function PaymentButton({
    projectId,
    amount
}: {
    projectId: string
    amount: number
}) {
    return (
        <form action={async (formData) => {
            await createCheckoutSession(formData)
        }}>
            <input type="hidden" name="projectId" value={projectId} />
            <button
                type="submit"
                className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-400 active:scale-95 transition-all shadow-lg shadow-green-900/20 flex items-center justify-center transform hover:scale-[1.02] touch-manipulation"
            >
                <div className="mr-2 p-1 bg-white/20 rounded-full">
                    <Shield className="w-3 h-3" />
                </div>
                Pay AED {amount} to Escrow
            </button>
        </form>
    )
}
