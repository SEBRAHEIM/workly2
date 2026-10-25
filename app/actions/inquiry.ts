'use server'

import { sendEmail } from '@/utils/send-email'

type InquiryState = { success?: boolean; error?: string } | null

const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
    // Honeypot: real visitors never see or fill this field
    if (formData.get('company_site')) return { success: true }

    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const projectType = String(formData.get('project_type') || '').trim()
    const budget = String(formData.get('budget') || '').trim()
    const message = String(formData.get('message') || '').trim()

    if (name.length < 2) return { error: 'Please tell us your name.' }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email so we can reply.' }
    if (message.length < 10) return { error: 'Please describe your project in a few more words.' }
    if (message.length > 5000) return { error: 'Please keep the description under 5000 characters.' }

    try {
        await sendEmail({
            to: 'workly.day@outlook.com',
            subject: `[Project Inquiry] ${projectType || 'New project'} from ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #151515;">
                    <h2>New project inquiry</h2>
                    <p><strong>Name:</strong> ${escape(name)}</p>
                    <p><strong>Email:</strong> ${escape(email)}</p>
                    <p><strong>Project type:</strong> ${escape(projectType || 'Not specified')}</p>
                    <p><strong>Budget:</strong> ${escape(budget || 'Not specified')}</p>
                    <div style="background: #f4f4f0; padding: 15px; border-radius: 12px; margin-top: 10px;">
                        ${escape(message).replace(/\n/g, '<br/>')}
                    </div>
                </div>
            `,
        })
    } catch (err) {
        console.error('Failed to send project inquiry:', err)
        return { error: 'We could not send your request. Please try again in a moment.' }
    }

    return { success: true }
}
