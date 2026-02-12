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

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const xMove = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section ref={ref} className="px-4 md:px-6 py-4 md:py-24 max-w-7xl mx-auto bg-white">


            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
            >
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden bg-sky-50/30 rounded-2xl md:rounded-[3rem] border border-sky-50 hover:border-sky-100 hover:bg-white transition-all duration-200 hover:shadow-2xl hover:shadow-sky-100/50"
                    >
                        <Link
                            href={`/category/${cat.slug}`}
                            className="block h-full relative z-10"
                        >
                            <div className="flex flex-col h-full relative z-20 p-5 md:p-12 items-center text-center md:items-start md:text-left">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-3xl flex items-center justify-center text-[#0EA5E9] mb-4 md:mb-10 shadow-sm group-hover:bg-[#0EA5E9] group-hover:text-white transition-all duration-200">
                                    <cat.icon className="w-6 h-6 md:w-8 md:h-8" />
                                </div>

                                <h3 className="text-xs leading-tight md:text-4xl font-black font-serif text-slate-800 mb-2 md:mb-4 uppercase tracking-tighter group-hover:text-[#0EA5E9] transition-colors duration-200">
                                    {cat.title}
                                </h3>

                                <p className="hidden md:block text-slate-400 text-sm leading-relaxed font-medium mb-12 group-hover:text-slate-600 transition-colors duration-200">
                                    {cat.desc}
                                </p>

                                <div className="mt-auto hidden md:block">
                                    <div className="flex items-center gap-4 text-slate-900 font-black text-[10px] uppercase tracking-widest group-hover:text-[#0EA5E9] transition-colors duration-200">
                                        Explore Domain
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-200" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
