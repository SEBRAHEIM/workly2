'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Users, Target, ShieldCheck, ArrowRight, Zap } from 'lucide-react'
import { useRef } from 'react'

interface FeaturesProps {
    hideCta?: boolean
}

export default function Features({ hideCta = false }: FeaturesProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const xMove = useTransform(scrollYProgress, [0, 1], [0, 100])

    const features = [
        {
            title: "Rigorous Vetting",
            desc: "Every creator undergoes a multi-stage review of their academic and professional portfolio.",
            details: ["Portfolio Verified", "Top Grades"],
            icon: <Users size={20} />,
            size: "col-span-1 md:col-span-2",
            image: "https://images.unsplash.com/photo-1523050335102-c32c7503122b?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Strategic Matching",
            desc: "Precision algorithms for precise tasks.",
            details: ["Niche Experts"],
            icon: <Target size={20} />,
            size: "col-span-1",
            bg: "bg-[#3E4C37] text-white"
        },
        {
            title: "Global Standards",
            desc: "Projects delivered with institutional excellence.",
            details: ["24/7 Support"],
            icon: <ShieldCheck size={20} />,
            size: "col-span-1",
            bg: "bg-[#C6A87C] text-[#333333]"
        },
        {
            title: "Institutional Trust",
            desc: "Secure escrow and satisfaction guarantees ensure every project meets the highest standards.",
            details: ["Secure Escrow", "Unlimited Edits"],
            icon: <Zap size={20} />,
            size: "col-span-1 md:col-span-2",
            bg: "bg-white"
        }
    ];

    return (
        <section ref={sectionRef} className="px-6 py-40 max-w-7xl mx-auto relative overflow-hidden">
            {/* Parallax Background Text - RESPONSIVE SIZE */}
            <motion.div
                style={{ x: xMove }}
                className="absolute top-0 left-0 text-[10rem] md:text-[20rem] font-black text-[#3E4C37]/5 whitespace-nowrap pointer-events-none select-none uppercase tracking-tighter"
            >
                Precision Quality Trust Brilliance
            </motion.div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Intro Card */}
                <div className="col-span-1 md:col-span-3 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl"
                    >
                        <h2 className="font-serif font-black text-5xl md:text-9xl text-[#3E4C37] leading-[0.8] tracking-tighter uppercase mb-10">
                            The New <br /> <span className="text-[#C6A87C]">Standard.</span>
                        </h2>
                        <div className="h-[2px] w-full bg-[#EBE7DE] mb-10 overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                whileInView={{ x: "0%" }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full w-full bg-[#3E4C37]"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Bento Grid */}
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className={`group relative p-8 md:p-10 overflow-hidden border border-[#EBE7DE] shadow-sm hover:shadow-2xl transition-all duration-500 rounded-none ${feature.size} ${feature.bg || 'bg-white'}`}
                    >
                        {feature.image && (
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <img src={feature.image} alt="" className="w-full h-full object-cover grayscale" />
                            </div>
                        )}

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div className={`w-12 h-12 flex items-center justify-center border ${feature.bg ? 'border-white/20' : 'border-[#3E4C37]/10'} group-hover:bg-[#3E4C37] group-hover:text-white transition-all duration-500`}>
                                    {feature.icon}
                                </div>
                                <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                            </div>

                            <h3 className="text-3xl font-black font-serif uppercase tracking-tighter mb-4">{feature.title}</h3>
                            <p className={`text-lg font-medium mb-10 transition-colors ${feature.bg ? 'text-white/70' : 'text-[#333333]/60'}`}>
                                {feature.desc}
                            </p>

                            <div className="mt-auto flex flex-wrap gap-3">
                                {feature.details.map((detail, i) => (
                                    <span key={i} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border ${feature.bg ? 'border-white/20 bg-white/5' : 'border-[#3E4C37]/10 bg-[#F3F0E9]'}`}>
                                        {detail}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Scanner Effect */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A87C] to-transparent -translate-y-full group-hover:translate-y-full transition-all duration-[2000ms] ease-linear" />
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
