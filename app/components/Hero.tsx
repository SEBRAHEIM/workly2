'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Star, Zap, GraduationCap } from 'lucide-react'

interface HeroProps {
    hideCta?: boolean
}

export default function Hero({ hideCta = false }: HeroProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-48 relative overflow-hidden bg-[#F3F0E9]">
            {/* Interactive Mouse Follower */}
            <motion.div
                className="fixed pointer-events-none z-0 w-[600px] h-[600px] bg-[#3E4C37]/5 rounded-full blur-[100px]"
                animate={{
                    x: mousePosition.x - 300,
                    y: mousePosition.y - 300,
                }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
            />

            {/* Animated Background Blobs */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white opacity-60 blur-[130px]"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#E6E2D6] opacity-50 blur-[150px]"
                animate={{
                    x: [0, -40, 0],
                    y: [0, -60, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating Decorative Icons */}
            <motion.div
                className="absolute top-[20%] left-[10%] text-[#C6A87C]/20 hidden md:block"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Star size={48} />
            </motion.div>
            <motion.div
                className="absolute bottom-[20%] right-[15%] text-[#3E4C37]/10 hidden md:block"
                animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
                <Zap size={64} fill="currentColor" />
            </motion.div>
            <motion.div
                className="absolute top-[15%] right-[20%] text-[#3E4C37]/15 hidden md:block"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <GraduationCap size={40} />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center max-w-5xl">
                {/* Floating Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center space-x-2 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/40 mb-10 shadow-sm"
                >
                    <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex h-2 w-2 rounded-full bg-[#3E4C37]"
                    />
                    <span className="text-[#3E4C37] text-xs md:text-sm font-black tracking-[0.2em] uppercase">
                        The Future of University Help
                    </span>
                    <Sparkles size={14} className="text-[#C6A87C]" />
                </motion.div>

                {/* Main Headline with Split Text Effect */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif font-black text-6xl md:text-8xl lg:text-9xl text-[#3E4C37] leading-[0.85] mb-10 tracking-tighter"
                >
                    University projects. <br />
                    <motion.span
                        animate={{ color: ["#33333333", "#3E4C37", "#33333333"] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        Perfected for you.
                    </motion.span>
                </motion.h1>

                {/* Descriptive Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-[#333333]/70 text-lg md:text-2xl font-medium mb-14 max-w-2xl leading-relaxed"
                >
                    Partner with elite campus creators to transform your ideas
                    into <span className="text-[#3E4C37] font-bold">top-tier work.</span> Zero stress, 100% excellence.
                </motion.p>

                {!hideCta && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/join"
                                className="inline-block bg-[#3E4C37] text-white px-12 py-6 rounded-3xl text-xl font-bold hover:bg-black transition-colors shadow-2xl relative overflow-hidden group"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"
                                />
                                Get Started Now
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/how-it-works"
                                className="inline-block bg-white/40 backdrop-blur-md text-[#3E4C37] px-12 py-6 rounded-3xl text-xl font-bold hover:bg-white transition-all border border-[#EBE7DE] shadow-lg"
                            >
                                Explore Workly
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
