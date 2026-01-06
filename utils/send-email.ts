import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        const data = await resend.emails.send({
            from: 'Workly <notifications@workly.day>', // Ensure verified domain or use onboarding@resend.dev/user's email for testing
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
