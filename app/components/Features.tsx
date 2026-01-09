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
            title: "The Campus Elite",
            desc: "We manually vet every creator to ensure you work with the top 1% of student talent.",
            details: ["Portfolio Verified", "Top Grades", "Fast Response"],
            icon: <Users size={28} />,
            color: "#3E4C37"
        },
        {
            title: "Precision Matching",
            desc: "Our smart algorithms find the perfect specialist for your unique requirements.",
            details: ["Niche Experts", "Tool-Specific", "Budget Friendly"],
            icon: <Target size={28} />,
            color: "#C6A87C"
        },
        {
            title: "Guaranteed Quality",
            desc: "Payment is held in escrow and only released when you're 100% satisfied.",
            details: ["Secure Escrow", "Unlimited Edits", "24/7 Support"],
            icon: <ShieldCheck size={28} />,
            color: "#333333"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section className="px-6 py-32 max-w-7xl mx-auto overflow-hidden">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12"
            >
                <div className="max-w-3xl">
                    <h2 className="font-serif font-black text-5xl md:text-7xl text-[#3E4C37] mb-8 leading-[0.9]">
                        Elevate your academic <br /> standards.
                    </h2>
                    <p className="text-[#333333]/60 text-xl md:text-2xl font-medium max-w-xl leading-relaxed">
                        Don't just get it done. Get it done by the best creators
                        on campus who understand your vision.
                    </p>
                </div>
                {!hideCta && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/join"
                            className="bg-[#3E4C37] text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-black transition-all shadow-xl flex items-center group"
                        >
                            Become a Student
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        whileHover={{ y: -15 }}
                        className="bg-white p-10 rounded-[3rem] border border-[#EBE7DE] shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                    >
                        {/* Interactive Background Shape */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3F0E9] rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-[#3E4C37] transition-colors duration-500" />

                        <div className="w-20 h-20 rounded-[2rem] bg-[#F3F0E9] flex items-center justify-center mb-10 group-hover:bg-[#3E4C37] group-hover:text-white transition-all duration-500 relative z-10">
                            {feature.icon}
                        </div>

                        <h3 className="text-2xl font-black font-serif text-[#3E4C37] mb-4 relative z-10">{feature.title}</h3>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium mb-8 relative z-10">
                            {feature.desc}
                        </p>

                        <div className="flex flex-wrap gap-2 relative z-10">
                            {feature.details.map((detail, i) => (
                                <span key={i} className="px-3 py-1 bg-[#F3F0E9] text-[#333333]/60 text-xs font-black uppercase tracking-wider rounded-lg group-hover:bg-white/50 transition-colors">
                                    {detail}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
