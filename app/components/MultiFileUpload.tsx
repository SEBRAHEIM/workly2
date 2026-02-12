'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface MultiFileUploadProps {
    bucketName: string
    folderPath?: string
    onUploadComplete: (urls: string[]) => void
    existingFiles?: string[] // For editing scenarios if needed
    maxSizeMB?: number
    compact?: boolean
}

export default function MultiFileUpload({
    bucketName,
    folderPath = 'uploads',
    onUploadComplete,
    existingFiles = [],
    maxSizeMB = 50,
    compact = false
}: MultiFileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingFiles)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)

            // Validate size
            const invalidFiles = newFiles.filter(f => f.size > maxSizeMB * 1024 * 1024)
            if (invalidFiles.length > 0) {
                setError(`Some files exceed the ${maxSizeMB}MB limit.`)
                return
            }

            setError(null)
            const updatedFiles = [...files, ...newFiles]
            setFiles(updatedFiles)

            // Auto-upload immediately or wait? 
            // Let's auto-upload to streamline UX, or wait for manual trigger?
            // "Wait for submit" is safer for "undo", but "Auto" is better for large files so user doesn't wait at end.
            // Decision: Trigger upload immediately upon selection to ensure URLs are ready for form submit.
            uploadFiles(updatedFiles)
        }
    }

    const uploadFiles = async (filesToUpload: File[]) => {
        setUploading(true)
        setProgress(0)
        setError(null)
        const supabase = createClient()
        const newUrls: string[] = []

        try {
            // Upload current batch (naive implementation: uploads all, ideally only new ones)
            // Optimization: Only upload new files that aren't already processed.
            // Real-world: Track status per file. For MVP: Upload everything new.

            // Actually, let's just upload the *newly added* files since 'files' state tracks them.
            // But we need to make sure we don't re-upload.
            // Simplified: Upload file immediately when added.

            let completedCount = 0
            const total = filesToUpload.length

            for (const file of filesToUpload) {
                // Skip if already uploaded? (Need robust tracking, skipping for now to keep it simple/robust)
                // We will generate a unique path
                const fileExt = file.name.split('.').pop()
                const fileName = `${folderPath}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (error) throw error

                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(fileName)

                newUrls.push(publicUrl)
                completedCount++
                setProgress(Math.round((completedCount / total) * 100))
            }

            // Combine with existing
            const finalUrls = [...uploadedUrls, ...newUrls]
            setUploadedUrls(finalUrls)
            onUploadComplete(finalUrls) // Notify parent
            setFiles([]) // Clear pending files queue

        } catch (err: any) {
            console.error('Upload failed:', err)
            setError('Failed to upload files. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const removeUrl = (indexToRemove: number) => {
        const updatedUrls = uploadedUrls.filter((_, index) => index !== indexToRemove)
        setUploadedUrls(updatedUrls)
        onUploadComplete(updatedUrls)
    }

    return (
        <div className="space-y-4">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {/* File List (Uploaded) */}
            {uploadedUrls.length > 0 && (
                <div className="space-y-2">
                    {uploadedUrls.map((url, index) => (
                        <div key={index} className={`flex items-center justify-between bg-[#F0F9FF] border border-[#F0F9FF] ${compact ? 'px-2 py-1.5 rounded-lg' : 'px-4 py-3 rounded-xl'}`}>
                            <div className="flex items-center overflow-hidden">
                                <div className={`${compact ? 'w-5 h-5 mr-2' : 'w-8 h-8 mr-3'} bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <CheckCircle className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
                                </div>
                                <a href={url} target="_blank" rel="noopener noreferrer" className={`font-bold text-[#1E293B] truncate pr-2 hover:underline ${compact ? 'text-[10px]' : ''}`}>
                                    File {index + 1}
                                </a>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeUrl(index)}
                                className={`${compact ? 'p-1' : 'p-2'} hover:bg-black/5 rounded-full text-gray-400 hover:text-red-500 transition-colors`}
                            >
                                <X className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Uploading State */}
            {uploading && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        <span className="font-bold">Uploading... {progress}%</span>
                    </div>
                </div>
            )}

            {!uploading && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-[#F0F9FF] hover:border-[#0EA5E9] hover:bg-[#F0F9FF] text-center transition-all cursor-pointer group ${compact ? 'p-3 rounded-xl' : 'p-6 rounded-2xl'}`}
                >
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <div className={`${compact ? 'w-8 h-8 mb-1.5' : 'w-12 h-12 mb-3'} bg-[#F0F9FF] rounded-xl flex items-center justify-center mx-auto group-hover:bg-white text-[#0EA5E9] transition-colors`}>
                        <Upload className={compact ? 'w-4 h-4' : 'w-6 h-6'} />
                    </div>
                    <p className={`font-bold text-[#1E293B] ${compact ? 'text-[10px] mb-0' : 'mb-1'}`}>
                        {compact ? 'Upload Files' : 'Click to upload files'}
                    </p>
                    {!compact && <p className="text-xs text-gray-400">Up to {maxSizeMB}MB per file</p>}
                </div>
            )}
        </div>
    )
}
