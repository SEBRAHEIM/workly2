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
    basic: { title: 'Basic', price: 50, description: '', delivery_days: 3, revisions: 1 },
    standard: { title: 'Standard', price: 100, description: '', delivery_days: 5, revisions: 2 },
    premium: { title: 'Premium', price: 200, description: '', delivery_days: 7, revisions: 3 }
}

export default function PricingForm({ profile, services, specializations }: PricingFormProps) {
    const [loading, setLoading] = useState(false)

    // Category Selection state
    // If no specializations, we fallback to a "General" or handle empty state.
    // If specializations exist, allow selecting one.
    const [selectedCategory, setSelectedCategory] = useState<string>(specializations[0] || 'general')

    // Local state for the CURRENTLY selected category
    // We initialize these based on the `services` prop matching `selectedCategory`
    const [mode, setMode] = useState<PricingMode>('fixed')
    const [basePrice, setBasePrice] = useState(0)
    const [packages, setPackages] = useState(DEFAULT_PACKAGES)
    const [activeTab, setActiveTab] = useState<'basic' | 'standard' | 'premium'>('basic')

    // Effect: Load data when Category changes
    useEffect(() => {
        // Find saved service config for this category
        const savedService = services.find(s => s.category_slug === selectedCategory)

        if (savedService) {
            // Force 'fixed' if it was previously 'negotiable'
            const initialMode = savedService.pricing_mode === 'negotiable' ? 'fixed' : savedService.pricing_mode
            setMode(initialMode as PricingMode)
            setBasePrice(savedService.base_price || 0)
            setPackages(savedService.service_packages || DEFAULT_PACKAGES)
        } else {
            // Fallback to Profile Defaults if no specific service exists yet
            // OR reset to new
            // Ideally reset to new defaults to prompt setup
            setMode('fixed')
            setBasePrice(0)
            setPackages(DEFAULT_PACKAGES)
        }
    }, [selectedCategory, services])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('categorySlug', selectedCategory)
        formData.append('pricingMode', mode)
        formData.append('basePrice', basePrice.toString())
        formData.append('servicePackages', JSON.stringify(packages))

        const result = await updateCreatorPricing(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`Pricing for ${getCategoryTitle(selectedCategory)} saved!`)
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
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {specializations.map(slug => (
                    <button
                        key={slug}
                        onClick={() => setSelectedCategory(slug)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCategory === slug
                            ? 'bg-[#3E4C37] text-white border-[#3E4C37]'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {getCategoryTitle(slug)}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">

                <h3 className="text-xl font-serif font-bold text-[#333]">
                    Pricing for {getCategoryTitle(selectedCategory)}
                </h3>

                {/* Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setMode('fixed')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'fixed' ? 'border-[#3E4C37] bg-[#F3F0E9]' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 text-[#3E4C37] shadow-sm">
                            <AEDIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-[#333]">Fixed Price</h3>
                        <p className="text-xs text-gray-500 mt-1">Single rate per project.</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode('packages')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'packages' ? 'border-[#3E4C37] bg-[#F3F0E9]' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 text-[#3E4C37] shadow-sm">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-[#333]">Packages</h3>
                        <p className="text-xs text-gray-500 mt-1">3-Tier Services.</p>
                    </button>
                </div>

                {/* Dynamic content based on Mode */}
                <div className="bg-white rounded-2xl border border-[#E6E2D6] p-6 shadow-sm">

                    {mode === 'fixed' && (
                        <div className="max-w-md">
                            <label className="block text-sm font-bold text-[#333] mb-2">Your Fixed Rate</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-xs font-bold text-gray-400 mt-0.5">AED</span>
                                <input
                                    type="number"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(Number(e.target.value))}
                                    className="w-full pl-12 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3E4C37]"
                                    placeholder="500"
                                />
                            </div>
                            <EarningsBreakdown price={basePrice} />
                            <p className="text-xs text-gray-400 mt-2">Projects will be charged at this rate.</p>
                        </div>
                    )}


                    {mode === 'packages' && (
                        <div>
                            <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
                                {(['basic', 'standard', 'premium'] as const).map(tier => (
                                    <button
                                        key={tier}
                                        type="button"
                                        onClick={() => setActiveTab(tier)}
                                        className={`px-4 py-2 text-sm font-bold capitalize transition-colors border-b-2 -mb-1.5 ${activeTab === tier ? 'border-[#3E4C37] text-[#3E4C37]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tier}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300" key={activeTab}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#333] mb-1">Package Title</label>
                                        <input
                                            type="text"
                                            value={packages[activeTab].title}
                                            onChange={(e) => updatePackage(activeTab, 'title', e.target.value)}
                                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                            placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Package`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#333] mb-1">Price (AED)</label>
                                        <input
                                            type="number"
                                            value={packages[activeTab].price}
                                            onChange={(e) => updatePackage(activeTab, 'price', Number(e.target.value))}
                                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                        />
                                        <EarningsBreakdown price={packages[activeTab].price} compact />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#333] mb-1">Delivery (Days)</label>
                                            <input
                                                type="number"
                                                value={packages[activeTab].delivery_days}
                                                onChange={(e) => updatePackage(activeTab, 'delivery_days', Number(e.target.value))}
                                                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#333] mb-1">Revisions</label>
                                            <input
                                                type="number"
                                                value={packages[activeTab].revisions}
                                                onChange={(e) => updatePackage(activeTab, 'revisions', Number(e.target.value))}
                                                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <FormattedTextarea
                                        label="What's included?"
                                        value={packages[activeTab].description}
                                        onChange={(val) => updatePackage(activeTab, 'description', val)}
                                        rows={8}
                                        placeholder="List features, deliverables, and important details...
• Feature 1
• Feature 2
✅ Guarantee"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#333333] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3E4C37] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Save {getCategoryTitle(selectedCategory)} Pricing
                    </button>
                </div>
            </form >
        </div >
    )
}
