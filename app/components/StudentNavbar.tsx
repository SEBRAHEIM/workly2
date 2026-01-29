'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Bell, User, LogOut, ChevronRight, Search, Filter, LayoutDashboard, Briefcase, Upload, Star, Wallet, Clock, CreditCard, Shield, Zap } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'
import { categories } from '../data/categories'

export default function StudentNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
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

    const displayName = profile?.full_name || profile?.username || "Student"

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-sky-100 py-4' : 'bg-transparent border-transparent py-8'
                }`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-3 items-center">
                    {/* Left: Menu Trigger */}
                    <div className="flex items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(true)}
                            className="w-12 h-12 md:w-12 md:h-12 bg-white border border-sky-100 flex items-center justify-center text-[#0EA5E9] hover:bg-sky-50 transition-all shadow-sm rounded-xl touch-manipulation"
                            aria-label="Open Menu"
                        >
                            <Menu size={24} className="w-6 h-6" />
                        </motion.button>

                        <div className="hidden lg:flex items-center ml-8 space-x-6">
                            {['Directory', 'Projects'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/student/${item.toLowerCase()}`}
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#0EA5E9] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex justify-center">
                        <Link href="/student" className="group flex items-center md:space-x-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                                <span className="text-white font-serif font-black text-lg md:text-xl">W</span>
                            </div>
                            <span className="text-xl md:text-2xl tracking-[0.4em] text-slate-900 font-serif font-black uppercase hidden sm:block">
                                Workly
                            </span>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end space-x-6">
                        <div className="hidden md:flex items-center space-x-4 border-r border-sky-50 pr-6">
                            {user && <NotificationBell userId={user.id} />}
                        </div>

                        <Link
                            href="/student/profile"
                            className="w-10 h-10 border border-sky-50 overflow-hidden hover:border-[#0EA5E9] transition-colors group rounded-full"
                        >
                            <img
                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'U'}&background=0EA5E9&color=fff`}
                                alt="Profile"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                            />
                        </Link>

                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-slate-900 text-white px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-sky-100 hover:bg-[#0EA5E9] hidden xs:block rounded-full"
                            onClick={handleSignOut}
                        >
                            Log Out
                        </motion.button>
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

                        <div className="fixed top-0 left-0 h-[100dvh] w-[300px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-r border-sky-100">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-50"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>

                            <div className="flex flex-col items-start pt-20 pb-8 border-b border-sky-50 px-8">
                                <h2 className="font-serif text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                                    {profile?.username || 'Operator'}
                                </h2>
                                <p className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-[0.2em] opacity-80">
                                    {profile?.full_name || 'Registry Identity'}
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto overscroll-contain py-8 touch-pan-y scrollbar-hide">
                                <div className="px-6 mb-8">
                                    <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Workspace</h3>
                                    <div className="space-y-1">
                                        <Link
                                            href="/student"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mr-3 text-[#0EA5E9]">
                                                <LayoutDashboard size={14} />
                                            </div>
                                            <span className="font-black text-[9px] uppercase tracking-widest">Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/student/projects"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mr-3 text-[#0EA5E9]">
                                                <Briefcase size={14} />
                                            </div>
                                            <span className="font-black text-[9px] uppercase tracking-widest">Projects</span>
                                        </Link>
                                        <Link
                                            href="/student/compress-files"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-slate-500 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mr-3 text-[#0EA5E9]">
                                                <Zap size={14} />
                                            </div>
                                            <span className="font-black text-[9px] uppercase tracking-widest">Shrink Projects</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="px-6 mb-10">
                                    <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Discovery</h3>
                                    <div className="space-y-1">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/category/${cat.slug}`}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-sky-50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                                                    <cat.icon size={14} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                                                    {cat.title}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-6 mb-8">
                                    <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Financials</h3>
                                    <div className="space-y-1">
                                        <Link
                                            href="/student/wallet"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mr-3 text-[#0EA5E9]">
                                                <Wallet size={14} />
                                            </div>
                                            <span className="font-black text-[9px] uppercase tracking-widest">Vault</span>
                                        </Link>
                                        <Link
                                            href="/student/payment-history"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-slate-500 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mr-3 text-[#0EA5E9]">
                                                <Clock size={14} />
                                            </div>
                                            <span className="font-black text-[9px] uppercase tracking-widest">History</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-sky-50">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                                        <LogOut size={16} />
                                    </div>
                                    <span className="font-black text-[10px] uppercase tracking-widest">Establish Exit</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
