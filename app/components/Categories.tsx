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
        <section className="px-6 py-40 max-w-7xl mx-auto bg-white border-y border-[#EBE7DE]">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-32 gap-6">
                <h2 className="text-6xl md:text-9xl font-serif font-black text-[#3E4C37] uppercase tracking-tighter">
                    Explore <span className="text-[#C6A87C]">Categories.</span>
                </h2>
                <p className="text-[#333333]/40 text-sm font-black uppercase tracking-[0.5em] vertical-text">
                    Worldwide Expertise v4.1
                </p>
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
                        className="bg-white group relative overflow-hidden"
                    >
                        <Link
                            href={`/category/${cat.slug}`}
                            className="block p-12 h-full transition-all duration-500 hover:bg-[#3E4C37] group"
                        >
                            <div className="flex flex-col h-full relative z-10">
                                <span className="text-[#C6A87C] font-black text-xs mb-10 tracking-widest group-hover:text-white transition-colors">
                                    0{idx + 1} / SECTOR
                                </span>

                                <cat.icon className="w-12 h-12 text-[#3E4C37] mb-8 group-hover:text-white transition-colors group-hover:scale-110 duration-500" />

                                <h3 className="text-2xl font-black font-serif text-[#333333] mb-4 uppercase tracking-tight group-hover:text-white transition-colors">
                                    {cat.title}
                                </h3>

                                <p className="text-gray-400 text-sm leading-relaxed font-medium mb-12 group-hover:text-white/60 transition-colors">
                                    {cat.desc}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 bg-[#C6A87C] group-hover:bg-white transition-colors" />
                                        ))}
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[#3E4C37] group-hover:text-white transition-all -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                                </div>
                            </div>

                            {/* Decorative Background Mask */}
                            <div className="absolute bottom-0 right-0 text-[10rem] font-black text-[#F3F0E9] translate-x-1/3 translate-y-1/3 pointer-events-none group-hover:text-white/5 transition-colors uppercase">
                                {cat?.title?.[0]}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
