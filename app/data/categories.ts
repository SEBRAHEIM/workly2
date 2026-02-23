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
        title: 'Editorial & Research',
        slug: 'editorial-research',
        desc: 'Advanced academic and professional writing, analysis and research.',
        fullDesc: 'Expert-led research and critical writing for high-tier academic and professional standards.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Monitor,
        title: 'Presentation Design',
        slug: 'presentation-design',
        desc: 'High-end slide decks, pitch templates, and visual storytelling.',
        fullDesc: 'Boutique-quality visual communication that transforms complex ideas into narratives.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Users,
        title: 'Network Management',
        slug: 'network-management',
        desc: 'Coordination for complex, multi-stakeholder and group projects.',
        fullDesc: 'Sophisticated project management and collective coordination for large-scale tasks.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Grid,
        title: 'Data Intelligence',
        slug: 'data-intelligence',
        desc: 'Financial modeling, quantitative analytics and dashboards.',
        fullDesc: 'Deep-tier quantitative insights and custom financial modeling.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Code,
        title: 'Product & Tech',
        slug: 'product-tech',
        desc: 'Custom software development, automation, and tech architecture.',
        fullDesc: 'Technical implementation across the modern stack for complex requirements.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: User,
        title: 'Bespoke Services',
        slug: 'bespoke-services',
        desc: 'Tailored support for unique creative and strategic initiatives.',
        fullDesc: 'Universal white-glove support for specialized boutique requirements.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'
    },
]
