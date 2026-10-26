import LegalPage, { type LegalSection } from '../components/legal/LegalPage'

export default function TermsPage() {
    const sections: LegalSection[] = [
        {
            title: "The Marketplace",
            content: "Workly is a creative studio marketplace that connects student creators with clients. Workly provides the infrastructure for project management, escrow, and payments but is not a party to the creative contracts between users.",
        },
        {
            title: "Escrow and Payments",
            content: "To protect both creators and clients, Workly utilizes an escrow system. Payments are held securely and released only upon client approval or auto-release conditions.",
            bullets: [
                "Fees: Workly charges a standard commission of 20% on the total contract value.",
                "Release: Funds are released to the creator upon client approval of the final deliverable.",
                "Auto-Release: If a client takes no action for 3 days after submission, funds are auto-released.",
                "Late Delivery Policy: If a creator fails to provide the first submission by the agreed deadline, the client is entitled to a 100% refund of the escrowed funds upon request."
            ]
        },
        {
            title: "User Conduct and Safety",
            content: "The security of our community is paramount. We maintain a zero-tolerance policy for off-platform communication or payments.",
            bullets: [
                "Contact Info: Sharing personal contact information (email, phone, handles) is strictly prohibited.",
                "Consequences: Violation of safety policies leads to permanent account suspension.",
                "Prohibited Content: Illegal, defamatory, or IP-violating content is banned."
            ]
        },
        {
            title: "Intellectual Property",
            content: "Upon full release of payment, the intellectual property rights of the deliverable are transferred from the creator to the client, unless otherwise agreed upon in the project brief.",
        },
        {
            title: "Dispute Resolution",
            content: "In the event of a disagreement, users may 'Report an Issue.' Workly's moderation team will review the project history to reach a final, fair decision.",
        }
    ]

    return <LegalPage kicker="Legal · Terms" title="Terms of" accent="service." intro="The terms that apply when you use Workly." updated="October 2026" sections={sections} />
}
