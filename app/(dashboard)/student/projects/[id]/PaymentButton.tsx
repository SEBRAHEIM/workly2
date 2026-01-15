import { Shield, Loader2, AlertTriangle } from 'lucide-react'
import { createCheckoutSession } from '../actions'
import { useActionState } from 'react'

const initialState = { error: '' }

export default function PaymentButton({
    projectId,
    amount
}: {
    projectId: string
    amount: number
}) {
    const [state, formAction, isPending] = useActionState(createCheckoutSession, initialState)

    return (
        <div className="space-y-3">
            <form action={formAction}>
                <input type="hidden" name="projectId" value={projectId} />
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-400 active:scale-95 transition-all shadow-lg shadow-green-900/20 flex items-center justify-center transform hover:scale-[1.02] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <div className="mr-2 p-1 bg-white/20 rounded-full">
                                <Shield className="w-3 h-3" />
                            </div>
                            Pay AED {amount} to Escrow
                        </>
                    )}
                </button>
            </form>

            {state?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-medium leading-tight">{state.error}</span>
                </div>
            )}
        </div>
    )
}
