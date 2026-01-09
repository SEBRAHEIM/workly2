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
        <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-48 relative overflow-hidden bg-[#F8F7F2] border-b border-[#EBE7DE]">
            {/* Structured Academic Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#3E4C37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Interactive Focal Point */}
            <motion.div
                className="fixed pointer-events-none z-0 w-[500px] h-[500px] bg-[#3E4C37]/5 rounded-full blur-[100px]"
                animate={{
                    x: mousePosition.x - 250,
                    y: mousePosition.y - 250,
                }}
                transition={{ type: "spring", damping: 40, stiffness: 150 }}
            />

            {/* Sharp Geometric Accents */}
            <motion.div
                className="absolute top-[10%] left-[5%] text-[#3E4C37]/10 hidden lg:block"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                <div className="w-64 h-64 border border-current rounded-full" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center max-w-6xl">
                {/* Academic Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center space-x-3 bg-[#3E4C37] px-5 py-2 rounded-lg mb-12 shadow-xl"
                >
                    <GraduationCap size={16} className="text-[#C6A87C]" />
                    <span className="text-white text-xs md:text-sm font-black tracking-[0.3em] uppercase">
                        University Excellence
                    </span>
                    <Sparkles size={14} className="text-[#C6A87C]" />
                </motion.div>

                {/* Serious Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif font-black text-6xl md:text-8xl lg:text-[10rem] text-[#3E4C37] leading-[0.8] mb-12 tracking-tight uppercase"
                    style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}
                >
                    University <br />
                    <span className="text-[#333333]">Elevated.</span>
                </motion.h1>

                {/* Structured Body Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-[#333333]/80 text-xl md:text-3xl font-medium mb-16 max-w-3xl leading-snug border-l-4 border-[#C6A87C] pl-8 italic"
                >
                    The premier destination for academic collaboration.
                    Connecting visionary students with <span className="text-[#3E4C37] font-black not-italic underline decoration-[#C6A87C] decoration-4 underline-offset-8">elite campus creators.</span>
                </motion.p>

                {!hideCta && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-8"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/join"
                                className="inline-block bg-[#3E4C37] text-white px-14 py-7 rounded-xl text-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-[8px_8px_0px_0px_#C6A87C]"
                            >
                                Get Started
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/how-it-works"
                                className="inline-block bg-white text-[#3E4C37] px-14 py-7 rounded-xl text-xl font-black uppercase tracking-widest border-2 border-[#3E4C37] hover:bg-[#3E4C37] hover:text-white transition-all shadow-lg"
                            >
                                Our Methodology
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
