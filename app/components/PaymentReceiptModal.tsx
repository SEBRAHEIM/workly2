'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X, Printer, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toPng } from 'html-to-image'

export default function PaymentReceiptModal({
    amount,
    date,
    projectName,
    transactionId,
    showReceipt = false,
    onClose,
    clientName,
    clientEmail,
    creatorName
}: {
    amount: number
    date: string
    projectName: string
    transactionId: string
    showReceipt?: boolean
    onClose?: () => void
    clientName?: string
    clientEmail?: string
    creatorName?: string
}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(showReceipt)
    const [isSaving, setIsSaving] = useState(false)
    const receiptRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsOpen(showReceipt)
    }, [showReceipt])

    if (!isOpen) return null

    const handlePrint = () => {
        window.print()
    }

    const handleSaveImage = async () => {
        if (!receiptRef.current) return
        setIsSaving(true)
        try {
            await new Promise(r => setTimeout(r, 100))
            const dataUrl = await toPng(receiptRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                style: {
                    borderRadius: '0'
                }
            })
            const link = document.createElement('a')
            link.download = `Workly-Receipt-${transactionId.slice(-8)}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error('Failed to save image:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        if (onClose) {
            onClose()
        } else {
            router.replace(window.location.pathname)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0 overflow-y-auto">
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

            <div className="bg-white rounded-none sm:rounded-3xl w-full max-w-md min-h-full sm:min-h-0 overflow-hidden animate-in fade-in zoom-in duration-300 print:max-w-none print:rounded-none printable-receipt flex flex-col shadow-2xl">
                {/* Printable Area */}
                <div ref={receiptRef} role="region" aria-label="Receipt" className="p-8 sm:p-10 bg-white relative flex-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 no-print">
                            <Check className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-sans font-black font-bold text-[#1E293B] mb-1">Payment Successful</h2>
                        <p className="text-gray-500 text-sm mb-6">Thank you for your payment!</p>

                        <div className="w-full border-t border-b border-dashed border-gray-300 py-6 mb-6 text-left">
                            <div className="grid grid-cols-2 gap-y-4 text-sm mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Billed To</p>
                                    <p className="font-bold text-[#1E293B]">{clientName || 'Client Account'}</p>
                                    <p className="text-[10px] text-gray-500">{clientEmail}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                                    <p className="font-bold text-[#1E293B]">Secure Digital Payment</p>
                                    <p className="text-[10px] text-gray-500 italic">Verified Escrow</p>
                                </div>
                            </div>

                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500 font-medium">Provided By</span>
                                <span className="font-bold text-[#0EA5E9] uppercase tracking-tighter">{creatorName || 'Workly Creator'}</span>
                            </div>

                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500 font-medium">Project Name</span>
                                <span className="font-bold text-[#1E293B] max-w-[200px] truncate text-right">{projectName}</span>
                            </div>

                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500 font-medium">Transaction Date</span>
                                <span className="font-bold text-[#1E293B]">{date}</span>
                            </div>

                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-gray-500 font-medium">Status</span>
                                <span className="font-bold text-green-600 uppercase tracking-widest flex items-center gap-1 text-[10px]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Payment Successful
                                </span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-lg font-sans font-black font-black text-[#1E293B]">Total Paid</span>
                                <span className="text-2xl font-sans font-black font-black text-[#0EA5E9]">AED {amount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-[10px] text-gray-400 mt-6 pt-4 border-t border-gray-100 uppercase tracking-widest font-black">
                                <span>Reference ID</span>
                                <span className="font-mono">{transactionId.slice(-16).toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-gray-400 mb-4 no-print max-w-[240px] mx-auto leading-tight">
                                This is an official digital receipt from Workly.day for your secure escrow payment.
                            </p>
                            <div className="font-black text-2xl tracking-tighter text-[#1E293B]">WORKLY<span className="text-[#0EA5E9]">.</span></div>
                        </div>
                    </div>
                </div>

                {/* Actions (Not Printed) */}
                <div className="p-6 bg-[#F0F9FF] border-t border-sky-100 no-print sticky bottom-0 mt-auto">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            onClick={handleSaveImage}
                            disabled={isSaving}
                            className="bg-white text-[#1E293B] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center hover:bg-sky-50 transition-all border border-sky-100 shadow-sm disabled:opacity-50"
                        >
                            <ImageIcon className="w-4 h-4 mr-2 text-[#0EA5E9]" />
                            {isSaving ? 'Saving...' : 'Save to Photo'}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-white text-[#1E293B] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center hover:bg-sky-50 transition-all border border-sky-100 shadow-sm"
                        >
                            <Printer className="w-4 h-4 mr-2 text-[#0EA5E9]" />
                            Print / PDF
                        </button>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full bg-[#1E293B] text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <X className="w-4 h-4 mr-2 text-white/40" />
                        Close Receipt
                    </button>
                </div>
            </div>
        </div>
    )
}
