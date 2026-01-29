'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, File as FileIcon, Download, X, Info, Zap, Archive } from 'lucide-react'
import { toast } from 'sonner'
import JSZip from 'jszip'
import imageCompression from 'browser-image-compression'
import { saveAs } from 'file-saver'

type FileStatus = 'idle' | 'compressing' | 'done' | 'error'
type CompressionMode = 'smart' | 'archive'

interface CompressedFile {
    original: File
    compressedBlob?: Blob
    status: FileStatus
    progress: number // 0-100
    savedBytes?: number
}

export default function FileCompressor() {
    const [fileState, setFileState] = useState<CompressedFile | null>(null)
    const [showInfo, setShowInfo] = useState(false)
    const [mode, setMode] = useState<CompressionMode>('smart')

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 50,
            useWebWorker: true,
            initialQuality: 0.75, // Good balance
            onProgress: (p: number) => {
                setFileState(prev => prev ? { ...prev, progress: p } : null)
            }
        }
        return await imageCompression(file, options)
    }

    const compressPPTX = async (file: File) => {
        const zip = new JSZip()
        const content = await zip.loadAsync(file)

        // Find images in ppt/media/
        const mediaFiles = Object.keys(content.files).filter(path =>
            path.startsWith('ppt/media/') &&
            (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg'))
        )

        let processed = 0
        const total = mediaFiles.length

        if (total === 0) return file // No images to optimize

        for (const path of mediaFiles) {
            const imgData = await content.files[path].async('blob')
            const imgFile = new File([imgData], path.split('/').pop() || 'image', { type: imgData.type })

            try {
                // Optimize image
                const compressedImg = await imageCompression(imgFile, {
                    maxSizeMB: 50,
                    useWebWorker: true,
                    initialQuality: 0.75
                })
                zip.file(path, compressedImg)
            } catch (e) {
                console.warn('Failed to compress image inside PPTX:', path)
            }

            processed++
            setFileState(prev => prev ? { ...prev, progress: Math.round((processed / total) * 90) } : null)
        }

        // Repack as actual PPTX (not zip extension)
        return await zip.generateAsync({ type: 'blob' } as any) as Blob
    }

    const archiveFile = async (file: File) => {
        const zip = new JSZip()
        zip.file(file.name, file, {
            compression: "DEFLATE",
            compressionOptions: { level: 9 }
        })
        return await zip.generateAsync({
            type: 'blob',
            streamFiles: true,
            onUpdate: (metadata: any) => {
                setFileState(prev => prev ? { ...prev, progress: metadata.percent } : null)
            }
        } as any) as Blob
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setFileState({
            original: file,
            status: 'compressing',
            progress: 0
        })

        try {
            let resultBlob: Blob | File = file

            if (mode === 'smart') {
                if (file.type.startsWith('image/')) {
                    resultBlob = await compressImage(file)
                } else if (file.name.endsWith('.pptx') || file.type.includes('presentation')) {
                    resultBlob = await compressPPTX(file)
                } else {
                    // Fallback to archive if smart not supported
                    resultBlob = await archiveFile(file)
                    // If fell back, toast nice info
                    toast.info('Smart optimization not supported for this file type. Zipping instead.')
                }
            } else {
                resultBlob = await archiveFile(file)
            }

            setFileState({
                original: file,
                compressedBlob: resultBlob,
                status: 'done',
                progress: 100,
                savedBytes: file.size - resultBlob.size
            })
            toast.success('Optimization complete!')

        } catch (error) {
            console.error('Compression failed', error)
            toast.error('Compression failed')
            setFileState(prev => prev ? { ...prev, status: 'error' } : null)
        }
    }, [mode])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1
    })

    const handleDownload = () => {
        if (fileState?.compressedBlob) {
            let name = fileState.original.name
            if (mode === 'archive' && !name.endsWith('.zip')) {
                name = `${name}.zip`
            }
            // If smart PPTX, keep .pptx extension
            if (mode === 'smart' && name.endsWith('.pptx')) {
                // name stays .pptx
            }
            saveAs(fileState.compressedBlob, `optimized_${name}`)
        }
    }

    const reset = () => {
        setFileState(null)
    }

    const formatSize = (bytes: number) => {
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        if (bytes === 0) return '0 B'
        const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="w-full space-y-8">
            <div className="flex justify-center gap-4 mb-4">
                <button
                    onClick={() => setMode('smart')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${mode === 'smart' ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-md' : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
                >
                    <Zap className="w-4 h-4" />
                    <span className="font-bold text-sm">Smart Optimize</span>
                </button>
                <button
                    onClick={() => setMode('archive')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${mode === 'archive' ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-md' : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
                >
                    <Archive className="w-4 h-4" />
                    <span className="font-bold text-sm">Secure ZIP</span>
                </button>
            </div>

            <div className="w-full">
                {!fileState ? (
                    <div
                        {...getRootProps()}
                        className={`bg-white rounded-2xl p-6 md:p-8 border-2 border-dashed ${isDragActive ? 'border-[#0EA5E9] bg-green-50' : 'border-[#F0F9FF]'} shadow-sm text-center cursor-pointer transition-all hover:border-[#0EA5E9] group`}
                    >
                        <input {...getInputProps()} />
                        <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center mx-auto mb-4 text-[#0EA5E9] group-hover:scale-110 transition-transform">
                            {mode === 'smart' ? <Zap className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                        </div>
                        <h2 className="text-xl font-bold text-[#1E293B] mb-2">
                            {mode === 'smart' ? 'Optimize File Size' : 'Archive to ZIP'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
                            {mode === 'smart'
                                ? <span>Reduces size of <strong className="text-[#0EA5E9]">PPTX & Images</strong> by optimizing internal media.</span>
                                : <span>Creates a secure compressed ZIP archive. Works for <strong className="text-[#0EA5E9]">any file type</strong>.</span>
                            }
                        </p>
                        <button className="bg-[#1E293B] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0EA5E9] transition-colors shadow-sm active:scale-95">
                            Select File
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-6 border border-[#F0F9FF] shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F0F9FF] rounded-lg flex items-center justify-center text-[#0EA5E9]">
                                    <FileIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1E293B] text-sm line-clamp-1">{fileState.original.name}</h3>
                                    <p className="text-xs text-gray-400">{formatSize(fileState.original.size)}</p>
                                </div>
                            </div>
                            <button onClick={reset} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {fileState.status === 'compressing' && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-[#0EA5E9]">Optimizing...</span>
                                    <span className="text-gray-400">{fileState.progress.toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-[#F0F9FF] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0EA5E9] transition-all duration-300 ease-out"
                                        style={{ width: `${fileState.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {fileState.status === 'done' && (
                            <div className="text-center">
                                <div className={`rounded-lg px-4 py-3 mb-4 inline-block transform transition-all ${((fileState.savedBytes || 0) > 0) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                                    {((fileState.savedBytes || 0) > 0) ? (
                                        <>
                                            <p className="font-bold text-base">Saved {formatSize(fileState.savedBytes || 0)}!</p>
                                            <p className="text-xs opacity-75">New size: {formatSize(fileState.compressedBlob?.size || 0)}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-base">Archived Successfully</p>
                                            <p className="text-xs opacity-75">File was already optimized.</p>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-[#1E293B] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0EA5E9] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                >
                                    <Download className="w-4 h-4" /> Download {mode === 'archive' ? 'ZIP' : 'File'}
                                </button>
                            </div>
                        )}

                        {fileState.status === 'error' && (
                            <div className="text-center text-red-500 py-2">
                                <p className="font-bold text-sm">Optimization Failed</p>
                                <button onClick={reset} className="text-xs underline mt-1">Try Again</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-[#F9F7F2] rounded-2xl p-6 border border-[#F0F9FF]">
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="flex items-center gap-2 w-full text-left"
                >
                    <Info className="w-5 h-5 text-[#0EA5E9]" />
                    <span className="font-bold text-[#1E293B]">Mode Comparison</span>
                </button>

                <div className={`mt-4 space-y-4 text-sm text-gray-600 leading-relaxed ${showInfo ? 'block' : 'hidden md:block'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-[#F0F9FF]">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-[#0EA5E9]" />
                                <strong className="text-[#333]">Smart Optimize</strong>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Best for: PPTX, Images</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                <li>Significantly reduces size</li>
                                <li>Optimizes images inside presentation</li>
                                <li>Keeps text/formatting exact</li>
                            </ul>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#F0F9FF]">
                            <div className="flex items-center gap-2 mb-2">
                                <Archive className="w-4 h-4 text-[#0EA5E9]" />
                                <strong className="text-[#333]">Secure ZIP</strong>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Best for: PDF, Docs, Code</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                <li>Creates a ZIP archive</li>
                                <li>100% Bit-for-bit identical</li>
                                <li>Standard compression</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
