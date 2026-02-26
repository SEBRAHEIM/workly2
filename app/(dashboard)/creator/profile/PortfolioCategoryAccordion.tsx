
'use client'

import { useState } from 'react'
import { ChevronDown, Plus, CheckCircle, AlertTriangle, FileText, Trash2 } from 'lucide-react'
import PortfolioUploadForm from './PortfolioUploadForm'
import { deletePortfolioItem } from './actions'
import { toast } from 'sonner'

interface PortfolioItem {
    id: string
    title: string
    image_url: string
    category_slug: string
}

interface Props {
    category: {
        slug: string
        title: string
    }
    items: PortfolioItem[]
    readOnly?: boolean
}

export default function PortfolioCategoryAccordion({ category, items, readOnly = false }: Props) {
    const [isOpen, setIsOpen] = useState(readOnly)
    const [showUpload, setShowUpload] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (itemId: string) => {
        if (!confirm('Are you sure you want to remove this work sample?')) return

        setIsDeleting(itemId)
        try {
            const result = await deletePortfolioItem(itemId)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Professional work sample removed.')
            }
        } catch (error) {
            toast.error('Failed to delete item.')
        } finally {
            setIsDeleting(null)
        }
    }

    const hasItems = items && items.length > 0

    const isImage = (url: string) => {
        if (!url) return false
        return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) != null
    }

    return (
        <div className="bg-white rounded-2xl border border-[#F0F9FF] overflow-hidden transition-all shadow-sm hover:shadow-md mb-4">

            {/* Header / Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasItems ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                        {hasItems ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1E293B] text-lg">{category.title}</h3>
                        <p className="text-sm text-gray-500">
                            {hasItems ? `${items.length} work sample(s)` : 'No work samples yet'}
                        </p>
                    </div>
                </div>

                {/* Preview Strip (Visible when closed) */}
                {hasItems && !isOpen && (
                    <div className="hidden md:flex items-center gap-1 mr-4">
                        {items.slice(0, 3).map(item => (
                            <div key={item.id} className="w-12 h-8 rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                {isImage(item.image_url) ? (
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <FileText className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        ))}
                        {items.length > 3 && (
                            <span className="text-xs text-gray-400 font-medium ml-1">+{items.length - 3}</span>
                        )}
                    </div>
                )}

                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Body */}
            {isOpen && (
                <div className="p-6 pt-0 border-t border-[#F0F9FF] bg-white">
                    <div className="mt-6">
                        {/* Grid of Items */}
                        {hasItems ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="group relative rounded-xl overflow-hidden border border-[#F0F9FF] aspect-video bg-gray-100 flex items-center justify-center">
                                        {/* File Display */}
                                        {isImage(item.image_url) ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full relative bg-white">
                                                <iframe
                                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(item.image_url)}&embedded=true`}
                                                    className="w-full h-full border-none pointer-events-none"
                                                    title={item.title}
                                                    scrolling="no"
                                                />
                                                {/* Overlay to catch clicks if pointer-events-none fails or for consistent overlay */}
                                                <div className="absolute inset-0 bg-transparent" />
                                            </div>
                                        )}

                                        {/* Overlay / Link */}
                                        <a
                                            href={item.image_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center z-10"
                                        >
                                            {isImage(item.image_url) ? (
                                                <span className="font-bold text-sm line-clamp-2 mb-2">{item.title}</span>
                                            ) : (
                                                <div className="mb-2">
                                                    <FileText className="w-8 h-8 mx-auto mb-2 text-white/80" />
                                                    <span className="font-bold text-sm line-clamp-2">{item.title}</span>
                                                </div>
                                            )}
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Click to View</span>
                                        </a>

                                        {/* Delete Button (Only if NOT readOnly) */}
                                        {!readOnly && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(item.id)
                                                }}
                                                disabled={isDeleting === item.id}
                                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 z-20 shadow-lg disabled:opacity-50"
                                                title="Remove item"
                                            >
                                                {isDeleting === item.id ? (
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-6">
                                <p className="text-gray-500 mb-2">
                                    {readOnly
                                        ? `No work samples uploaded for ${category.title}.`
                                        : `You haven't uploaded any work for ${category.title} yet.`
                                    }
                                </p>
                                {!readOnly && <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">Required for visibility</p>}
                            </div>
                        )}

                        {/* Add Button or Form (Only if NOT readOnly) */}
                        {!readOnly && (
                            <>
                                {showUpload ? (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <PortfolioUploadForm forcedCategorySlug={category.slug} />
                                        <button
                                            onClick={() => setShowUpload(false)}
                                            className="text-sm text-gray-400 hover:text-gray-600 underline mt-2"
                                        >
                                            Cancel Upload
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowUpload(true)}
                                        className="w-full py-4 border-2 border-dashed border-[#F0F9FF] rounded-xl text-gray-500 font-bold hover:border-[#0EA5E9] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Work to {category.title}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
