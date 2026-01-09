'use client'

import { categories } from '../data/categories'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Categories() {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <section className="px-6 py-32 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <h2 className="text-4xl md:text-6xl font-serif font-black text-[#3E4C37] mb-6">Explore Excellence</h2>
                <p className="text-[#333333]/50 text-xl md:text-2xl font-medium">Select a discipline to find your perfect creative partner.</p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        whileHover={{
                            rotateY: 10,
                            rotateX: -5,
                            z: 50,
                            scale: 1.02
                        }}
                        className="perspective-1000"
                    >
                        <Link
                            href={`/category/${cat.slug}`}
                            className="block group touch-manipulation transition-all duration-300 h-full"
                        >
                            <div className="bg-white p-10 rounded-[3rem] border border-[#EBE7DE] shadow-sm group-hover:shadow-2xl group-active:bg-[#F3F0E9] transition-all duration-500 h-full flex flex-col items-start cursor-pointer relative overflow-hidden">
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F3F0E9]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-16 h-16 bg-[#F3F0E9] rounded-2xl flex items-center justify-center mb-8 text-[#3E4C37] group-hover:bg-[#3E4C37] group-hover:text-white transition-all duration-500 relative z-10">
                                    <cat.icon className="w-8 h-8 transition-transform group-hover:scale-110" />
                                </div>

                                <h3 className="text-2xl font-black font-serif text-[#333333] mb-4 group-hover:text-[#3E4C37] transition-colors relative z-10">{cat.title}</h3>
                                <p className="text-gray-500 text-lg leading-relaxed font-medium relative z-10">{cat.desc}</p>

                                <div className="mt-8 flex items-center text-[#3E4C37] font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 relative z-10">
                                    View Creators
                                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
