'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Upload, Star, Wallet, Clock, CreditCard, LogOut, User, Layout, Briefcase, Shield, Download, Settings, LifeBuoy, Power, PowerOff, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { updateBusyStatus } from '../(dashboard)/creator/profile/actions'
import { toast } from 'sonner'

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
    const [profile, setProfile] = useState<any | null>(null)
    const [user, setUser] = useState<any>(null)
    const [isBusy, setIsBusy] = useState(false)
    const [isToggling, setIsToggling] = useState(false)
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleToggleBusy = async () => {
        if (isToggling) return

        // Optimistic Update
        const previousStatus = isBusy
        const newStatus = !isBusy
        setIsBusy(newStatus)
        setIsToggling(true)

        try {
            const result = await updateBusyStatus(newStatus)
            if (result.error) {
                // Rollback on error
                setIsBusy(previousStatus)
                toast.error(result.error)
            } else {
                toast.success(newStatus ? "Busy Mode Active" : "Accepting Orders")
                router.refresh()
            }
        } catch (error) {
            // Rollback on crash
            setIsBusy(previousStatus)
            toast.error("Failed to update status")
        } finally {
            setIsToggling(false)
        }
    }

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
                    setIsBusy(data.is_busy || false)
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
                        <span className="text-xl md:text-2xl tracking-tighter text-[#1E293B] font-sans font-black">
                            Workly.
                        </span>
                    </Link>
                </div>

                <div className="flex items-center justify-end min-w-[120px] gap-2 md:gap-4">
                    {user && <NotificationBell userId={user.id} />}
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

                        <div className="flex flex-col items-start pt-16 pb-8 border-b border-sky-50 px-8">
                            {/* Availability Section - Sidebar Top */}
                            <div className={`w-full p-4 rounded-2xl border mb-6 transition-all duration-500 ${isBusy
                                ? 'bg-slate-50 border-slate-200'
                                : 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100 shadow-sm shadow-sky-100/30'
                                }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${isBusy ? 'bg-slate-300' : 'bg-[#0EA5E9]'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isBusy ? 'text-slate-400' : 'text-[#0EA5E9]'}`}>
                                            {isBusy ? 'Busy Mode' : 'Accepting Orders'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleToggleBusy}
                                        disabled={isToggling}
                                        className={`relative w-14 h-7 rounded-full transition-all duration-500 p-1 flex items-center ${isBusy ? 'bg-slate-200' : 'bg-[#0EA5E9]'} active:scale-95`}
                                    >
                                        <motion.div
                                            animate={{ x: isBusy ? 0 : 28 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center"
                                        >
                                            {isToggling ? (
                                                <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                                            ) : isBusy ? (
                                                <PowerOff className="w-3 h-3 text-slate-300" />
                                            ) : (
                                                <Power className="w-3 h-3 text-[#0EA5E9]" />
                                            )}
                                        </motion.div>
                                    </button>
                                </div>
                                <p className={`text-[10px] font-medium leading-tight ${isBusy ? 'text-slate-400' : 'text-sky-600/70'}`}>
                                    {isBusy
                                        ? 'Your packages are currently hidden from prospective clients.'
                                        : 'You are visible and appearing in search results for clients.'}
                                </p>
                            </div>

                            <h2 className="font-sans text-xl font-black text-slate-900 uppercase tracking-tighter mb-1 leading-none">
                                {profile?.full_name || profile?.username || 'Creative'}
                            </h2>
                            <p className="text-[11px] font-black text-[#0EA5E9] uppercase tracking-[0.2em] mb-4">
                                @{profile?.username || 'user'}
                            </p>
                            <div className="flex items-center px-4 py-1.5 bg-sky-50 rounded-full border border-sky-100">
                                <Star className="w-3 h-3 text-sky-500 fill-sky-500 mr-2" />
                                <span className="text-xs font-black text-slate-900">{profile?.rating_avg || '0.0'}</span>
                            </div>
                        </div>

                        {!user && (
                            <div className="pt-16 pb-8 px-8">
                                {/* Padding for guest view */}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto overscroll-contain py-8 touch-pan-y scrollbar-hide">
                            <div className="px-6 mb-8">
                                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.3em] mb-6">Workspace</h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/creator"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-4 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black active:scale-[0.96] select-none"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100 text-[#0EA5E9]">
                                            <Layout size={24} />
                                        </div>
                                        <span className="text-sm uppercase tracking-widest">Dashboard</span>
                                    </Link>
                                    <Link
                                        href="/creator/requests"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-4 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black active:scale-[0.96] select-none"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100 text-[#0EA5E9]">
                                            <Briefcase size={24} />
                                        </div>
                                        <span className="text-sm uppercase tracking-widest">Active Work</span>
                                    </Link>
                                    <Link
                                        href="/creator/requests?tab=completed"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-4 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black active:scale-[0.96] select-none"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100 text-[#0EA5E9]">
                                            <Clock size={24} />
                                        </div>
                                        <span className="text-sm uppercase tracking-widest">Project History</span>
                                    </Link>
                                    <Link
                                        href="/creator/wallet"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-4 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black active:scale-[0.96] select-none"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100 text-[#0EA5E9]">
                                            <Wallet size={24} />
                                        </div>
                                        <span className="text-sm uppercase tracking-widest">Payout</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="px-6 mb-8">
                                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.3em] mb-6">Settings</h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/creator/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-4 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black active:scale-[0.96] select-none"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100 text-[#0EA5E9]">
                                            <User size={24} />
                                        </div>
                                        <span className="text-sm uppercase tracking-widest">Profile</span>
                                    </Link>
                                    <Link
                                        href="/creator/settings"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-4 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black active:scale-[0.96] select-none"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100 text-[#0EA5E9]">
                                            <Shield size={24} />
                                        </div>
                                        <span className="text-sm uppercase tracking-widest">Account</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="px-6 mb-8">
                                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.3em] mb-6">Support</h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/creator/support"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center p-3 rounded-2xl text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-all font-black"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm border border-sky-100 text-[#0EA5E9]">
                                            <LifeBuoy size={20} />
                                        </div>
                                        <span className="text-sm uppercase tracking-widest">Get Help</span>
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {user && (
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
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
