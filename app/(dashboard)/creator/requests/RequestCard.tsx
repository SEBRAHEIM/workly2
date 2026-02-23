'use client'

import { useState, useCallback } from 'react'
import { User, Clock, Download, ChevronDown, ChevronUp, XCircle, Trash2, Upload, File as FileIcon, Loader2, Zap, Shield, FileText, Check, MessageSquare, Briefcase, AlertTriangle } from 'lucide-react'
import AEDIcon from '@/app/components/AEDIcon'
import { declineProject, deleteProject, submitWork, startProject } from '../actions'
import { toast } from 'sonner'
import MarkdownRenderer from '@/app/components/MarkdownRenderer'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/utils/supabase/client'

import { categories } from '@/app/data/categories'
import EarningsBreakdown from '@/app/components/EarningsBreakdown'

interface RequestCardProps {
    req: any
}

export default function RequestCard({ req }: RequestCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isDeclining, setIsDeclining] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [offerPrice, setOfferPrice] = useState<number>(req.current_price || 0)

    // File Upload State
    const [uploading, setUploading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState('')
    const [uploadedFileName, setUploadedFileName] = useState('')

    const supabase = createClient()

    const onDrop = useCallback(async (acceptedFiles: globalThis.File[]) => {
        if (acceptedFiles.length === 0) return

        setUploading(true)
        const file = acceptedFiles[0]
        // Sanitize filename but keep extension
        const fileExt = file.name.split('.').pop()
        const fileName = `${req.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('deliverables')
                .upload(fileName, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('deliverables')
                .getPublicUrl(fileName)

            setUploadedUrl(publicUrl)
            setUploadedFileName(file.name)
            toast.success('File uploaded successfully!')

        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error('Error uploading file: ' + error.message)
        } finally {
            setUploading(false)
        }
    }, [req.id, supabase])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        disabled: uploading
    })

    const handleDecline = async () => {
        if (!confirm('Are you sure you want to decline this request? The client will be notified.')) return

        setIsDeclining(true)
        const result = await declineProject(req.id)
        if (result.error) {
            toast.error(result.error)
            setIsDeclining(false)
        } else {
            toast.success('Request declined and moved to Recent history.')
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this project? This cannot be undone.')) return

        setIsDeleting(true)
        const result = await deleteProject(req.id)
        if (result.error) {
            toast.error(result.error)
            setIsDeleting(false)
        } else {
            toast.success('Project deleted')
        }
    }

    if (!req) {
        console.error('[RequestCard] Rendered with null/undefined req');
        return null;
    }

    console.log('[RequestCard] Rendering with req:', req);

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-[#F0F9FF] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-8">
                {/* Left: Details */}
                <div className="flex-1">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0f0] mr-3 overflow-hidden">
                            {req.client?.avatar_url ? (
                                <img src={req.client.avatar_url} alt="Client" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-6 h-6 m-2 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-[#1E293B]">{req.client?.full_name || req.client?.username || 'Unknown Client'}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Client</p>
                        </div>
                        <div className="ml-auto md:hidden">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'requested' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                {req.status === 'revision_requested' ? 'revision req.' : req.status}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#0EA5E9] mb-1">{req.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-[#F0F9FF] text-[#0EA5E9] text-[10px] font-bold rounded-md uppercase tracking-wider">
                            {categories.find(c => c.slug === req.current_terms?.category)?.title || req.current_terms?.category || 'General'}
                        </span>
                        {req.current_terms?.tier && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                {req.current_terms.tier} Package
                            </span>
                        )}
                        {req.due_date && (
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1 border border-red-100">
                                <Clock className="w-2.5 h-2.5" />
                                Due {new Date(req.due_date).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <div
                        className="relative group cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className={`text-gray-600 mb-2 leading-relaxed border-l-2 border-[#F0F9FF] pl-4 break-words transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
                            <MarkdownRenderer content={req.description || ''} />
                        </div>
                        <div className="pl-4 mb-6">
                            <span className="text-xs font-bold text-[#0EA5E9] flex items-center hover:underline">
                                {isExpanded ? (
                                    <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
                                ) : (
                                    <>Read More <ChevronDown className="w-3 h-3 ml-1" /></>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        {req.file_urls && req.file_urls.length > 0 ? (
                            req.file_urls.map((url: string, idx: number) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-[#F0F9FF] px-4 py-2 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#EBE7DE] mr-2 mb-2 group transition-colors"
                                    title="Click to download"
                                >
                                    <Download className="w-4 h-4 mr-2 text-[#0EA5E9]" />
                                    Download File {idx + 1}
                                </a>
                            ))
                        ) : req.file_url ? (
                            <a
                                href={req.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-[#F0F9FF] px-4 py-2 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#EBE7DE] group transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2 text-[#0EA5E9]" />
                                Download Requirements
                            </a>
                        ) : null}
                    </div>
                </div>

                {/* Right: Action / Pricing */}
                <div className="w-full md:w-80 bg-[#F0F9FF] rounded-2xl p-6 flex flex-col justify-center">
                    {req.status === 'requested' || req.status === 'accepted' ? (
                        <>
                            <div className="flex items-center mb-4 text-[#0EA5E9]">
                                <Shield className="w-5 h-5 mr-3 text-[#0EA5E9]" />
                                <div className="flex flex-col">
                                    <span className="font-bold">
                                        {req.funds_status === 'unpaid' ? 'Awaiting Payment' : 'Secured & Starting'}
                                    </span>
                                    {req.due_date && (
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter -mt-0.5">
                                            Requested Due Date: {new Date(req.due_date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-[#F0F9FF] mb-4 text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Order Price</p>
                                <p className="text-3xl font-serif font-bold text-[#0EA5E9]">
                                    AED {req.current_price ? Number(req.current_price).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">
                                    {req.pricing_type} {req.current_terms?.tier ? `(${req.current_terms.tier})` : ''}
                                </p>
                                <EarningsBreakdown price={Number(req.current_price)} compact showLabel={false} />
                            </div>

                            <div className="space-y-3">
                                {req.funds_status === 'unpaid' && (
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-center">
                                        <p className="text-xs text-orange-700 font-bold flex items-center justify-center gap-2">
                                            <Zap className="w-3 h-3" />
                                            WAITING FOR PAYMENT
                                        </p>
                                        <p className="text-[10px] text-orange-600/70 mt-1 uppercase tracking-wider">Order moves to Active once paid</p>
                                    </div>
                                )}

                                {req.funds_status !== 'unpaid' && (req.status === 'requested' || req.status === 'accepted') && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const res = await startProject(req.id)
                                            if (res.error) {
                                                toast.error(res.error)
                                            } else {
                                                toast.success('Work started! Let\'s go.')
                                            }
                                        }}
                                        className="w-full bg-[#0EA5E9] text-white font-bold py-3 rounded-xl hover:bg-[#2D3828] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        Confirm & Start Project
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleDecline}
                                    disabled={isDeclining}
                                    className="w-full text-red-500 font-bold py-3 text-sm hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {isDeclining ? 'Declining...' : <><XCircle className="w-4 h-4" /> Decline Order</>}
                                </button>
                            </div>
                        </>
                    ) : ['negotiating', 'pending', 'countered'].includes(req.status) ? (
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">Order Price</p>
                            <p className="text-3xl font-bold text-[#0EA5E9] mb-4">
                                AED {req.current_price ? Number(req.current_price).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                            </p>
                            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold inline-block">
                                Waiting for Client Payment...
                            </div>
                        </div>
                    ) : ['accepted', 'agreed', 'in_progress', 'revision_requested'].includes(req.status) ? (
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">Agreed Price</p>
                            <p className="text-3xl font-bold text-[#0EA5E9] mb-4">
                                AED {req.current_price ? Number(req.current_price).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                            </p>

                            <div className={`px-4 py-2 rounded-xl text-sm font-bold inline-block mb-3 
                                ${req.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                    req.status === 'revision_requested' ? 'bg-orange-100 text-orange-700' :
                                        'bg-green-100 text-green-700'}`}>
                                {req.status === 'in_progress' ? 'Work in Progress' :
                                    req.status === 'revision_requested' ? 'Revision Requested' :
                                        'Active Project'}
                            </div>

                            {req.status === 'revision_requested' && req.revision_notes && (
                                <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl text-left">
                                    <p className="text-[10px] text-orange-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        Revision Notes from Client
                                    </p>
                                    <p className="text-xs text-orange-800 leading-relaxed italic">{req.revision_notes}</p>
                                </div>
                            )}

                            {['accepted', 'agreed', 'in_progress', 'revision_requested'].includes(req.status) && (
                                <p className="text-xs text-green-600 mb-4 font-bold flex items-center justify-center">
                                    <Shield className="w-3 h-3 mr-1" /> Payment Secured by Workly.day
                                </p>
                            )}

                            <form action={async (formData) => {
                                const res = await submitWork(null, formData)
                                if (res?.error) {
                                    toast.error(res.error)
                                } else {
                                    toast.success('Work submitted for review!')
                                    setUploadedUrl('')
                                    setUploadedFileName('')
                                }
                            }} className="text-left space-y-3 bg-white p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">
                                    {req.status === 'revision_requested' ? 'Submit Revised Work' : 'Submit Work'}
                                </p>
                                <input type="hidden" name="projectId" value={req.id} />

                                <div className="space-y-3 mb-2">
                                    {uploadedUrl ? (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center overflow-hidden">
                                                <FileIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                                <span className="text-xs text-green-700 font-medium truncate">{uploadedFileName}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadedUrl('')
                                                    setUploadedFileName('')
                                                }}
                                                className="text-green-500 hover:text-green-700 ml-2"
                                            >

                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                                            ${isDragActive ? 'border-[#0EA5E9] bg-gray-50' : 'border-gray-200 hover:border-[#0EA5E9] hover:bg-gray-50'}`}>
                                            <input {...getInputProps()} />
                                            {uploading ? (
                                                <div className="flex flex-col items-center justify-center py-2">
                                                    <Loader2 className="w-6 h-6 text-[#0EA5E9] animate-spin mb-2" />
                                                    <p className="text-xs text-gray-500">Uploading...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-2">
                                                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                                    <p className="text-xs text-gray-500 font-medium">Click to upload or drag & drop</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">Any file size / Video supported</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <input
                                        type="url"
                                        name="url"
                                        placeholder="Or paste an external link..."
                                        defaultValue={uploadedUrl}
                                        required={!uploadedUrl}
                                        className={`w-full pl-3 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none ${uploadedUrl ? 'hidden' : ''}`}
                                        key={uploadedUrl ? 'hidden-url' : 'visible-url'}
                                    />
                                    {uploadedUrl && <input type="hidden" name="url" value={uploadedUrl} />}
                                </div>

                                <textarea
                                    name="notes"
                                    placeholder="Add notes for the client..."
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#0EA5E9] outline-none h-20 resize-none"
                                ></textarea>
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    No phone numbers or emails allowed.
                                </p>

                                <button type="submit" className="w-full bg-[#0EA5E9] text-white font-bold py-2 rounded-lg text-sm hover:bg-[#2e3b29] transition-colors">
                                    Submit for Review
                                </button>
                            </form>
                        </div>
                    ) : ['completed', 'submitted'].includes(req.status) ? (
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">Agreed Price</p>
                            <p className="text-3xl font-bold text-[#0EA5E9] mb-4">
                                AED {req.current_price ? Number(req.current_price).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                            </p>
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold inline-block mb-4">
                                {req.status === 'completed' ? 'Project Completed' : 'Work Submitted'}
                            </div>

                            {req.status === 'submitted' ? (
                                <div className="mt-2 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm">
                                    <p className="font-bold mb-1">Work Submitted!</p>
                                    <p className="opacity-80">Waiting for client approval.</p>
                                </div>
                            ) : (
                                <p className="text-xs text-green-600 mt-4">This project is verified and complete.</p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center opacity-75">
                            <p className="text-sm text-gray-500 mb-2">Final Status</p>
                            <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold inline-block uppercase">
                                {req.status}
                            </div>
                            <p className="text-xs text-gray-400 mt-4 uppercase">
                                Closed {req.closed_at ? new Date(req.closed_at).toLocaleDateString() : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
