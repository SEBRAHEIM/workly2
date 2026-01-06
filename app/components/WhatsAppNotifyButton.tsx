'use client'

import { MessageSquare } from 'lucide-react'
import { getWhatsAppHireLink, getWhatsAppWorkSubmittedLink } from '@/utils/whatsapp-links'

interface WhatsAppNotifyButtonProps {
    type: 'hire' | 'work_submitted'
    data: {
        phone: string
        studentName?: string
        projectTitle: string
        projectId: string
    }
    label?: string
    className?: string
}

export default function WhatsAppNotifyButton({ type, data, label, className }: WhatsAppNotifyButtonProps) {
    const handleNotify = () => {
        let url = ''
        if (type === 'hire') {
            url = getWhatsAppHireLink({
                phone: data.phone,
                studentName: data.studentName || 'A Student',
                projectTitle: data.projectTitle,
                projectId: data.projectId
            })
        } else if (type === 'work_submitted') {
            url = getWhatsAppWorkSubmittedLink({
                phone: data.phone,
                projectTitle: data.projectTitle,
                projectId: data.projectId
            })
        }

        if (url) {
            window.open(url, '_blank')
        }
    }

    return (
        <button
            onClick={handleNotify}
            className={`flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl ${className}`}
        >
            <MessageSquare className="w-5 h-5 fill-white" />
            {label || (type === 'hire' ? 'Notify Creator on WhatsApp' : 'Notify Student on WhatsApp')}
        </button>
    )
}
