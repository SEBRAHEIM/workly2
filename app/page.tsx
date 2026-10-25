import Header from './components/landing/Header'
import Hero from './components/landing/Hero'
import { Marquee, Services, Showcase, Bento, Process, Industries } from './components/landing/Sections'
import Reveal from './components/landing/Reveal'
import { Inquiry, Footer } from './components/landing/Inquiry'
import Work from './components/landing/Work'
import { Why, Faq } from './components/landing/Trust'
import { createClient } from '@/utils/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workly | Custom Websites, Online Stores & Web Apps',
  description: 'Workly designs and builds custom websites, e-commerce stores, booking systems and web applications for businesses of every kind. Tell us what you need and we build it for you.',
  metadataBase: new URL('https://workly.day'),
  openGraph: {
    title: 'Workly | Custom Websites, Crafted Just for You',
    description: 'Custom websites, online stores, booking systems and web apps, designed and built by the Workly team.',
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

export default async function Home() {
  const accountHref = await getAccountHref()

  return (
    <main className="landing min-h-screen bg-white pb-6 font-[family-name:var(--font-inter)] font-normal text-[#151515]">
      <Header accountHref={accountHref} />
      <Reveal />
      <Hero />
      <Marquee />
      <Services />
      <Work />
      <Showcase />
      <Bento />
      <Why />
      <Process />
      <Industries />
      <Faq />
      <Inquiry />
      <Footer />
    </main>
  )
}
