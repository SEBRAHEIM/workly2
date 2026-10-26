import LegalPage, { type LegalSection } from '../components/legal/LegalPage'

export default function PrivacyPage() {
    const sections: LegalSection[] = [
        {
            title: "Information We Collect",
            content: "We collect minimal information necessary to operate the platform and ensure a high-quality experience for creators and clients.",
            bullets: [
                "Profile Data: Name, username, display name, and avatar.",
                "Contact Data: Email address for authentication and notifications.",
                "Privacy Note: We do NOT collect or store your phone number."
            ]
        },
        {
            title: "How We Use Data",
            content: "Your data is used specifically to facilitate the workspace and financial transactions.",
            bullets: [
                "Fulfillment: Enabling the workflow between creators and clients.",
                "Payments: Processing secure transactions via Stripe.",
                "Communications: Sending vital project-related alerts via email."
            ]
        },
        {
            title: "Data Sharing",
            content: "We believe in radical data privacy. We do not sell your personal information to third parties.",
            bullets: [
                "Workspace: Essential profile data is shared with the user you are working with.",
                "Partners: Data is shared with secure providers (Supabase, Stripe, Resend) to fulfill services.",
                "Compliance: Data may be shared if required by legal authorities."
            ]
        },
        {
            title: "Data Security",
            content: "Workly uses industry-standard encryption and security protocols to ensure your data and funds are protected at every layer.",
        },
        {
            title: "Your Rights",
            content: "You have full control over your data. You can update your profile information or delete your account at any time through our Support & Account settings.",
        }
    ]

    return <LegalPage kicker="Legal · Privacy" title="Privacy" accent="policy." intro="How we collect, use and protect your information at Workly." updated="October 2026" sections={sections} />
}
