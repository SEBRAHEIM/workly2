'use client'

import { createProject } from '../../actions'
import { AlertTriangle, MessageSquare, Briefcase, Check, Clock, Zap, ArrowRight, PowerOff } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import { useState, useActionState, useEffect } from 'react'
import MarkdownRenderer from '@/app/components/MarkdownRenderer'
import MultiFileUpload from '@/app/components/MultiFileUpload'
import FormattedTextarea from '@/app/components/FormattedTextarea'
import { categories } from '@/app/data/categories'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

function SubmitButton({ isPending, price }: { isPending: boolean, price?: number }) {
    return (
        <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#0EA5E9] text-white font-bold py-4 rounded-xl flex items-center justify-center hover:shadow-sky-200 active:scale-95 transition-all transform shadow-xl shadow-sky-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation group"
        >
            {isPending ? (
                <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    Sending Request...
                </span>
            ) : (
                <div className="flex items-center gap-2">
                    Confirm & Pay
                    {price !== undefined && price > 0 && (
                        <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-black">AED {price}</span>
                    )}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            )}
        </button>
    )
}

const initialState = {
    message: '',
}

interface HireCreatorFormProps {
    creatorId: string
    isBusy: boolean
    specializations: string[]
    services: any[]
    languages: string[]
}

export default function HireCreatorForm({ creatorId, isBusy, specializations, services, languages }: HireCreatorFormProps) {
    const [state, formAction, isPending] = useActionState(createProject, initialState)
    const [dueDate, setDueDate] = useState<string>('')
    const [files, setFiles] = useState<string[]>([])
    const [description, setDescription] = useState('')

    const searchParams = useSearchParams()
    const urlCategory = searchParams.get('category')
    const urlTier = searchParams.get('tier')

    // Category Selection
    const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || specializations[0] || '')
    const [selectedService, setSelectedService] = useState<any>(null)
    const [selectedPackage, setSelectedPackage] = useState<string | null>(urlTier || null)

    useEffect(() => {
        const service = services.find(s => s.category_slug === selectedCategory)
        setSelectedService(service || null)

        // Only reset package if the category actually changed and it's not the initial URL load
        if (selectedCategory !== urlCategory) {
            setSelectedPackage(null)
        }
    }, [selectedCategory, services, urlCategory])

    // Calculate days available between today and selected deadline
    const getDaysAvailable = () => {
        if (!dueDate) return Infinity
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selected = new Date(dueDate)
        selected.setHours(0, 0, 0, 0)
        const diffTime = selected.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const daysAvailable = getDaysAvailable()

    return (
        <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            action={formAction}
            className="space-y-4"
        >
            <input type="hidden" name="creatorId" value={creatorId} />
            <input type="hidden" name="categorySlug" value={selectedCategory} />
            <input type="hidden" name="pricingType" value={selectedService?.pricing_mode || 'fixed'} />
            <input type="hidden" name="selectedPackageTier" value={selectedPackage || ''} />

            {state?.message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl flex items-start">
                    <AlertTriangle className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-[10px] font-bold leading-relaxed">{state.message}</span>
                </div>
            )}

            {/* Category Selection */}
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">I need help with...</label>
                <div className="flex flex-wrap gap-1.5">
                    {specializations.map(slug => (
                        <button
                            key={slug}
                            type="button"
                            onClick={() => setSelectedCategory(slug)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all duration-200 ${selectedCategory === slug ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-transparent hover:border-slate-200'}`}
                        >
                            {categories.find(c => c.slug === slug)?.title || slug}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pricing Info Display */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-2 text-[#0EA5E9]">
                    <AEDIcon className="w-3.5 h-3.5" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Pricing</h4>
                </div>

                {!selectedService ? (
                    <p className="text-[10px] text-slate-400 font-medium italic">Select a category to see pricing</p>
                ) : (
                    <div className="space-y-2">
                        {selectedService.pricing_mode === 'fixed' && (
                            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-sky-50 shadow-sm shadow-sky-100/20">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Fixed Rate</span>
                                <span className="text-lg font-sans font-bold text-[#0EA5E9]">AED {selectedService.base_price}</span>
                            </div>
                        )}

                        {selectedService.pricing_mode === 'packages' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {(['basic', 'standard', 'premium'] as const).map((tier) => {
                                    const pkg = selectedService.service_packages[tier]
                                    if (!pkg) return null

                                    const packageTurnaround = pkg.turnaround || 2
                                    const isTooSlow = daysAvailable < packageTurnaround
                                    const isDisabled = isBusy || isTooSlow

                                    return (
                                        <button
                                            key={tier}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => setSelectedPackage(tier)}
                                            className={`relative p-5 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 flex flex-col h-full active:scale-[0.97] select-none touch-manipulation ${selectedPackage === tier
                                                ? 'border-[#0EA5E9] bg-white shadow-xl shadow-sky-100 ring-4 ring-sky-500/5'
                                                : isDisabled
                                                    ? 'border-slate-100 bg-slate-50 opacity-40 grayscale cursor-not-allowed'
                                                    : 'border-slate-100 bg-white hover:border-[#0EA5E9]/30'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${tier === 'basic' ? 'bg-blue-50 text-blue-600' :
                                                    tier === 'standard' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-purple-50 text-purple-600'
                                                    }`}>
                                                    {tier}
                                                </span>
                                                {selectedPackage === tier && (
                                                    <div className="w-5 h-5 bg-[#0EA5E9] rounded-full flex items-center justify-center text-white">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                                {isTooSlow && (
                                                    <div className="p-1 bg-amber-500 rounded-lg text-white" title="Too slow for your deadline">
                                                        <AlertTriangle className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{pkg.title}</p>
                                            <p className="text-lg font-sans font-black text-[#0EA5E9] mb-4">AED {pkg.price}</p>

                                            <div className="mt-auto space-y-2 border-t border-slate-50 pt-4">
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Zap className="w-3 h-3 text-sky-400" />
                                                    {pkg.revisions} Revisions
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>Revision Time (Days)</span>
                                                    <span className="text-[#0EA5E9]">{pkg.revisionTurnaround || 1}</span>
                                                </div>
                                                <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${isTooSlow ? 'text-amber-600' : 'text-slate-400'}`}>
                                                    <Clock className={`w-3 h-3 ${isTooSlow ? 'text-amber-500' : 'text-sky-400'}`} />
                                                    {packageTurnaround} Days Delivery Time
                                                </div>
                                            </div>

                                            {selectedPackage === tier && (
                                                <motion.div
                                                    layoutId="package-highlight"
                                                    className="absolute -inset-[2px] rounded-2xl border-2 border-[#0EA5E9] pointer-events-none"
                                                />
                                            )}
                                        </button>
                                    )
                                })}

                                {selectedPackage && selectedService.service_packages[selectedPackage]?.description && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="col-span-1 md:col-span-3 bg-sky-50/50 rounded-2xl p-6 border border-sky-100 mt-2"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center border border-sky-100 shadow-sm">
                                                <Zap className="w-3.5 h-3.5 text-[#0EA5E9]" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deliverables</span>
                                        </div>
                                        <MarkdownRenderer
                                            content={selectedService.service_packages[selectedPackage].description}
                                            className="text-sm text-slate-600 leading-relaxed font-medium"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="bg-sky-50/50 p-2.5 rounded-xl border border-sky-100/50 flex items-center gap-2">
                                <Zap className="w-3 h-3 text-sky-400 shrink-0" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase leading-tight">Delivery: Initial Submission</span>
                            </div>
                            <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50 flex items-center gap-2">
                                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase leading-tight">Revision: Starts after request</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3 pt-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        dir="auto"
                        placeholder="e.g. Physics Assignment Analysis"
                        className="w-full bg-slate-50 border-none rounded-lg p-3 text-slate-900 placeholder-slate-300 focus:ring-1 focus:ring-[#0EA5E9] outline-none transition-all duration-200 text-xs font-bold"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Instructions</label>
                    <FormattedTextarea
                        value={description}
                        onChange={setDescription}
                        placeholder="What do you need done?"
                        compact={true}
                    />
                    <input type="hidden" name="description" value={description} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Deadline</label>
                        <input
                            type="date"
                            name="dueDate"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={dueDate}
                            onChange={(e) => {
                                setDueDate(e.target.value)
                                setSelectedPackage(null) // Reset package to force valid selection for new deadline
                            }}
                            className="w-full bg-slate-50 border-none rounded-lg p-2.5 text-slate-900 focus:ring-1 focus:ring-[#0EA5E9] outline-none transition-all duration-200 text-[11px] font-bold"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Attach Files</label>
                        <MultiFileUpload
                            bucketName="project-files"
                            folderPath={`${creatorId}`}
                            onUploadComplete={(urls) => setFiles(urls)}
                            maxSizeMB={50}
                            compact={true}
                        />
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {files.map((url, index) => (
                        <div key={index} className="px-2 py-1 bg-sky-50 text-[8px] font-bold text-[#0EA5E9] rounded-md border border-sky-100 uppercase">
                            File {index + 1} Uploaded
                            <input key={index} type="hidden" name="fileUrls" value={url} />
                        </div>
                    ))}
                </div>
            )}

            {/* Validation warning if packages mode but nothing selected */}
            {selectedService?.pricing_mode === 'packages' && !selectedPackage && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-tight">Please select a package tier above to continue.</span>
                </div>
            )}

            <div className="pt-2">
                {isBusy ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                        <PowerOff className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Creator Currently Busy</h3>
                        <p className="text-[10px] text-slate-500 font-medium">This editor is not accepting new orders at the moment. Please check back later!</p>
                    </div>
                ) : (
                    <button
                        type="submit"
                        disabled={isPending || (selectedService?.pricing_mode === 'packages' && !selectedPackage)}
                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-800 active:scale-[0.95] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 flex items-center justify-center gap-2 select-none touch-manipulation"
                    >
                        {isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <AEDIcon className="w-4 h-4" />
                                Confirm & Pay AED {
                                    selectedService?.pricing_mode === 'fixed'
                                        ? selectedService.base_price
                                        : selectedPackage
                                            ? selectedService.service_packages[selectedPackage].price
                                            : 0
                                }
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.form>
    )
}
