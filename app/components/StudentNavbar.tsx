'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Bell, User, LogOut, ChevronRight, Search, Filter, LayoutDashboard, Briefcase, Upload, Star, Wallet, Clock, CreditCard } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'

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
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-[#EBE7DE] py-4' : 'bg-transparent border-transparent py-8'
                }`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-3 items-center">
                    {/* Left: Animated Menu Trigger */}
                    <div className="flex items-center">
                        <motion.button
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setIsMenuOpen(true)}
                            className="w-10 h-10 md:w-12 md:h-12 bg-white border border-[#EBE7DE] flex flex-col items-center justify-center text-[#3E4C37] hover:bg-[#3E4C37] hover:text-white transition-all shadow-sm group"
                        >
                            <motion.div className="flex flex-col gap-1.5 items-center justify-center">
                                <motion.span
                                    variants={{
                                        hover: { width: 24, x: 2 },
                                        initial: { width: 18, x: 0 }
                                    }}
                                    className="h-[2px] bg-current rounded-full"
                                />
                                <motion.span
                                    className="h-[2px] w-24 bg-current rounded-full"
                                    style={{ width: 24 }}
                                />
                                <motion.span
                                    variants={{
                                        hover: { width: 14, x: -5 },
                                        initial: { width: 24, x: 0 }
                                    }}
                                    className="h-[2px] bg-current rounded-full"
                                />
                            </motion.div>
                        </motion.button>

                        {/* Hidden on mobile, shown on desktop */}
                        <div className="hidden lg:flex items-center ml-8 space-x-6">
                            {['Directory', 'Projects'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/student/${item.toLowerCase()}`}
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-[#333333]/40 hover:text-[#3E4C37] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex justify-center">
                        <Link href="/student" className="group flex items-center md:space-x-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#3E4C37] flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                                <span className="text-white font-serif font-black text-lg md:text-xl">W</span>
                            </div>
                            <span className="text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.4em] text-[#3E4C37] font-serif font-black uppercase hidden sm:block">
                                Workly
                            </span>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end space-x-6">
                        <div className="hidden md:flex items-center space-x-4 border-r border-[#EBE7DE] pr-6">
                            {user && <NotificationBell userId={user.id} />}
                        </div>

                        <Link
                            href="/student/profile"
                            className="w-10 h-10 border border-[#EBE7DE] overflow-hidden hover:border-[#3E4C37] transition-colors group"
                        >
                            <img
                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'U'}&background=3E4C37&color=fff`}
                                alt="Profile"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                            />
                        </Link>

                        <motion.button
                            whileHover="hover"
                            className="bg-[#3E4C37] text-white px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden transition-colors shadow-[2px_2px_0px_0px_#C6A87C] md:shadow-[4px_4px_0px_0px_#C6A87C] hidden xs:block"
                            onClick={handleSignOut}
                        >
                            <span className="relative z-10 text-[8px] md:text-[10px]">Terminal</span>
                            <motion.div
                                variants={{
                                    hover: { y: 0 },
                                    initial: { y: '100%' }
                                }}
                                className="absolute inset-0 bg-black transition-transform duration-300"
                            />
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Slide-out Menu Overlay */}
            {
                isMenuOpen && (
                    <div className="fixed inset-0 z-[60]">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <div className="absolute top-0 left-0 h-full w-[80%] max-w-sm bg-[#F3F0E9] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5"
                            >
                                <X className="w-6 h-6 text-[#333333]" />
                            </button>

                            {/* User Header */}
                            <div className="flex flex-col items-center pt-16 pb-10 border-b border-[#E6E2D6]">
                                <div className="w-20 h-20 rounded-full bg-[#E6E2D6] flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-gray-400" />
                                    )}
                                </div>
                                <h2 className="font-serif text-xl font-bold text-[#333333] text-center px-4">
                                    {displayName}
                                </h2>
                                <span className="text-xs font-sans text-gray-500 uppercase tracking-widest mt-1">
                                    {profile?.role ? `${profile.role} Account` : 'Student Account'}
                                </span>
                            </div>

                            {/* Menu Items */}
                            <div className="flex-1 overflow-y-auto py-8">
                                <div className="px-6 mb-8">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Workspace</h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="/student"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <LayoutDashboard className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/student/projects"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <Briefcase className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">My Projects</span>
                                        </Link>
                                        <Link
                                            href="/student/compress-files"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <Upload className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Compress Files</span>
                                        </Link>
                                        <Link
                                            href="/student/favorites"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <Star className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Favorite Creator</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="px-6 mb-8">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Finance</h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="/student/wallet"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <Wallet className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Wallet</span>
                                        </Link>
                                        <Link
                                            href="/student/transactions"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Pending Transaction</span>
                                        </Link>
                                        <Link
                                            href="/student/payment-history"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Payment History</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="px-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account</h3>
                                    <div className="space-y-4">
                                        <Link
                                            href="/student/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center p-2 rounded-xl text-[#333333] hover:text-[#3E4C37] active:bg-[#E6E2D6]/50 active:scale-98 transition-all touch-manipulation"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Profile Settings</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Logout */}
                            <div className="p-6 border-t border-[#E6E2D6]">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-all cursor-pointer group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Log out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
