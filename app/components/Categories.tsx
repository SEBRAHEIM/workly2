'use client'

import { categories } from '../data/categories'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Users, Target, ShieldCheck, ArrowRight, Zap } from 'lucide-react' // Assuming lucide-react is installed for the ArrowRight icon
import { useRef } from 'react'

export default function Categories() {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="px-6 py-20 md:py-24 max-w-7xl mx-auto bg-white border-y border-[#EBE7DE]">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 md:mb-16 gap-4">
                <h2 className="text-4xl md:text-6xl font-serif font-black text-[#3E4C37] uppercase tracking-tighter">
                    Explore <span className="text-[#C6A87C]">Categories.</span>
                </h2>
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#EBE7DE] border border-[#EBE7DE]"
            >
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        className="bg-white group relative overflow-hidden h-[400px] md:h-[450px] border-[#EBE7DE]"
                    >
                        <Link
                            href={`/category/${cat.slug}`}
                            className="block h-full relative z-10 transition-all duration-700"
                        >
                            {/* Background Image Reveal */}
                            <div className="absolute inset-0 z-0">
                                <motion.div
                                    className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-all duration-1000 opacity-0 group-hover:opacity-40"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                />
                                <div className="absolute inset-0 bg-white group-hover:bg-transparent transition-colors duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            </div>

                            <div className="flex flex-col h-full relative z-20 p-8 md:p-10">

                                <cat.icon className="w-12 h-12 text-[#3E4C37] mb-8 group-hover:scale-110 transition-transform duration-500" />

                                <h3 className="text-2xl md:text-3xl font-black font-serif text-[#333333] mb-4 uppercase tracking-tighter leading-none group-hover:text-[#3E4C37] transition-colors">
                                    {cat.title}
                                </h3>

                                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-12 group-hover:text-[#333333] transition-colors max-w-[280px]">
                                    {cat.desc}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="bg-[#3E4C37] text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-xl flex items-center gap-3"
                                    >
                                        Start Project
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-1.5 h-1.5 bg-[#C6A87C] rounded-full"
                                        />
                                    </motion.div>
                                    <ArrowRight className="w-6 h-6 text-[#3E4C37] -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                                </div>
                            </div>

                            {/* Decorative Lettering */}
                            <div className="absolute bottom-4 right-4 text-[12rem] font-black text-[#F3F0E9] group-hover:text-[#3E4C37]/5 transition-colors uppercase leading-none pointer-events-none select-none">
                                {cat?.title?.[0]}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
