'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Upload, Star, Wallet, Clock, CreditCard, LogOut, User, Layout, Briefcase, Shield, Download } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

type Profile = {
    username: string
    full_name: string | null
    avatar_url: string | null
    role: string
    rating_avg?: number
    level?: number
}

import NotificationBell from './NotificationBell'
import { categories } from '../data/categories'

export default function CreatorNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        if (isMenuOpen) {
            const scrollY = window.scrollY
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
        } else {
            const scrollY = document.body.style.top
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }
        return () => {
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
        }
    }, [isMenuOpen])

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setProfile(data)
                }
            }
        }
        getUser()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    const displayName = profile?.full_name || profile?.username || "Creator"

    return (
        <>
            <nav className="flex items-center justify-between px-4 md:px-6 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-sky-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="w-12 h-12 rounded-2xl border border-sky-100 hover:bg-sky-50 transition-all text-[#0EA5E9] shadow-sm active:scale-95 flex items-center justify-center touch-manipulation"
                        aria-label="Open Menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link href="/creator" className="group flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                            <span className="text-white font-serif font-black text-lg">W</span>
                        </div>
                        <span className="text-xl tracking-[0.4em] text-slate-900 font-serif font-black uppercase hidden sm:block">
                            Workly
                        </span>
                    </Link>
                </div>

                <div className="flex items-center justify-end min-w-[40px] gap-4">
                    {user && <NotificationBell userId={user.id} />}
                    <Link href="/creator/profile" className="w-10 h-10 rounded-full border border-sky-50 overflow-hidden hover:border-[#0EA5E9] transition-all">
                        <img
                            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'U'}&background=0EA5E9&color=fff`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </Link>
                </div>
            </nav>

            {/* Slide-out Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60]">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="fixed top-0 left-0 h-[100dvh] w-[300px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-r border-sky-100">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-50"
                        >
                            <X className="w-6 h-6 text-slate-400" />
                        </button>

                        <div className="flex flex-col items-center pt-16 pb-10 border-b border-sky-50">
                            <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-sky-200" />
                                )}
                            </div>
                            <h2 className="font-serif text-xl font-bold text-slate-900 text-center px-4 uppercase tracking-tight">
                                {displayName}
                            </h2>
                            <div className="flex items-center mt-3 px-4 py-1.5 bg-sky-50 rounded-full border border-sky-100">
                                <Star className="w-3 h-3 text-sky-400 fill-sky-400 mr-2" />
                                <span className="text-xs font-black text-slate-700 mr-3">{profile?.rating_avg || '0.0'}</span>
                                <span className="text-[9px] text-[#0EA5E9] font-black uppercase tracking-wider border-l border-sky-200 pl-3">
                                    Lvl {profile?.level || 1}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto overscroll-contain py-8 touch-pan-y scrollbar-hide">
                            <div className="px-6 mb-8">
                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Workspace</h3>
                                <div className="space-y-2">
                                    {profile?.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mr-4 shadow-sm">
                                                <Shield size={18} />
                                            </div>
                                            <span className="font-bold text-sm">God Mode</span>
                                        </Link>
                                    )}
                                    <Link
                                        href="/creator"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-3 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100">
                                            <Layout size={18} />
                                        </div>
                                        <span className="font-bold text-sm">Dashboard</span>
                                    </Link>
                                    <Link
                                        href="/creator/wallet"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-3 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100">
                                            <Wallet size={18} />
                                        </div>
                                        <span className="font-bold text-sm">Treasury</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="px-6 mb-8">
                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Categories</h3>
                                <div className="space-y-1">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/category/${cat.slug}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 p-2 rounded-xl hover:bg-sky-50 transition-all group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                                                <cat.icon size={16} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                                {cat.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-sky-50">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mr-4 group-hover:bg-red-100 transition-colors">
                                    <LogOut size={18} />
                                </div>
                                <span className="font-bold text-sm">Establish Exit</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
