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
        title: 'Reports & Essays',
        slug: 'reports-essays',
        desc: 'Help with writing assignments and Word documents.',
        fullDesc: 'Precision academic writing from the world\'s top client talent.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Monitor,
        title: 'Presentations & PPT',
        slug: 'presentations-ppt',
        desc: 'Slides, templates, and class presentations.',
        fullDesc: 'Captivating visual storytelling that secures high-tier marks.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Users,
        title: 'Group Projects',
        slug: 'group-projects',
        desc: 'Case studies and team assignments.',
        fullDesc: 'Institutional collaboration handled with professional integrity.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Grid,
        title: 'Excel & Data',
        slug: 'excel-data',
        desc: 'Sheets, tables, dashboards, simple calculations.',
        fullDesc: 'Robust analytics and data modeling for complex requirements.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: Code,
        title: 'Programming & Tech',
        slug: 'programming-tech',
        desc: 'Basic coding tasks and small tech work.',
        fullDesc: 'Technical implementation across the modern stack.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
    },
    {
        icon: User,
        title: 'Other Tasks',
        slug: 'other-tasks',
        desc: 'Anything else required for your course.',
        fullDesc: 'Universal support for any unique academic or creative initiative.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'
    },
]
