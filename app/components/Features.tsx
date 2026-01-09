'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Target, ShieldCheck, ArrowRight } from 'lucide-react'

interface FeaturesProps {
    hideCta?: boolean
}

export default function Features({ hideCta = false }: FeaturesProps) {
    const features = [
        {
            title: "Rigorous Vetting",
            desc: "Every creator undergoes a multi-stage review of their academic and professional portfolio.",
            details: ["Portfolio Verified", "Top Grades", "Fast Response"],
            icon: <Users size={24} />,
            color: "#3E4C37"
        },
        {
            title: "Strategic Matching",
            desc: "We analyze project requirements to match you with the precise expertise your task demands.",
            details: ["Niche Experts", "Tool-Specific", "Budget Friendly"],
            icon: <Target size={24} />,
            color: "#C6A87C"
        },
        {
            title: "Institutional Trust",
            desc: "Secure escrow and satisfaction guarantees ensure every project meets the highest standards.",
            details: ["Secure Escrow", "Unlimited Edits", "24/7 Support"],
            icon: <ShieldCheck size={24} />,
            color: "#333333"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="px-6 py-32 max-w-7xl mx-auto relative overflow-hidden bg-white">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 relative z-10"
            >
                <div className="max-w-4xl">
                    <h2 className="font-serif font-black text-5xl md:text-7xl text-[#3E4C37] mb-8 leading-[0.9] uppercase tracking-tighter">
                        The Standard for <br /> <span className="text-[#C6A87C]">Academic creators.</span>
                    </h2>
                    <p className="text-[#333333]/70 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed border-l-4 border-[#3E4C37] pl-6">
                        We don't just facilitate tasks; we curate brilliance.
                        Partner with creators who share your commitment to excellence.
                    </p>
                </div>
                {!hideCta && (
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            href="/join"
                            className="bg-[#3E4C37] text-white px-10 py-5 rounded-none text-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-[6px_6px_0px_0px_#C6A87C] flex items-center group"
                        >
                            Enroll Now
                            <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
            >
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        whileHover={{ y: -10 }}
                        className="bg-white p-12 rounded-none border-2 border-[#EBE7DE] shadow-sm hover:shadow-[12px_12px_0px_0px_#F3F0E9] hover:border-[#3E4C37] transition-all duration-300 group relative"
                    >
                        <div className="w-16 h-16 bg-[#F3F0E9] flex items-center justify-center mb-10 group-hover:bg-[#3E4C37] group-hover:text-white transition-all duration-300 border border-[#EBE7DE]">
                            {feature.icon}
                        </div>

                        <h3 className="text-2xl font-black font-serif text-[#3E4C37] mb-6 uppercase tracking-tight">{feature.title}</h3>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium mb-10">
                            {feature.desc}
                        </p>

                        <div className="flex flex-col gap-3">
                            {feature.details.map((detail, i) => (
                                <div key={i} className="flex items-center text-[#333333]/50 text-xs font-black uppercase tracking-[0.2em]">
                                    <div className="w-1.5 h-1.5 bg-[#C6A87C] mr-3" />
                                    {detail}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
