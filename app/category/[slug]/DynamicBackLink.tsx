import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function DynamicBackLink() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let backLink = '/'
    let backText = 'Back to Home'

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'creator') {
            backLink = '/creator'
            backText = 'Back to Dashboard'
        } else {
            backLink = '/student'
            backText = 'Back to Dashboard'
        }
    }

    return (
        <Link
            href={backLink}
            prefetch={true}
            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors touch-manipulation"
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backText}
        </Link>
    )
}
