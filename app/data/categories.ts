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
}

export const categories = [
    {
        icon: FileText,
        title: 'Reports & Essays',
        slug: 'reports-essays',
        desc: 'Help with writing assignments and Word documents.',
        fullDesc: 'Turn rough rubrics and notes into clear, structured academic writing.',
    },
    {
        icon: Monitor,
        title: 'Presentations & PPT',
        slug: 'presentations-ppt',
        desc: 'Slides, templates, and class presentations.',
        fullDesc: 'Captivating slides and structured presentations that get your point across.',
    },
    {
        icon: Users,
        title: 'Group Projects',
        slug: 'group-projects',
        desc: 'Case studies and team assignments.',
        fullDesc: 'Coordinate and complete group assignments without the stress.',
    },
    {
        icon: Grid,
        title: 'Excel & Data',
        slug: 'excel-data',
        desc: 'Sheets, tables, dashboards, simple calculations.',
        fullDesc: 'Clean data, accurate formulas, and clear insights.',
    },
    {
        icon: Code,
        title: 'Programming & Tech',
        slug: 'programming-tech',
        desc: 'Basic coding tasks and small tech work.',
        fullDesc: 'Bug fixes, scripts, and small application development.',
    },
    {
        icon: User,
        title: 'Other Tasks',
        slug: 'other-tasks',
        desc: 'Anything else required for your course.',
        fullDesc: 'Any other academic or creative task you need support with.',
    },
]
