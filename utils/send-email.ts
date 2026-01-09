import type { Resend as ResendType } from 'resend';

let resendInstance: ResendType | null = null;

const getResend = async () => {
    if (!resendInstance) {
        const { Resend } = await import('resend');
        resendInstance = new Resend(process.env.RESEND_API_KEY || 're_123');
    }
    return resendInstance;
};

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    if (!process.env.RESEND_API_KEY) {
        console.log('RESEND_API_KEY not found. Simulating email send:', { to, subject });
        return { success: true, simulated: true };
    }

    try {
        const resend = await getResend();
        const data = await resend.emails.send({
            from: 'Workly <notifications@workly.day>',
            to: [to],
            subject: subject,
            html: html,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
