'use client'

import { createProject } from '../../actions'
import { AlertTriangle, MessageSquare, Briefcase, Check, Clock, Zap } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import { useState, useActionState, useEffect } from 'react'
import MarkdownRenderer from '@/app/components/MarkdownRenderer'
import MultiFileUpload from '@/app/components/MultiFileUpload'
import FormattedTextarea from '@/app/components/FormattedTextarea'
import { categories } from '@/app/data/categories'
import Link from 'next/link'

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#3E4C37] text-white font-bold py-4 rounded-xl flex items-center justify-center hover:bg-[#2e3b29] active:scale-95 transition-all transform shadow-xl disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
            {isPending ? (
                <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    Sending Request...
                </span>
            ) : (
                <>
                    Send Request
                </>
            )}
        </button>
    )
}

const initialState = {
    message: '',
}

interface HireCreatorFormProps {
    creatorId: string
    specializations: string[]
    services: any[]
    languages: string[]
}

export default function HireCreatorForm({ creatorId, specializations, services, languages }: HireCreatorFormProps) {
    const [state, formAction, isPending] = useActionState(createProject, initialState)
    const [files, setFiles] = useState<string[]>([])
    const [description, setDescription] = useState('')

    // Category Selection
    const [selectedCategory, setSelectedCategory] = useState<string>(specializations[0] || '')
    const [selectedService, setSelectedService] = useState<any>(null)
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

    useEffect(() => {
        const service = services.find(s => s.category_slug === selectedCategory)
        setSelectedService(service || null)
        setSelectedPackage(null) // Reset package on category change
    }, [selectedCategory, services])

    const isSuccess = (state as any)?.success

    if (isSuccess) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-600" />
                </div>

                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#333] mb-2">Request Sent Successfully!</h2>
                    <p className="text-gray-500">Your proposal for <strong>{(state as any).projectTitle}</strong> has been shared with the creator.</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            The creator has been notified. They will review your proposal and get back to you shortly. You can track this project in your requests dashboard.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/student/projects/${(state as any).projectId}`}
                                className="w-full bg-[#3E4C37] text-white font-bold py-4 rounded-xl hover:bg-[#2e3b29] transition-all shadow-md"
                            >
                                View Project Details
                            </Link>
                            <Link
                                href="/student/requests"
                                className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Back to Requests
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="creatorId" value={creatorId} />
            <input type="hidden" name="categorySlug" value={selectedCategory} />
            <input type="hidden" name="pricingType" value={selectedService?.pricing_mode || 'negotiable'} />
            <input type="hidden" name="selectedPackageTier" value={selectedPackage || ''} />

            {state?.message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{state.message}</span>
                </div>
            )}

            {/* Category Selection */}
            <div>
                <label className="block text-sm font-bold text-[#333333] uppercase tracking-wider mb-2">I need help with...</label>
                <div className="flex flex-wrap gap-2">
                    {specializations.map(slug => (
                        <button
                            key={slug}
                            type="button"
                            onClick={() => setSelectedCategory(slug)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedCategory === slug ? 'bg-[#3E4C37] text-white border-[#3E4C37]' : 'bg-[#F3F0E9] text-gray-400 border-transparent hover:border-gray-300'}`}
                        >
                            {categories.find(c => c.slug === slug)?.title || slug}
                        </button>
                    ))}
                </div>
                {languages && languages.length > 0 && (
                    <p className="mt-2 text-[10px] text-gray-400 font-medium tracking-wide">
                        Available in: <span className="text-[#3E4C37] font-bold">{languages.join(', ')}</span>
                    </p>
                )}
            </div>

            {/* Pricing Info Display */}
            <div className="bg-[#F3F0E9] rounded-2xl p-5 border border-[#E6E2D6]/50">
                <div className="flex items-center gap-2 mb-3">
                    <AEDIcon className="w-5 h-5 text-[#3E4C37]" />
                    <h4 className="text-sm font-bold text-[#333] uppercase tracking-widest">Pricing Basis</h4>
                </div>

                {!selectedService ? (
                    <p className="text-xs text-gray-500 italic">Please select a category to see pricing.</p>
                ) : (
                    <div className="space-y-4">
                        {selectedService.pricing_mode === 'fixed' && (
                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-green-100">
                                <span className="text-sm font-bold text-gray-600">Fixed Project Rate</span>
                                <span className="text-lg font-serif font-bold text-[#3E4C37]">AED {selectedService.base_price}</span>
                            </div>
                        )}

                        {selectedService.pricing_mode === 'negotiable' && (
                            <div className="bg-white p-3 rounded-xl border border-orange-100 italic text-sm text-gray-600">
                                This creator is open to negotiation. Starting at <span className="font-bold text-[#333]">AED {selectedService.base_price}</span>.
                            </div>
                        )}

                        {selectedService.pricing_mode === 'packages' && (
                            <div className="space-y-4">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest px-1">Select a package tier to request:</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(selectedService.service_packages || {}).map(([tier, pkg]: [string, any]) => (
                                        <div key={tier} className="contents">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPackage(tier)}
                                                className={`p-4 rounded-2xl border-2 text-left transition-all flex justify-between items-start ${selectedPackage === tier ? 'border-[#3E4C37] bg-white shadow-md' : 'border-white/50 bg-white/40 hover:border-gray-200'}`}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${tier === 'basic' ? 'bg-blue-50 text-blue-600' : tier === 'standard' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                                                            {tier}
                                                        </span>
                                                        <p className="text-sm font-bold text-[#333]">{pkg.title}</p>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase mt-2">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {pkg.delivery_days} Days Delivery
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Zap className="w-3 h-3" />
                                                            {pkg.revisions} Revisions
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-base font-serif font-bold text-[#3E4C37]">AED {pkg.price}</p>
                                                    {selectedPackage === tier && <Check className="w-4 h-4 text-white bg-[#3E4C37] rounded-full p-0.5 ml-auto mt-2" />}
                                                </div>
                                            </button>

                                            {/* Expandable description if selected */}
                                            {selectedPackage === tier && pkg.description && (
                                                <div className="bg-white/60 rounded-2xl p-4 border border-[#E6E2D6] text-xs text-gray-600 animate-in slide-in-from-top-2 duration-300 mx-2 -mt-2 mb-2">
                                                    <h5 className="font-bold text-[#3E4C37] uppercase tracking-wider mb-2 text-[10px]">What's included:</h5>
                                                    <MarkdownRenderer
                                                        content={pkg.description}
                                                        className="opacity-80 leading-relaxed"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-[#333333] uppercase tracking-wider mb-2">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="e.g. Physics Assignment Help"
                        className="w-full bg-[#F3F0E9] border-none rounded-xl p-4 text-[#333333] placeholder-gray-400 focus:ring-2 focus:ring-[#3E4C37] outline-none transition-all text-base"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-[#333333] uppercase tracking-wider mb-2">Description & Instructions</label>
                    <FormattedTextarea
                        value={description}
                        onChange={setDescription}
                        placeholder="Describe exactly what you need. (Note: Phone numbers and emails are not allowed)"
                        rows={8}
                    />
                    <input type="hidden" name="description" value={description} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-[#333333] uppercase tracking-wider mb-2">Attachments</label>
                <MultiFileUpload
                    bucketName="project-files"
                    folderPath={`${creatorId}`}
                    onUploadComplete={(urls) => setFiles(urls)}
                    maxSizeMB={50}
                />
                {files.map((url, index) => (
                    <input key={index} type="hidden" name="fileUrls" value={url} />
                ))}
            </div>

            <div className="pt-6">
                <SubmitButton isPending={isPending} />
                <p className="text-center text-xs text-gray-400 mt-4">
                    {selectedService?.pricing_mode === 'negotiable'
                        ? "The creator will review this and send you a customized price offer."
                        : "You are requesting a deal based on the creator's defined pricing."}
                </p>
            </div>
        </form>
    )
}
