
export const CONTACT_PATTERNS = {
    // Improved email regex to catch obfuscated ones like email (at) domain (dot) com
    email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)|(\b[a-zA-Z0-9._-]+\s*(at|@|\[at\])\s*[a-zA-Z0-9._-]+\s*(dot|\.|\[dot\])\s*[a-zA-Z]{2,}\b)/i,

    // Catch sequences of digits that look like phone numbers
    // 6 or more digits is usually enough to catch almost all phone numbers globally 
    // without too many false positives for things like dates (though 2024 is only 4).
    digits: /\d{6,}/,
}

export function containsContactInfo(text: string): { hasContactInfo: boolean; reason?: string } {
    if (!text) return { hasContactInfo: false }

    // 1. Check for Emails
    if (CONTACT_PATTERNS.email.test(text)) {
        return { hasContactInfo: true, reason: 'Email addresses are not allowed.' }
    }

    // 2. Normalize and check for digit sequences
    // We strip everything except digits to catch "0 5 0 - 1 2 3 - 4 5 6 7"
    const digitsOnly = text.replace(/\D/g, '');

    // If we have 6 or more digits in total, it's likely a phone number or ID
    if (digitsOnly.length >= 6) {
        return { hasContactInfo: true, reason: 'Phone numbers or long sequences of numbers are not allowed for safety.' }
    }

    // 3. Check for keywords that suggest off-platform communication
    const offPlatformKeywords = ['whatsapp', 'telegram', 'insta', 'phone', 'number', 'call me', 'contact', 'email'];
    const lowerText = text.toLowerCase();
    for (const kw of offPlatformKeywords) {
        if (lowerText.includes(kw)) {
            // We don't necessarily want to block just the WORD "phone", but if it's near numbers...
            // But for now, let's keep it simple as requested.
        }
    }

    return { hasContactInfo: false }
}
