'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import ProfileSection from './ProfileSection'
import IdentityForm from './IdentityForm'
import ExpertiseForm from './ExpertiseForm'
import PricingForm from './PricingForm'
import PortfolioCategoryAccordion from './PortfolioCategoryAccordion'
import { categories as allCategories } from '@/app/data/categories'
import { Briefcase } from 'lucide-react'
import PayoutSettings from '../PayoutSettings'

interface Props {
    profile: any
    portfolioItems: any[]
    services: any[]
}

export default function CreatorProfileClient({ profile, portfolioItems, services }: Props) {
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

            {/* 1. Identity Section */}
            <ProfileSection
                title="1. Identity"
                summary={identitySummary}
                isOpen={openSection === 'identity'}
                isCompleted={hasIdentity}
                onToggle={() => setOpenSection(openSection === 'identity' ? null : 'identity')}
            >
                <IdentityForm
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
                    <PayoutSettings profile={profile} />
                </ProfileSection>
            </div>
        </div>
    )
}
