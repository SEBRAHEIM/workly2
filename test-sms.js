
const fs = require('fs')
const path = require('path')

const envPath = path.resolve(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const env = {}
envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
        let value = match[2] || ''
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
        env[match[1]] = value
    }
})

const apiKey = env.VONAGE_API_KEY || 'cf73a1d8';
const apiSecret = env.VONAGE_API_SECRET || 'k4IWr3B59VkzlUNd';
const fromName = env.VONAGE_FROM || 'Workly';

console.log('Vonage API Key Source:', env.VONAGE_API_KEY ? 'ENV' : 'DEFAULT');
console.log('Vonage Secret Source:', env.VONAGE_API_SECRET ? 'ENV' : 'DEFAULT');

async function sendSMS({ to, body }) {
    const cleanPhone = to.replace(/\D/g, '');
    console.log(`[VONAGE SMS] Sending to ${cleanPhone}...`);

    try {
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
        console.log('Result:', JSON.stringify(result, null, 2));

        if (result.messages[0].status !== '0') {
            console.error('[VONAGE API Error]:', result.messages[0]['error-text']);
        } else {
            console.log(`[VONAGE SMS Success] Message ID: ${result.messages[0]['message-id']}`);
        }
    } catch (error) {
        console.error('[VONAGE Network Error]:', error);
    }
}

// Test with the phone number found in DB
sendSMS({
    to: '+971569959666',
    body: 'Test SMS from Workly Debug Script'
})
