import Header from './components/landing/Header'
import { Cinematic, Digital } from './components/landing/Exhibit1'
import { Editorial, DotTransition, Studio } from './components/landing/Exhibit2'
import { Gallery, Collage, YellowTransition } from './components/landing/Exhibit3'
import { Contact, Footer } from './components/landing/Contact'
import { landingFonts } from './components/landing/fonts'
import { createClient } from '@/utils/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workly | Custom Websites, Online Stores & Web Apps',
  description: 'Workly designs and builds custom websites, e-commerce stores, booking systems and web applications for businesses of every kind. Tell us what you need and we build it for you.',
  metadataBase: new URL('https://workly.day'),
  openGraph: {
    title: 'Workly | Your idea deserves a website',
    description: 'One studio, endless possibilities. Custom websites, online stores, booking systems and web apps, designed and built by Workly.',
    url: 'https://workly.day',
    siteName: 'Workly',
    type: 'website',
  },
}

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

// The homepage is an exhibition: seven design worlds joined by scroll-driven transitions
export default async function Home() {
  const accountHref = await getAccountHref()

  return (
    <main className={`landing ${landingFonts} min-h-screen overflow-x-clip bg-white font-[family-name:var(--font-inter)] font-normal text-[#0d0d0d]`}>
      <Header accountHref={accountHref} />
      <Cinematic />
      <Digital />
      <Editorial />
      <DotTransition />
      <Studio />
      <Gallery />
      <Collage />
      <YellowTransition />
      <Contact />
      <Footer />
    </main>
  )
}
