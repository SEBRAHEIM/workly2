'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { categories } from '../data/categories'
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
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                setRole(data?.role || 'client')
            }
            setLoading(false)
        }
        checkUser()
    }, [supabase])

    return (
        <>
            <nav className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-sky-100">
                <div className="flex items-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 md:p-3 rounded-full border border-sky-200 hover:bg-sky-50 active:scale-95 transition-all group"
                    >
                        <Menu className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                    </motion.button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link href="/" className="text-xl md:text-2xl tracking-tighter text-[#1E293B] font-sans font-black">
                        Workly.
                    </Link>
                </div>

                <div className="flex items-center">
                    {!loading && (
                        <Link
                            href={role ? (role === 'admin' ? '/hq' : role === 'creator' ? '/creator' : '/client') : '/join'}
                            className="bg-[#0EA5E9] text-white px-6 md:px-10 py-2 md:py-3 rounded-full text-xs md:text-sm hover:bg-sky-600 transition-all font-bold shadow-sm hover:shadow-lg active:scale-95 uppercase tracking-widest"
                        >
                            Join
                        </Link>
                    )}
                </div>
            </nav>

            {/* Slide-out Menu Overlay (Left Side) - COMPACT & CATEGORIES */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[60]">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl flex flex-col border-r border-sky-100"
                        >
                            {/* Close Button */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-50 transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </motion.button>

                            <div className="flex-1 overflow-y-auto pt-16 pb-8 scrollbar-hide">
                                <div className="px-6 space-y-8">
                                    {/* Action Section */}
                                    <div className="space-y-4">
                                        {!loading && !role && (
                                            <Link
                                                href="/login"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block text-2xl font-sans font-black text-slate-900 hover:text-[#0EA5E9] transition-colors uppercase tracking-tight"
                                            >
                                                Login
                                            </Link>
                                        )}

                                        <Link
                                            href={role ? (role === 'admin' ? '/hq' : role === 'creator' ? '/creator' : '/client') : '/join'}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full text-center py-5 rounded-full bg-[#0EA5E9] text-white text-[10px] font-black hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 active:scale-95 uppercase tracking-widest mt-4"
                                        >
                                            {role ? 'Dashboard' : 'Join'}
                                        </Link>
                                    </div>

                                    {/* Categories Section */}
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 mb-6 flex items-center gap-2">
                                            <div className="w-4 h-[1px] bg-sky-300" />
                                            Categories
                                        </h3>
                                        <div className="space-y-1">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.slug}
                                                    href={`/category/${cat.slug}`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                                                        <cat.icon size={16} />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-800 group-hover:text-slate-900 transition-colors">
                                                        {cat.title}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Currency info */}
                                    <div className="pt-8 border-t border-sky-100 flex items-center justify-between">
                                        <span className="text-slate-500 font-black tracking-widest text-[9px] uppercase">Currency</span>
                                        <span className="font-black text-slate-900 text-xs">AED</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
