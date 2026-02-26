'use client'

import { useFormStatus } from 'react-dom'
import { useActionState, useRef, useEffect, useState } from 'react'
import { uploadPortfolioItem } from './actions'
import { Plus, AlertCircle } from 'lucide-react'
import { categories } from '@/app/data/categories'

type State = {
    error?: string
    success?: boolean
}

const initialState: State = {
    error: '',
    success: false,
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full md:w-auto bg-[#1E293B] text-white font-bold px-8 py-3 rounded-xl hover:bg-black active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {pending ? (
                <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    Uploading...
                </span>
            ) : (
                'Upload Item'
            )}
        </button>
    )
}

type Props = {
    forcedCategorySlug?: string
}

export default function PortfolioUploadForm({ forcedCategorySlug }: Props) {
    const [state, formAction] = useActionState(uploadPortfolioItem, initialState)
    const [clientError, setClientError] = useState('')
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success && formRef.current) {
            formRef.current.reset()
        }
    }, [state?.success])

    return (
        <div className="bg-[#F0F9FF] rounded-xl p-6 mb-8 border border-[#F0F9FF]">
            {!forcedCategorySlug && (
                <h3 className="font-bold text-[#1E293B] mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Item
                </h3>
            )}

            <form
                ref={formRef}
                action={(formData) => {
                    setClientError('')
                    const file = formData.get('image') as File
                    if (file && file.size > 10 * 1024 * 1024) {
                        setClientError('File is too large (max 10MB)')
                        return
                    }
                    formAction(formData)
                }}
                className="grid grid-cols-1 gap-4"
            >
                {/* User requested to remove Title requirement - we auto-fill it */}
                <input type="hidden" name="title" value="Work Sample" />

                {forcedCategorySlug ? (
                    <input type="hidden" name="categorySlug" value={forcedCategorySlug} />
                ) : (
                    <select
                        name="categorySlug"
                        required
                        className="w-full bg-white border-none rounded-xl p-4 text-base focus:ring-1 focus:ring-[#0EA5E9]"
                        onChange={() => setClientError('')}
                    >
                        <option value="">Select Category...</option>
                        {categories.map(c => (
                            <option key={c.slug} value={c.slug}>{c.title}</option>
                        ))}
                    </select>
                )}
                <textarea
                    name="description"
                    placeholder="Description"
                    rows={2}
                    dir="auto"
                    className="w-full bg-white border-none rounded-xl p-4 text-base focus:ring-1 focus:ring-[#0EA5E9] resize-none"
                    onChange={() => setClientError('')}
                />

                {(state?.error || clientError) && (
                    <div className="text-red-500 text-sm flex items-center bg-red-50 p-3 rounded-lg border border-red-100">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {clientError || state?.error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                    <input
                        type="file"
                        name="image"
                        required
                        onChange={() => setClientError('')}
                        className="w-full text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E293B]/5 file:text-[#1E293B] hover:file:bg-[#1E293B]/10"
                    />
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
