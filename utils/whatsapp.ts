export async function sendWhatsAppNotification({
    to,
    studentName,
    projectTitle,
    tier,
    price,
    link
}: {
    to: string;
    studentName: string;
    projectTitle: string;
    tier: string;
    price: number;
    link: string;
}) {
    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.warn('WhatsApp API credentials missing. Skipping notification.');
        return;
    }

    // Normalize phone number (ensure no + or spaces)
    const cleanPhone = to.replace(/\D/g, '');

    try {
        const response = await fetch(
            `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: cleanPhone,
                    type: "template",
                    template: {
                        name: "new_hire_request", // Must match the template name in Meta Dashboard
                        language: {
                            code: "en_US"
                        },
                        components: [
                            {
                                type: "body",
                                parameters: [
                                    { type: "text", text: studentName },
                                    { type: "text", text: projectTitle },
                                    { type: "text", text: tier },
                                    { type: "text", text: price.toString() },
                                    { type: "text", text: link }
                                ]
                            }
                        ]
                    }
                }),
            }
        );

        const result = await response.json();
        if (!response.ok) {
            console.error('WhatsApp API Error:', result);
            return { success: false, error: result.error?.message || JSON.stringify(result) };
        }
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Failed to send WhatsApp notification:', error);
        return { success: false, error: error.message || 'Network error' };
    }
}

export async function sendWhatsAppTest(to: string) {
    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        return { success: false, error: 'WhatsApp API credentials missing in environment' };
    }

    const cleanPhone = to.replace(/\D/g, '');

    try {
        const response = await fetch(
            `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: cleanPhone,
                    type: "template",
                    template: {
                        name: "jaspers_market_plain_text_v1",
                        language: { code: "en_US" }
                    }
                }),
            }
        );

        const result = await response.json();
        if (!response.ok) {
            return { success: false, error: result.error?.message || JSON.stringify(result) };
        }
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || 'Network error' };
    }
}
