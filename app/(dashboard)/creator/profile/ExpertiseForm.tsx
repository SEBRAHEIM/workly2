
'use client'

import { useState } from 'react'
import { updateCreatorSpecializations } from './actions'
import { Save } from 'lucide-react'
import { categories } from '@/app/data/categories'

interface ExpertiseFormProps {
    savedSpecializations: string[]
    onSuccess?: () => void
}

export default function ExpertiseForm({ savedSpecializations, onSuccess }: ExpertiseFormProps) {
    const [isSaving, setIsSaving] = useState(false)

    return (
        <form
            action={async (formData) => {
                setIsSaving(true)
                const result = await updateCreatorSpecializations(formData)
                setIsSaving(false)
                if (result?.error) {
                    alert(result.error)
                } else {
                    if (onSuccess) onSuccess()
                }
            }}
            className=""
        >
            <p className="text-gray-500 mb-6 text-sm">
                Select the categories you want to receive requests for.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {categories.map((cat) => (
                    <label key={cat.slug} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.99] touch-manipulation ${savedSpecializations.includes(cat.slug)
                        ? 'border-[#3E4C37] bg-[#F3F0E9]'
                        : 'border-[#E6E2D6] hover:border-gray-300'
                        }`}>
                        <input
                            type="checkbox"
                            name="specializations"
                            value={cat.slug}
                            defaultChecked={savedSpecializations.includes(cat.slug)}
                            className="w-5 h-5 text-[#3E4C37] border-gray-300 rounded focus:ring-[#3E4C37] mr-3"
                        />
                        <div className="flex-1">
                            <span className="font-bold text-base block text-[#333333]">{cat.title}</span>
                        </div>
                    </label>
                ))}
            </div>

            <button
                disabled={isSaving}
                className="w-full bg-[#3E4C37] text-white font-bold py-4 rounded-xl hover:bg-[#2e3b29] active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50"
            >
                {isSaving ? 'Saving...' : (
                    <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Categories
                    </>
                )}
            </button>
        </form>
    )
}
