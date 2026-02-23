// Vonage (formerly Nexmo) SMS Provider Integration
export interface MessageParams {
    to: string;
    body: string;
}

/**
 * Generic function to send an SMS message via Vonage API.
 */
export async function sendSMS({
    to,
    body
}: MessageParams) {
    const apiKey = process.env.VONAGE_API_KEY || 'cf73a1d8';
    const apiSecret = process.env.VONAGE_API_SECRET || 'k4IWr3B59VkzlUNd';
    const fromName = process.env.VONAGE_FROM || 'Workly';

    if (!apiKey || !apiSecret) {
        console.warn('[VONAGE SMS] Credentials missing. Skipping notification.');
        return { success: false, error: 'Credentials missing' };
    }

    try {
        // Normalize phone number (Vonage expects digits only, including country code)
        const cleanPhone = to.replace(/\D/g, '');

        console.log(`[VONAGE SMS] Sending to ${cleanPhone}...`);

        const response = await fetch('https://rest.nexmo.com/sms/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                api_key: apiKey,
                api_secret: apiSecret,
                from: fromName,
                to: cleanPhone,
                text: body,
            }).toString(),
        });

        const result = await response.json();

        if (result.messages[0].status !== '0') {
            console.error('[VONAGE API Error]:', result.messages[0]['error-text']);
            return { success: false, error: result.messages[0]['error-text'] };
        }

        console.log(`[VONAGE SMS Success] Message ID: ${result.messages[0]['message-id']}`);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('[VONAGE Network Error]:', error);
        return { success: false, error: error.message || 'Network error' };
    }
}

/**
 * Specifically for notifying creators when a client hires them.
 */
export async function notifyCreatorOfNewHire({
    to,
    clientName,
    projectTitle,
    tier,
    price,
    link
}: {
    to: string;
    clientName: string;
    projectTitle: string;
    tier: string;
    price: number | string;
    link: string;
}) {
    console.log(`[SMS DEBUG] Notifying creator ${to} of new hire request...`);

    // SMS limit is 160 characters. Keeping it concise.
    const body = `Workly: ${clientName} hired you for "${projectTitle}" (${tier}). Budget: AED ${price}. View: ${link}`;

    return sendSMS({ to, body });
}

/**
 * Specifically for notifying clients when a creator submits work.
 */
export async function notifyClientOfWorkSubmitted({
    to,
    creatorName,
    projectTitle,
    link
}: {
    to: string;
    creatorName: string;
    projectTitle: string;
    link: string;
}) {
    console.log(`[SMS DEBUG] Notifying client ${to} of work submission...`);
    const body = `Workly: ${creatorName} submitted work for "${projectTitle}". Review: ${link}`;

    return sendSMS({ to, body });
}
