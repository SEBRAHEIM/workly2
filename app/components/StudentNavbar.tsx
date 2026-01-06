'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Upload, Star, Wallet, Clock, CreditCard, LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'

type Profile = {
    username: string
    full_name: string | null
    avatar_url: string | null
    role: string
}

export default function StudentNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [user, setUser] = useState<any>(null) // Added user state based on the provided snippet
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

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
            <nav className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#F3F0E9]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-[#333333]" />
                    </button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link href="/student" className="text-xl tracking-widest text-[#333333] font-sans uppercase">
                        Workly
                    </Link>
                </div>

                <div className="flex items-center justify-end min-w-[40px] gap-4">
                    {user && <NotificationBell userId={user.id} />}
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
