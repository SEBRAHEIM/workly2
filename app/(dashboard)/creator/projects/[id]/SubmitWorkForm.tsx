'use client'

import { submitWork } from '../actions'
import { useState, useActionState } from 'react'
import MultiFileUpload from '@/app/components/MultiFileUpload'
import { Check, AlertTriangle } from 'lucide-react'
import WhatsAppNotifyButton from '@/app/components/WhatsAppNotifyButton'

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#3E4C37] text-white font-bold py-3 rounded-xl hover:bg-[#2e3b29] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? 'Submitting...' : 'Submit for Review'}
        </button>
    )
}

const initialState = {
    error: '',
    success: false
}

export default function SubmitWorkForm({
    projectId,
    projectTitle,
    studentPhone,
    studentName
}: {
    projectId: string;
    projectTitle: string;
    studentPhone?: string | null;
    studentName?: string | null;
}) {
    const [state, formAction, isPending] = useActionState(submitWork, initialState)
    const [files, setFiles] = useState<string[]>([])

    if (state?.success) {
        return (
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-600" />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Work Submitted!</h3>
                    <p className="text-sm text-gray-500">Your files have been uploaded for review.</p>
                </div>

                <div className="space-y-4">
                    {((state as any).studentPhone || studentPhone) && (
                        <>
                            <p className="text-xs font-bold text-[#3E4C37] uppercase tracking-widest">Get feedback faster:</p>
                            <WhatsAppNotifyButton
                                type="work_submitted"
                                data={{
                                    phone: (state as any).studentPhone || studentPhone,
                                    projectTitle: (state as any).projectTitle || projectTitle,
                                    projectId: (state as any).projectId || projectId
                                }}
                                label="Notify Student on WhatsApp"
                                className="w-full"
                            />
                        </>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="text-gray-400 text-xs hover:underline"
                    >
                        Done
                    </button>
                </div>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="studentPhone" value={studentPhone || ''} />
            <input type="hidden" name="studentName" value={studentName || ''} />
            <input type="hidden" name="projectTitle" value={projectTitle || ''} />
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {state.error}
                </div>
            )}

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-700 mb-2">Upload Files for: {projectTitle}</p>
                <MultiFileUpload
                    bucketName="project-files"
                    folderPath={`submissions/${projectId}`}
                    onUploadComplete={(urls) => setFiles(urls)}
                    maxSizeMB={50}
                />
                {/* Hidden inputs to pass URLs to Server Action */}
                {files.map((url, index) => (
                    <input key={index} type="hidden" name="submissionFileUrls" value={url} />
                ))}
            </div>

            <SubmitButton isPending={isPending} />
        </form>
    )
}
