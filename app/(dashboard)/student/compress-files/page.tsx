import FileCompressor from '@/app/components/FileCompressor'

export default function CompressFiles() {
    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#333333] mb-2">Secure File Compression</h1>
            <p className="text-gray-500 mb-8">Reduce file size using safe, lossless compression. Your files are never stored.</p>

            <FileCompressor />
        </div>
    )
}
