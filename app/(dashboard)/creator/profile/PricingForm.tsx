'use client'

import { useState, useEffect } from 'react'
import { Check, Briefcase, MessageSquare, Zap, AlertCircle } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import { toast } from 'sonner'
import { updateCreatorPricing } from './actions'
import FormattedTextarea from '@/app/components/FormattedTextarea'
import { categories } from '@/app/data/categories'
import EarningsBreakdown from '@/app/components/EarningsBreakdown'

interface PricingFormProps {
    profile: any
    services: any[]
    specializations: string[]
}

type PricingMode = 'fixed' | 'negotiable' | 'packages'

const DEFAULT_PACKAGES = {
    basic: { title: 'Basic', price: 50, description: '', revisions: 1, turnaround: 2 },
    standard: { title: 'Standard', price: 100, description: '', revisions: 2, turnaround: 2 },
    premium: { title: 'Premium', price: 200, description: '', revisions: 3, turnaround: 2 }
}

export default function PricingForm({ profile, services, specializations }: PricingFormProps) {
    const [loading, setLoading] = useState(false)

    // Category Selection state
    const [selectedCategory, setSelectedCategory] = useState<string>(specializations[0] || 'general')

    // Local state for the CURRENTLY selected category
    const [mode, setMode] = useState<PricingMode>('packages')
    const [basePrice, setBasePrice] = useState(0)
    const [packages, setPackages] = useState(DEFAULT_PACKAGES)
    const [activeTab, setActiveTab] = useState<'basic' | 'standard' | 'premium'>('basic')

    // Effect: Load data when Category changes
    useEffect(() => {
        // Find saved service config for this category
        const savedService = services.find(s => s.category_slug === selectedCategory)

        if (savedService) {
            setMode('packages')
            setBasePrice(savedService.base_price || 0)
            // Merge saved packages with defaults to ensure 'turnaround' exists if it was missing
            const mergedPackages = { ...DEFAULT_PACKAGES }
            if (savedService.service_packages) {
                Object.keys(savedService.service_packages).forEach(tier => {
                    mergedPackages[tier as keyof typeof DEFAULT_PACKAGES] = {
                        ...DEFAULT_PACKAGES[tier as keyof typeof DEFAULT_PACKAGES],
                        ...savedService.service_packages[tier]
                    }
                })
            }
            setPackages(mergedPackages)
        } else {
            setMode('packages')
            setBasePrice(0)
            setPackages(DEFAULT_PACKAGES)
        }
    }, [selectedCategory, services])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation: Ensure all titles and descriptions are filled
        const incomplete = Object.values(packages).some(p => !p.title || !p.description || !p.price)
        if (incomplete) {
            toast.error('All 3 tiers (Basic, Standard, Premium) must be fully completed to save.')
            return
        }

        setLoading(true)

        const formData = new FormData()
        formData.append('categorySlug', selectedCategory)
        formData.append('pricingMode', 'packages')
        formData.append('basePrice', basePrice.toString())
        formData.append('servicePackages', JSON.stringify(packages))

        const result = await updateCreatorPricing(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`Pricing for ${getCategoryTitle(selectedCategory)} deployed!`)
        }
        setLoading(false)
    }

    const updatePackage = (tier: 'basic' | 'standard' | 'premium', field: string, value: any) => {
        setPackages((prev: any) => ({
            ...prev,
            [tier]: { ...prev[tier], [field]: value }
        }))
    }

    const getCategoryTitle = (slug: string) => {
        return categories.find(c => c.slug === slug)?.title || slug
    }

    if (specializations.length === 0) {
        return (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <h4 className="font-bold text-orange-800 mb-1">No Specializations Selected</h4>
                <p className="text-orange-600 text-sm">Please select your expertise categories first before setting pricing.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {specializations.map(slug => (
                    <button
                        key={slug}
                        onClick={() => setSelectedCategory(slug)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border touch-manipulation shadow-sm ${selectedCategory === slug
                            ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-lg shadow-sky-100'
                            : 'bg-white text-slate-400 border-sky-50 hover:border-sky-100 hover:text-slate-600'
                            }`}
                    >
                        {getCategoryTitle(slug)}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-serif font-black text-slate-900 uppercase tracking-tighter">
                            Package Architecture: {getCategoryTitle(selectedCategory)}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Configure all three tiers to activate this service segment.</p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 leading-relaxed font-medium">
                        <strong>Pricing Transparency:</strong> Workly charges a flat <strong>20% commission</strong> on all earnings.
                        This covers your platform access, marketing, and secure Stripe payment processing.
                        You will see your net payout estimate below the price input.
                    </div>
                </div>

                {/* Dynamic content based on Mode */}
                <div className="bg-white rounded-[2rem] border border-sky-50 p-6 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Briefcase size={120} className="text-[#0EA5E9] -rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex gap-4 md:gap-8 mb-10 border-b border-sky-50 pb-0 overflow-x-auto scrollbar-hide">
                            {(['basic', 'standard', 'premium'] as const).map(tier => (
                                <button
                                    key={tier}
                                    type="button"
                                    onClick={() => setActiveTab(tier)}
                                    className={`px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === tier ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                                >
                                    {tier} Tier
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-in slide-in-from-bottom-2 duration-300" key={activeTab}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Package Heading</label>
                                    <input
                                        type="text"
                                        value={packages[activeTab].title}
                                        onChange={(e) => updatePackage(activeTab, 'title', e.target.value)}
                                        className="w-full p-4 rounded-xl border border-sky-50 bg-white text-sm font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-[#0EA5E9] transition-all"
                                        placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Deliverable`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price (AED)</label>
                                    <input
                                        type="number"
                                        value={packages[activeTab].price}
                                        onChange={(e) => updatePackage(activeTab, 'price', Number(e.target.value))}
                                        className="w-full p-4 rounded-xl border border-[#0EA5E9]/20 bg-sky-50/20 text-base font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-[#0EA5E9] transition-all"
                                    />
                                    <EarningsBreakdown price={packages[activeTab].price} compact />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revisions</label>
                                        <input
                                            type="number"
                                            value={packages[activeTab].revisions}
                                            onChange={(e) => updatePackage(activeTab, 'revisions', Number(e.target.value))}
                                            className="w-full p-3 rounded-xl border border-sky-50 bg-white text-sm font-bold text-slate-700 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revision Time (Days)</label>
                                        <input
                                            type="number"
                                            value={packages[activeTab].turnaround || 2}
                                            onChange={(e) => updatePackage(activeTab, 'turnaround', Number(e.target.value))}
                                            className="w-full p-3 rounded-xl border border-sky-50 bg-white text-sm font-bold text-slate-700 outline-none"
                                            placeholder="2"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <Zap className="w-3 h-3 text-sky-400 inline mr-1 mb-0.5" />
                                    Revision time is the number of days you have to complete a requested change round.
                                </p>
                            </div>
                            <div>
                                <FormattedTextarea
                                    label="Deliverables & Details"
                                    value={packages[activeTab].description}
                                    onChange={(val) => updatePackage(activeTab, 'description', val)}
                                    compact={true}
                                    placeholder="List features, deliverables, and important details...
• Feature 1
• Feature 2
✅ Guarantee"
                                />
                                <p className="text-[10px] text-slate-400 font-medium mt-3 italic">Be specific about what the client receives in this tier.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-[#0EA5E9] text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-sky-100 active:scale-95 touch-manipulation"
                    >
                        {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Save All 3 Tiers for {getCategoryTitle(selectedCategory)}
                    </button>
                </div>
            </form >
        </div >
    )
}
