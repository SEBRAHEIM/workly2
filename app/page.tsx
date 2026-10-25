import Header from './components/landing/Header'
import Hero from './components/landing/Hero'
import { createClient } from '@/utils/supabase/server'

async function getAccountHref() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = data?.role || 'client'
    return role === 'admin' ? '/hq' : role === 'creator' ? '/creator' : '/client'
  } catch {
    return null
  }
}

export default async function Home() {
  const accountHref = await getAccountHref()

  return (
    <main className="landing min-h-screen bg-white pb-6 font-[family-name:var(--font-inter)] font-normal text-[#151515]">
      <Header accountHref={accountHref} />
      <Hero />
    </main>
  )
}
