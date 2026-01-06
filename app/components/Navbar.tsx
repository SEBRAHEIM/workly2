'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                setRole(data?.role || 'student')
            }
            setLoading(false)
        }
        checkUser()
    }, [supabase])

    return (
        <>
            <nav className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#F3F0E9]/80 backdrop-blur-md z-50">
                <div className="flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 active:bg-gray-200 active:scale-90 transition-all touch-manipulation"
                    >
                        <Menu className="w-5 h-5 text-[#333333]" />
                    </button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link href="/" className="text-xl tracking-widest text-[#333333] font-sans uppercase">
                        Workly
                    </Link>
                </div>

                <div className="flex items-center">
                    {!loading && !role && (
                        <Link
                            href="/join"
                            className="bg-[#3E4C37] text-white px-6 py-2 rounded-full text-sm hover:bg-[#2e3b29] transition-colors font-bold"
                        >
                            Join
                        </Link>
                    )}
                    {!loading && role && (
                        <div className="w-10"></div>
                    )}
                </div>
            </nav>

            {/* Slide-out Menu Overlay (Left Side) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60]">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute top-0 left-0 h-full w-[80%] max-w-sm bg-[#F3F0E9] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-r border-[#E6E2D6]">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5"
                        >
                            <X className="w-6 h-6 text-[#333333]" />
                        </button>

                        <div className="flex flex-col p-8 pt-24 space-y-6">
                            {/* Navigation */}
                            {!loading && !role && (
                                <div className="space-y-4 pt-4">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-3 rounded-xl border border-[#333333] text-[#333333] font-bold hover:bg-gray-100 active:scale-95 transition-all duration-200 ease-in-out touch-manipulation"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            )}

                            {/* Currency */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E6E2D6]">
                                <span className="font-medium text-gray-500">Currency</span>
                                <span className="font-bold text-[#333333]">AED</span>
                            </div>

                            {!loading && role && (
                                <Link
                                    href={role === 'creator' ? '/creator' : '/student'}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center py-3 rounded-xl bg-[#3E4C37] text-white font-bold hover:bg-[#2e3b29] active:scale-95 transition-all duration-200 touch-manipulation"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
