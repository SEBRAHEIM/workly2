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
        const printContent = receiptRef.current
        if (printContent) {
            const originalContents = document.body.innerHTML
            document.body.innerHTML = printContent.innerHTML
            window.print()
            document.body.innerHTML = originalContents
            window.location.reload() // Reload to restore event listeners
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        router.replace(window.location.pathname) // Remove query params
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Printable Area */}
                <div ref={receiptRef} className="p-8 bg-white relative">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <Check className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#333333] mb-1">Payment Successful</h2>
                        <p className="text-gray-500 text-sm mb-6">Thank you for your payment!</p>

                        <div className="w-full border-t border-b border-dashed border-gray-300 py-6 mb-6">
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500">Amount Paid</span>
                                <span className="font-bold text-[#333333]">AED {amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500">Date</span>
                                <span className="font-medium text-[#333333]">{date}</span>
                            </div>
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500">Project</span>
                                <span className="font-medium text-[#333333] max-w-[200px] truncate text-right">{projectName}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                                <span>Transaction ID</span>
                                <span className="font-mono">{transactionId.slice(-8).toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-2">A receipt has also been sent to your email.</p>
                            <div className="font-bold text-lg tracking-widest text-[#333333]">WORKLY</div>
                        </div>
                    </div>
                </div>

                {/* Actions (Not Printed) */}
                <div className="p-6 bg-[#F3F0E9] border-t border-[#E6E2D6] flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex-1 bg-[#333333] text-white font-bold py-3 rounded-xl flex items-center justify-center hover:bg-[#222222] transition-colors"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print / PDF
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-3 bg-white border border-[#E6E2D6] rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-5 h-5 text-[#333333]" />
                    </button>
                </div>
            </div>
        </div>
    )
}
