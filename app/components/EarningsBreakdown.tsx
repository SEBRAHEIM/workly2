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

    const platformCommission = 0.20
    const commissionAmount = price * platformCommission
    const earnings = price - commissionAmount

    const containerClasses = dark
        ? `rounded-xl border border-white/10 bg-white/5 ${compact ? 'p-3 my-2' : 'p-4 my-4'}`
        : `rounded-xl border border-sky-50 bg-sky-50/20 ${compact ? 'p-3 my-2' : 'p-4 my-4'}`

    const labelClasses = dark ? "text-[10px] font-bold text-white/40 uppercase tracking-widest" : "text-[10px] font-bold text-slate-400 uppercase tracking-widest"
    const feeClasses = "text-xs font-medium text-red-500"
    const netLabelClasses = dark ? "text-xs font-bold text-white/80" : "text-xs font-bold text-slate-800"
    const netValueClasses = dark ? "text-sm font-black text-white" : "text-sm font-black text-[#0EA5E9]"
    const dividerClasses = dark ? "border-t border-white/10" : "border-t border-sky-100"

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-center mb-2">
                <span className={labelClasses}>Workly Commission (20%)</span>
                <span className={feeClasses}>-{commissionAmount.toFixed(2)} AED</span>
            </div>
            <div className={`flex justify-between items-center pt-2 ${dividerClasses}`}>
                <span className={netLabelClasses}>
                    {showLabel ? 'Net Creator Earnings' : 'Net Earnings'}
                </span>
                <span className={netValueClasses}>{Math.max(0, earnings).toFixed(2)} AED</span>
            </div>
            {!compact && (
                <p className={`text-[9px] mt-2 font-medium px-2 py-1 rounded inline-block ${dark ? 'text-white/40 bg-white/5' : 'text-slate-400 bg-sky-50'}`}>
                    Includes platform fee & payment processing. Total deduction: 20%.
                </p>
            )}
        </div>
    )
}
