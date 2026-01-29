'use client'

/**
 * Reusable component to show financial breakdown for creators.
 * Formula: Price - (17% Workly Fee + 2.9% + 1 AED Processing Fee)
 */
export default function EarningsBreakdown({ price, compact = false, showLabel = true, dark = false }: {
    price: number,
    compact?: boolean,
    showLabel?: boolean,
    dark?: boolean
}) {
    if (!price || price <= 0) return null

    const platformFeePercent = 0.17
    const stripePercent = 0.029
    const stripeFixedFee = 1

    const platformFee = price * platformFeePercent
    const processingFee = (price * stripePercent) + stripeFixedFee
    const totalFee = platformFee + processingFee
    const earnings = price - totalFee

    const containerClasses = dark
        ? `rounded-xl border border-white/10 bg-white/5 ${compact ? 'p-3 my-2' : 'p-4 my-4'}`
        : `rounded-xl border border-[#F0F9FF] bg-[#FFFFFF]/50 ${compact ? 'p-3 my-2' : 'p-4 my-4'}`

    const labelClasses = dark ? "text-[10px] font-bold text-white/40 uppercase tracking-widest" : "text-[10px] font-bold text-gray-400 uppercase tracking-widest"
    const feeClasses = "text-xs font-medium text-red-500"
    const netLabelClasses = dark ? "text-xs font-bold text-white/80" : "text-xs font-bold text-[#333]"
    const netValueClasses = dark ? "text-sm font-black text-white" : "text-sm font-black text-[#0EA5E9]"
    const dividerClasses = dark ? "border-t border-white/10" : "border-t border-[#F0F9FF]"

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-center mb-2">
                <span className={labelClasses}>Service & Processing Fee</span>
                <span className={feeClasses}>-{totalFee.toFixed(2)} AED</span>
            </div>
            <div className={`flex justify-between items-center pt-2 ${dividerClasses}`}>
                <span className={netLabelClasses}>
                    {showLabel ? 'Your Estimated Earnings' : 'Net Earnings'}
                </span>
                <span className={netValueClasses}>{Math.max(0, earnings).toFixed(2)} AED</span>
            </div>
            {!compact && (
                <p className={`text-[9px] mt-2 font-medium px-2 py-1 rounded inline-block ${dark ? 'text-white/40 bg-white/5' : 'text-gray-400 bg-[#0EA5E9]/5'}`}>
                    Includes Workly service contribution & secure payment processing.
                </p>
            )}
        </div>
    )
}
