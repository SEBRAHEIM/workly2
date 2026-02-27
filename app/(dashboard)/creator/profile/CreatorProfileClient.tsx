'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import ProfileSection from './ProfileSection'
import IdentityForm from './IdentityForm'
import ExpertiseForm from './ExpertiseForm'
import PricingForm from './PricingForm'
import PortfolioCategoryAccordion from './PortfolioCategoryAccordion'
import { categories as allCategories } from '@/app/data/categories'
import { Briefcase, Power, PowerOff, Loader2 } from 'lucide-react'
import PayoutSettings from '../PayoutSettings'
import { updateBusyStatus } from './actions'

interface Props {
    profile: any
    portfolioItems: any[]
    services: any[]
}

export default function CreatorProfileClient({ profile, portfolioItems, services }: Props) {
    const [isBusy, setIsBusy] = useState(profile?.is_busy || false)
    const [isToggling, setIsToggling] = useState(false)

    const handleToggleBusy = async () => {
        setIsToggling(true)
        const newStatus = !isBusy
        const result = await updateBusyStatus(newStatus)
        if (result.success) {
            setIsBusy(newStatus)
            toast.success(newStatus ? "Availability: Busy" : "Availability: Accepting Orders")
        } else {
            toast.error("Failed to update status")
        }
        setIsToggling(false)
    }
    // Determine initial step based on completion
    // 1. Identity: Display Name && Bio
    // 2. Expertise: Specializations length > 0
    // 3. Pricing: Always available (defaults exist)
    // 4. Portfolio

    const hasIdentity = !!(profile?.display_name && profile?.bio)
    const hasExpertise = !!(profile?.specializations && profile.specializations.length > 0)
    // We consider pricing "done" if there is a mode set, which is default. 
    // But logically, Step 3 is just the next step.
    const hasPricing = true // It's always "ready" to be edited, but let's treat it as a step to pass through.

    const [openSection, setOpenSection] = useState<'identity' | 'expertise' | 'pricing' | 'portfolio' | 'payouts' | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        // Run once on mount to determine where to start
        if (!hasIdentity) {
            setOpenSection('identity')
        } else if (!hasExpertise) {
            setOpenSection('expertise')
        } else {
            // Default to nothing open if mostly done
            setOpenSection(null)
        }
    }, [hasIdentity, hasExpertise])

    const handleIdentitySave = () => {
        setOpenSection('expertise')
    }

    const handleExpertiseSave = () => {
        setOpenSection('pricing')
    }

    const handlePayoutSave = () => {
        setOpenSection(null)
    }

    // Pricing typically doesn't have a "Save & Continue" that we hook into easily unless we update the form to accept a callback.
    // For now, the user manually closes or we can update `PricingForm` to take `onSuccess` too.
    // Let's just let them click.

    // Summary Helpers
    const identitySummary = hasIdentity
        ? `${profile.display_name} • ${profile.tagline || 'No tagline'}`
        : 'Name, Bio, Tagline'

    const expertiseSummary = hasExpertise
        ? `${profile.specializations.length} Categories Selected`
        : 'Select your skills'

    const pricingSummary = profile?.pricing_mode === 'packages'
        ? 'Service Packages'
        : `Fixed Rate (AED ${profile?.base_price || 0})`

    const savedSpecializations = profile?.specializations || []

    const hasPortfolio = portfolioItems && portfolioItems.length > 0

    return (
        <div className="space-y-6">
            {/* Availability Toggle */}
            <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${isBusy
                ? 'bg-slate-50 border-slate-200'
                : 'bg-gradient-to-r from-sky-50 to-blue-50 border-sky-100 shadow-sm shadow-sky-100/50'
                }`}>
                <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${isBusy
                        ? 'bg-white border-slate-200 text-slate-400'
                        : 'bg-white border-sky-200 text-[#0EA5E9] shadow-md shadow-sky-100'
                        }`}>
                        {isBusy ? <PowerOff className="w-7 h-7" /> : <Power className="w-7 h-7" />}
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight ${isBusy ? 'text-slate-500' : 'text-slate-900'}`}>
                            {isBusy ? 'Currently Busy' : 'Accepting Orders'}
                        </h3>
                        <p className={`text-sm font-medium ${isBusy ? 'text-slate-400' : 'text-sky-600/70'}`}>
                            {isBusy
                                ? 'Your packages are hidden from clients.'
                                : 'You are visible and ready for new projects.'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleToggleBusy}
                    disabled={isToggling}
                    className={`relative w-20 h-10 rounded-full transition-all duration-500 p-1.5 flex items-center ${isBusy ? 'bg-slate-200' : 'bg-[#0EA5E9]'
                        }`}
                    title={isBusy ? 'Turn On' : 'Turn Off'}
                >
                    <motion.div
                        animate={{ x: isBusy ? 2 : 40 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center"
                    >
                        {isToggling ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        ) : isBusy ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                        )}
                    </motion.div>
                </button>
            </div>

            {/* 1. Identity Section */}
            <ProfileSection
                title="1. Identity"
                summary={identitySummary}
                isOpen={openSection === 'identity'}
                isCompleted={hasIdentity}
                onToggle={() => setOpenSection(openSection === 'identity' ? null : 'identity')}
            >
                <IdentityForm
                    key={`identity-${profile?.id}-${profile?.updated_at || ''}`}
                    profile={profile}
                    onSuccess={handleIdentitySave}
                />
            </ProfileSection>

            {/* 2. Expertise Section */}
            {hasIdentity && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProfileSection
                        title="2. Expertise"
                        summary={expertiseSummary}
                        isOpen={openSection === 'expertise'}
                        isCompleted={hasExpertise}
                        onToggle={() => setOpenSection(openSection === 'expertise' ? null : 'expertise')}
                    >
                        <ExpertiseForm
                            key={`expertise-${profile?.id}`}
                            savedSpecializations={savedSpecializations}
                            onSuccess={handleExpertiseSave}
                        />
                    </ProfileSection>
                </div>
            )}

            {/* 3. Pricing Section */}
            {hasExpertise && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProfileSection
                        title="3. Services & Pricing"
                        summary={pricingSummary}
                        isOpen={openSection === 'pricing'}
                        isCompleted={true} // Always valid State
                        onToggle={() => setOpenSection(openSection === 'pricing' ? null : 'pricing')}
                    >
                        <PricingForm
                            profile={profile}
                            services={services}
                            specializations={savedSpecializations}
                        />
                    </ProfileSection>
                </div>
            )}

            {/* 4. Portfolio Section */}
            {hasExpertise && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProfileSection
                        title="4. Portfolio"
                        summary={hasPortfolio ? `${portfolioItems.length} Work Samples` : 'Upload your best work'}
                        isOpen={openSection === 'portfolio'}
                        isCompleted={hasPortfolio}
                        onToggle={() => setOpenSection(openSection === 'portfolio' ? null : 'portfolio')}
                    >
                        <div className="space-y-6">
                            <p className="text-gray-500 text-sm mb-4">
                                Upload work for each category to stand out.
                            </p>

                            {savedSpecializations.length > 0 ? (
                                <div className="space-y-4">
                                    {savedSpecializations.map((slug: string) => {
                                        const category = allCategories.find(c => c.slug === slug)
                                        if (!category) return null

                                        const items = portfolioItems?.filter(i => i.category_slug === slug) || []

                                        return (
                                            <PortfolioCategoryAccordion
                                                key={slug}
                                                category={category}
                                                items={items}
                                            />
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center">
                                    <Briefcase className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                                    <h4 className="font-bold text-orange-800 mb-1">No Categories Selected</h4>
                                    <p className="text-orange-600 text-sm">Please complete the Expertise section first.</p>
                                    <button
                                        onClick={() => setOpenSection('expertise')}
                                        className="mt-3 text-sm font-bold text-[#0EA5E9] underline"
                                    >
                                        Go to Expertise
                                    </button>
                                </div>
                            )}
                        </div>
                    </ProfileSection>
                </div>
            )}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProfileSection
                    title="5. Payouts"
                    summary={
                        profile?.bank_iban ? 'Bank Details Set' :
                            profile?.paypal_email ? 'PayPal Details Set' :
                                'Set up how you get paid'
                    }
                    isOpen={openSection === 'payouts' as any}
                    isCompleted={!!(profile?.bank_iban || profile?.paypal_email)}
                    onToggle={() => setOpenSection(openSection === 'payouts' as any ? null : 'payouts' as any)}
                >
                    <PayoutSettings profile={profile} onSuccess={handlePayoutSave} />
                </ProfileSection>
            </div>
        </div>
    )
}
