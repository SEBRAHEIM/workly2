'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, Download, X, Printer } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function PaymentReceiptModal({
    amount,
    date,
    projectName,
    transactionId,
    showReceipt = false
}: {
    amount: number
    date: string
    projectName: string
    transactionId: string
    showReceipt?: boolean
}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(showReceipt)
    const receiptRef = useRef<HTMLDivElement>(null)

    if (!isOpen) return null

    const handlePrint = () => {
        window.print()
    }

    const handleClose = () => {
        setIsOpen(false)
        router.replace(window.location.pathname) // Remove query params
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .printable-receipt, .printable-receipt * {
                        visibility: visible;
                    }
                    .printable-receipt {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 2rem;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 print:max-w-none print:rounded-none printable-receipt">
                {/* Printable Area */}
                <div role="region" aria-label="Receipt" className="p-8 bg-white relative">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 no-print">
                            <Check className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#1E293B] mb-1">Payment Successful</h2>
                        <p className="text-gray-500 text-sm mb-6">Thank you for your payment!</p>

                        <div className="w-full border-t border-b border-dashed border-gray-300 py-6 mb-6">
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500">Amount Paid</span>
                                <span className="font-bold text-[#1E293B]">AED {amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span className="text-gray-500">Date</span>
                                <span className="font-medium text-[#1E293B]">{date}</span>
                            </div>
                            <div className="flex justify-between mb-3 text-xs text-gray-400">
                                <span>Status</span>
                                <span className="font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    SUCCESSFUL
                                </span>
                            </div>
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500">Project</span>
                                <span className="font-medium text-[#1E293B] max-w-[200px] truncate text-right">{projectName}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                                <span>Transaction Reference</span>
                                <span className="font-mono">{transactionId.slice(-12).toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-2 no-print">A receipt has also been sent to your email.</p>
                            <div className="font-bold text-lg tracking-widest text-[#1E293B]">WORKLY</div>
                        </div>
                    </div>
                </div>

                {/* Actions (Not Printed) */}
                <div className="p-6 bg-[#F0F9FF] border-t border-[#F0F9FF] flex gap-3 no-print">
                    <button
                        onClick={handlePrint}
                        className="flex-1 bg-[#1E293B] text-white font-bold py-3 rounded-xl flex items-center justify-center hover:bg-[#222222] transition-colors"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print / PDF
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-3 bg-white border border-[#F0F9FF] rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-5 h-5 text-[#1E293B]" />
                    </button>
                </div>
            </div>
        </div>
    )
}
