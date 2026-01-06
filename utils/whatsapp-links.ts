/**
 * WhatsApp Direct Link Utility (Option A)
 * Generates wa.me links to bypass Meta API restrictions and costs.
 */

export function getWhatsAppHireLink({
    phone,
    studentName,
    projectTitle,
    projectId
}: {
    phone: string;
    studentName: string;
    projectTitle: string;
    projectId: string;
}) {
    const cleanPhone = phone.replace(/\D/g, '');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://workly.day';
    const link = `${baseUrl}/creator/requests`;

    const message = `Hi! I'm ${studentName}. I just hired you for "${projectTitle}" on Workly! 🚀\n\nView details and accept here: ${link}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppWorkSubmittedLink({
    phone,
    projectTitle,
    projectId
}: {
    phone: string;
    projectTitle: string;
    projectId: string;
}) {
    const cleanPhone = phone.replace(/\D/g, '');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://workly.day';
    const link = `${baseUrl}/student/projects/${projectId}`;

    const message = `High-five! 🙌 I've just submitted the work for "${projectTitle}" on Workly.\n\nYou can review it here: ${link}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
