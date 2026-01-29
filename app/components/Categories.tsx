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
        <section ref={ref} className="px-4 md:px-6 py-12 md:py-24 max-w-7xl mx-auto bg-white border-y border-sky-50">
            <div className="mb-10 md:mb-24">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400 mb-4 block">Marketplace Hub</span>
                <h2 className="font-serif font-black text-5xl md:text-9xl text-slate-900 leading-[0.8] tracking-tighter uppercase mb-2">
                    Visual <br /> <span className="text-[#0EA5E9]">Standard.</span>
                </h2>
                <div className="w-16 h-[1px] bg-sky-100 mt-8 md:mt-12" />
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        className="group relative overflow-hidden bg-sky-50/30 rounded-[3rem] border border-sky-50 hover:border-sky-100 hover:bg-white transition-all duration-700 hover:shadow-2xl hover:shadow-sky-100/50"
                    >
                        <Link
                            href={`/category/${cat.slug}`}
                            className="block h-full relative z-10"
                        >
                            <div className="flex flex-col h-full relative z-20 p-8 md:p-12">
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#0EA5E9] mb-10 shadow-sm group-hover:bg-[#0EA5E9] group-hover:text-white transition-all duration-500">
                                    <cat.icon size={32} />
                                </div>

                                <h3 className="text-3xl md:text-4xl font-black font-serif text-slate-800 mb-4 uppercase tracking-tighter leading-none group-hover:text-[#0EA5E9] transition-colors">
                                    {cat.title}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-12 group-hover:text-slate-600 transition-colors">
                                    {cat.desc}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-4 text-slate-900 font-black text-[10px] uppercase tracking-widest group-hover:text-[#0EA5E9] transition-colors">
                                        Explore Domain
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background number */}
                            <div className="absolute top-10 right-10 text-[6rem] font-black text-slate-900/5 transition-colors uppercase leading-none pointer-events-none select-none">
                                0{idx + 1}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
