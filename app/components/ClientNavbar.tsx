'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Bell, User, LogOut, ChevronRight, Search, Filter, LayoutDashboard, Briefcase, Upload, Star, Wallet, Clock, CreditCard, Shield, Zap } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'
import { categories } from '../data/categories'

export default function ClientNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [categoriesOpen, setCategoriesOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
        const getUser = async () => { // Renamed fetchProfile to getUser as per snippet
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user) // Set user state
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
    }, []) // Changed dependency array to empty as per snippet

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login' // Hard refresh to clear all state
    }

    const displayName = profile?.full_name || profile?.username || "Client"

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${isScrolled ? 'bg-white border-slate-200 py-3 shadow-sm' : 'bg-white/95 backdrop-blur-md border-transparent py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    {/* Left: Menu & Brand */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 hover:bg-slate-50 transition-colors rounded-lg text-slate-600"
                            aria-label="Open Menu"
                        >
                            <Menu size={20} />
                        </button>

                        <Link href="/client" className="flex items-center">
                            <span className="text-xl tracking-tighter text-slate-900 font-black">
                                Workly.
                            </span>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4">
                            {user && <NotificationBell userId={user.id} />}
                            {user && (
                                <div className="relative group">
                                    <Link href="/client/profile" className="flex items-center gap-2 pr-1 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-0.5">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100">
                                            <img
                                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'U'}&background=0EA5E9&color=fff`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </Link>

                                    {/* Desktop Hover Dropdown */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                                        <Link href="/client/profile" className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-black transition-colors">
                                            <User size={16} className="mr-3 text-slate-400" />
                                            Profile Settings
                                        </Link>
                                        <Link href="/client/projects" className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-black transition-colors">
                                            <Briefcase size={16} className="mr-3 text-slate-400" />
                                            Projects
                                        </Link>
                                        <div className="h-px bg-slate-50 my-2 mx-4" />
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-black transition-colors"
                                        >
                                            <LogOut size={16} className="mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Slide-out Menu Overlay */}
            {
                isMenuOpen && (
                    <div className="fixed inset-0 z-[60]">
                        <div
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        <div className="fixed top-0 left-0 h-[100dvh] w-[300px] bg-white shadow-2xl flex flex-col transform transition-transform duration-150 ease-in-out border-r border-sky-100">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-50"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>

                            {user && (
                                <div className="flex flex-col items-start pt-20 pb-8 border-b border-sky-50 px-8">
                                    <h2 className="font-sans text-xl font-black text-slate-900 uppercase tracking-tighter mb-1 leading-none">
                                        {profile?.full_name || profile?.username || 'Client'}
                                    </h2>
                                    <p className="text-[11px] font-black text-[#0EA5E9] uppercase tracking-[0.2em]">
                                        @{profile?.username || 'user'}
                                    </p>
                                </div>
                            )}

                            {!user && (
                                <div className="pt-20 pb-8 px-8">
                                    {/* Placeholder or just padding when not logged in to maintain close button position */}
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto overscroll-contain py-8 touch-pan-y scrollbar-hide">
                                <div className="px-6 mb-8">
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] mb-6">Workspace</h3>
                                    <div className="space-y-2">
                                        <Link
                                            href="/client"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-3 rounded-xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mr-4 text-[#0EA5E9]">
                                                <LayoutDashboard size={18} />
                                            </div>
                                            <span className="text-xs uppercase tracking-widest">Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/client/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-3 rounded-xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mr-4 text-[#0EA5E9]">
                                                <User size={18} />
                                            </div>
                                            <span className="text-xs uppercase tracking-widest">Profile Settings</span>
                                        </Link>
                                        <Link
                                            href="/client/projects"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-3 rounded-xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mr-4 text-[#0EA5E9]">
                                                <Briefcase size={18} />
                                            </div>
                                            <span className="text-xs uppercase tracking-widest">Projects</span>
                                        </Link>
                                        <Link
                                            href="/client/compress-files"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-3 rounded-xl text-slate-500 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mr-4 text-[#0EA5E9]">
                                                <Zap size={18} />
                                            </div>
                                            <span className="text-xs uppercase tracking-widest">Shrink Projects</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="px-6 mb-10">
                                    <button
                                        onClick={() => setCategoriesOpen(!categoriesOpen)}
                                        className="w-full flex items-center justify-between text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] mb-6 hover:text-[#0EA5E9] transition-colors"
                                    >
                                        Categories
                                        <ChevronRight size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-90' : ''}`} />
                                    </button>

                                    {categoriesOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="space-y-1 overflow-hidden"
                                        >
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.slug}
                                                    href={`/category/${cat.slug}`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-sky-50 transition-all group font-black"
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                                                        <cat.icon size={16} />
                                                    </div>
                                                    <span className="text-xs uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">
                                                        {cat.title}
                                                    </span>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>

                                <div className="px-6 mb-8 mt-4">
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] mb-6">Financials</h3>
                                    <div className="space-y-1">
                                        <Link
                                            href="/client/wallet"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-3 rounded-xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mr-4 text-[#0EA5E9]">
                                                <Wallet size={18} />
                                            </div>
                                            <span className="text-xs uppercase tracking-widest">Refunds</span>
                                        </Link>
                                        <Link
                                            href="/client/payment-history"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-3 rounded-xl text-slate-500 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mr-4 text-[#0EA5E9]">
                                                <Clock size={18} />
                                            </div>
                                            <span className="text-xs uppercase tracking-widest">History</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {user && (
                                <div className="p-6 border-t border-sky-50">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mr-4 group-hover:bg-red-100 transition-colors">
                                            <LogOut size={20} />
                                        </div>
                                        <span className="font-black text-xs uppercase tracking-widest">Establish Exit</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </>
    )
}
