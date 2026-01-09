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
            <nav className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#F3F0E9]/90 backdrop-blur-xl z-50 border-b border-[#E6E2D6]">
                <div className="flex items-center">
                    <motion.button
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setIsMenuOpen(true)}
                        className="w-12 h-12 bg-white border border-[#E6E2D6] flex flex-col items-center justify-center text-[#3E4C37] hover:bg-[#3E4C37] hover:text-white transition-all shadow-sm group"
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
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link href="/" className="text-2xl tracking-[0.4em] text-[#3E4C37] font-serif font-black uppercase">
                        Workly
                    </Link>
                </div>

                <div className="flex items-center">
                    {!loading && !role && (
                        <Link href="/join">
                            <motion.button
                                whileHover="hover"
                                className="bg-[#3E4C37] text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden transition-colors shadow-[4px_4px_0px_0px_#C6A87C]"
                            >
                                <span className="relative z-10 flex items-center">
                                    Join
                                    <ArrowRight size={14} className="ml-2" />
                                </span>
                                <motion.div
                                    variants={{
                                        hover: { x: 0 },
                                        initial: { x: '-100%' }
                                    }}
                                    className="absolute inset-0 bg-black transition-transform duration-300"
                                />
                            </motion.button>
                        </Link>
                    )}
                    {!loading && role && (
                        <Link href={role === 'creator' ? '/creator' : '/student'}>
                            <motion.button
                                whileHover="hover"
                                className="bg-[#3E4C37] text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden transition-colors shadow-[4px_4px_0px_0px_#C6A87C]"
                            >
                                <span className="relative z-10">Dashboard</span>
                                <motion.div
                                    variants={{
                                        hover: { x: 0 },
                                        initial: { x: '-100%' }
                                    }}
                                    className="absolute inset-0 bg-black transition-transform duration-300"
                                />
                            </motion.button>
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

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 h-full w-[80%] max-w-sm bg-[#F3F0E9] shadow-2xl flex flex-col border-r border-[#E6E2D6]"
                        >
                            {/* Close Button */}
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 p-3 bg-white border border-[#E6E2D6] text-[#3E4C37] hover:bg-[#3E4C37] hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>

                            <div className="flex flex-col p-12 pt-32 space-y-8">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#333333]/30 mb-8">Navigation Protocol</p>

                                    {!loading && !role && (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group block text-4xl font-serif font-black text-[#3E4C37] uppercase tracking-tighter hover:text-[#C6A87C] transition-colors"
                                        >
                                            Login
                                            <span className="block h-[2px] w-0 bg-[#C6A87C] group-hover:w-12 transition-all duration-300 mt-2" />
                                        </Link>
                                    )}

                                    <Link
                                        href="/join"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="group block text-4xl font-serif font-black text-[#3E4C37] uppercase tracking-tighter hover:text-[#C6A87C] transition-colors"
                                    >
                                        Enroll
                                        <span className="block h-[2px] w-0 bg-[#C6A87C] group-hover:w-12 transition-all duration-300 mt-2" />
                                    </Link>
                                </div>

                                {/* Currency info with sharp look */}
                                <div className="pt-12 border-t border-[#E6E2D6] flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#333333]/40">Active Currency</span>
                                    <span className="text-xl font-serif font-black text-[#3E4C37]">AED</span>
                                </div>

                                {!loading && role && (
                                    <Link
                                        href={role === 'creator' ? '/creator' : '/student'}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-5 bg-[#3E4C37] text-white font-black uppercase tracking-[0.2em] text-xs shadow-[8px_8px_0px_0px_#C6A87C] hover:bg-black transition-all active:translate-y-1 active:shadow-none"
                                    >
                                        Access Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Extra Bottom Info */}
                            <div className="mt-auto p-12">
                                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[#333333]/20">Workly Creative v4.5 // System Online</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
