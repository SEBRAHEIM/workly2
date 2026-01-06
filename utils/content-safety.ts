
export const CONTACT_PATTERNS = {
    // Standard tests
    email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)|(\b[a-zA-Z0-9._-]+\s*(at|@)\s*[a-zA-Z0-9._-]+\s*(dot|\.)\s*(com|net|org|edu)\b)/i,
    phone: /(\+?971|0)?5[0-9](\s|-|\.)?[0-9]{3}(\s|-|\.)?[0-9]{4}/,

    // Aggressive normalization checks
    // We will strip common separators and check against these
    normalizedPhone: /(?:971|0)?5\d{8}/, // Matches 0501234567 after stripping
    normalizedEmailDomains: /@?(gmail|outlook|yahoo|hotmail|icloud|protonmail)(com|net|org)/i
}

export function containsContactInfo(text: string): { hasContactInfo: boolean; reason?: string } {
    if (!text) return { hasContactInfo: false }

    const normalized = text.toLowerCase().replace(/[\s._\-,]/g, '');

    // 1. Standard Checks (Original text)
    if (CONTACT_PATTERNS.email.test(text)) return { hasContactInfo: true, reason: 'Email addresses are not allowed.' }
    if (CONTACT_PATTERNS.phone.test(text)) return { hasContactInfo: true, reason: 'Phone numbers are not allowed.' }

    // 2. Aggressive Checks (Normalized text)
    // Check for "0 5 0 . 1 2 3" -> "050123"
    // We look for 10+ digits in the normalized string? No, standard UAE number is 10 digits (05x xxx xxxx)
    // Let's check for digit sequences in normalized string
    // But be careful of "Page 10, Question 5", normalized "page10question5" - no issue.
    // "My number is 0 5 0..." -> "mynumberis050..."

    // Extract digit only string
    const digitsOnly = text.replace(/\D/g, '');
    if (/(?:971|0)?5\d{8}/.test(digitsOnly)) {
        return { hasContactInfo: true, reason: 'Phone numbers (even hidden ones) are not allowed.' }
    }

    // Check for email domains in normalized text
    // "example @ gmail . com" -> "example@gmailcom"
    if (CONTACT_PATTERNS.normalizedEmailDomains.test(normalized)) {
        return { hasContactInfo: true, reason: 'Email addresses are not allowed.' }
    }

    // 3. User specific "s.a.l.m.a @..." case
    // If we see an "@" in the normalized text that isn't surrounded by legitimate text boundaries?
    // Actually our normalized domain check catches "outlookcom"

    return { hasContactInfo: false }
}
