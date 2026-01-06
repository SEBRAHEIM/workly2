import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import StudentIdentityForm from './StudentIdentityForm'
import { ShieldCheck } from 'lucide-react'

export default async function StudentProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-32">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#333333] mb-2">Profile Settings</h1>
                <p className="text-gray-500">Manage your notification preferences and identity.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-[#E6E2D6] shadow-xl">
                <div className="mb-6 pb-6 border-b border-[#E6E2D6]">
                    <h3 className="text-xl font-bold text-[#333333] mb-2">Notification Settings</h3>
                    <p className="text-gray-500 text-sm">
                        SMS alerts help you stay updated while you're away from your computer.
                    </p>
                </div>

                <StudentIdentityForm profile={profile} />
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 mx-auto mb-2" />
                <p>Your data is stored securely and never shared with creators.</p>
            </div>
        </div>
    )
}
