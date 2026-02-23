'use client'

import { useState, useActionState } from 'react'
import { AlertTriangle, Loader2, Check } from 'lucide-react'
import { reportProject } from '../actions'

const initialState = { error: '', success: false }

export default function ReportIssueForm({ projectId }: { projectId: string }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const reason = formData.get('reason') as string
        if (!reason || reason.length < 10) return { error: 'Please provide at least 10 characters describing the issue.', success: false }
        const result = await reportProject(projectId, reason)
        return result?.error ? { error: result.error, success: false } : { error: '', success: true }
    }, initialState)

    if (state.success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-green-700">Issue Reported</p>
                <p className="text-[10px] text-green-600 mt-1">Admin will review this shortly.</p>
            </div>
        )
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="text-[10px] font-bold text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
            >
                <AlertTriangle className="w-3 h-3" />
                Report an Issue with Creator
            </button>
        )
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 w-full">
            <h4 className="text-[10px] font-bold text-red-700 uppercase mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                Report a Problem
            </h4>
            <form action={formAction} className="space-y-3">
                <textarea
                    name="reason"
                    placeholder="Describe the issue clearly (e.g. non-delivery, scam, poor quality)..."
                    className="w-full bg-white border border-red-100 rounded-lg p-3 text-[11px] text-gray-700 focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none min-h-[80px]"
                    required
                />
                {state.error && (
                    <p className="text-[10px] text-red-500 font-medium">{state.error}</p>
                )}
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg text-[10px] hover:bg-red-600 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Submit Report'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="px-3 py-2 text-[10px] font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
