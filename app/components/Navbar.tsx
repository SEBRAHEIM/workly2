'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'

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
            <nav className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 sticky top-0 bg-[#F8F7F2]/90 backdrop-blur-xl z-50 border-b border-[#E6E2D6]">
                <div className="flex items-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2.5 md:p-3 rounded-full border border-gray-300 hover:bg-white active:scale-95 transition-all shadow-sm group"
                    >
                        <Menu className="w-5 h-5 md:w-6 md:h-6 text-[#333333]" />
                    </motion.button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link href="/" className="text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.4em] text-[#3E4C37] font-serif font-black uppercase">
                        Workly
                    </Link>
                </div>

                <div className="flex items-center">
                    {!loading && !role && (
                        <Link
                            href="/join"
                            className="bg-[#3E4C37] text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm hover:bg-[#2e3b29] transition-all font-bold shadow-md hover:shadow-lg active:scale-95"
                        >
                            Join
                        </Link>
                    )}
                    {!loading && role && (
                        <Link
                            href={role === 'creator' ? '/creator' : '/student'}
                            className="bg-[#3E4C37] text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm hover:bg-[#2e3b29] transition-all font-bold shadow-md hover:shadow-lg active:scale-95"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>
            </nav>

            {/* Slide-out Menu Overlay (Left Side) - REFINED */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[60]">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Panel - REVERTED TO CLASSIC */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-[#F8F7F2] shadow-2xl flex flex-col border-r border-[#E6E2D6] rounded-r-3xl"
                        >
                            {/* Close Button */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
                            >
                                <X className="w-6 h-6 text-[#333333]" />
                            </motion.button>

                            <div className="flex flex-col p-8 md:p-12 pt-24 md:pt-32 space-y-10">
                                <div className="space-y-6">
                                    {!loading && !role && (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-4xl font-serif font-black text-[#3E4C37] hover:text-[#C6A87C] transition-colors"
                                        >
                                            Login
                                        </Link>
                                    )}

                                    <Link
                                        href="/join"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block text-4xl font-serif font-black text-[#3E4C37] hover:text-[#C6A87C] transition-colors"
                                    >
                                        Join
                                    </Link>
                                </div>

                                {/* Currency info */}
                                <div className="pt-8 border-t border-[#E6E2D6] flex items-center justify-between">
                                    <span className="text-gray-400 font-medium tracking-widest text-xs uppercase">Currency</span>
                                    <span className="font-black text-[#333333]">AED</span>
                                </div>

                                {!loading && role && (
                                    <Link
                                        href={role === 'creator' ? '/creator' : '/student'}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-4 rounded-2xl bg-[#3E4C37] text-white font-bold hover:bg-[#2e3b29] transition-all shadow-lg active:scale-95"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
