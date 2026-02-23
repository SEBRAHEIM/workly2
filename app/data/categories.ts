import { FileText, Monitor, Users, Grid, Code, User } from 'lucide-react'

// Helper to generate slug from title
export function generateSlug(title: string) {
    return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/,/g, '')
}

export type Category = {
    title: string
    slug: string
    desc: string
    fullDesc: string
    icon: any
    image: string
}

export const categories = [
    {
        icon: FileText,
        title: 'Strategy & Reports',
        slug: 'strategy-reports',
        desc: 'Bespoke business analysis, reports, and strategic documentation.',
        fullDesc: 'Strategic intelligence and high-stakes reporting for the modern enterprise.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Monitor,
        title: 'Visual Presentations',
        slug: 'visual-presentations',
        desc: 'High-impact slide decks, pitch templates, and visual storytelling.',
        fullDesc: 'World-class visual communication that captures boardroom attention.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        slug: 'team-collaboration',
        desc: 'Management for complex, multi-stakeholder initiatives.',
        fullDesc: 'Seamless coordination and delivery for large-scale corporate initiatives.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Grid,
        title: 'Data Analytics',
        slug: 'data-analytics',
        desc: 'Financial modeling, dashboards, and quantitative insights.',
        fullDesc: 'Deep-tier quantitative analysis and bespoke financial engineering.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Code,
        title: 'Tech Development',
        slug: 'tech-development',
        desc: 'Custom software solutions, automation, and infrastructure.',
        fullDesc: 'Cutting-edge software engineering and digital infrastructure development.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: User,
        title: 'Special Projects',
        slug: 'special-projects',
        desc: 'Tailored support for unique creative and strategic requirements.',
        fullDesc: 'Universal white-glove support for specialized creative and strategic needs.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'
    },
]
