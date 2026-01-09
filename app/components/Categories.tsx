'use client'

import { categories } from '../data/categories'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react' // Assuming lucide-react is installed for the ArrowRight icon

export default function Categories() {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="px-6 py-32 max-w-7xl mx-auto bg-[#F8F7F2]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20 text-center"
            >
                <h2 className="text-4xl md:text-6xl font-serif font-black text-[#3E4C37] mb-6 uppercase tracking-tighter">Academic Disciplines</h2>
                <div className="w-24 h-1 bg-[#C6A87C] mx-auto mb-6" />
                <p className="text-[#333333]/60 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
                    Select a field of study to collaborate with specialized campus experts.
                </p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                        }}
                    >
                        <Link
                            href={`/category/${cat.slug}`}
                            className="block group touch-manipulation transition-all duration-300 h-full border-t-4 border-[#3E4C37]"
                        >
                            <div className="bg-white p-12 rounded-none border border-[#EBE7DE] border-t-0 shadow-sm transition-all duration-500 h-full flex flex-col items-center text-center cursor-pointer relative overflow-hidden">
                                <div className="w-20 h-20 bg-[#F3F0E9] rounded-none flex items-center justify-center mb-8 text-[#3E4C37] group-hover:bg-[#3E4C37] group-hover:text-white transition-all duration-500 border border-[#EBE7DE]">
                                    <cat.icon className="w-10 h-10 transition-transform group-hover:scale-110" />
                                </div>

                                <h3 className="text-2xl font-black font-serif text-[#333333] mb-4 uppercase tracking-tight group-hover:text-[#3E4C37] transition-colors">{cat.title}</h3>
                                <p className="text-gray-500 text-lg leading-relaxed font-medium mb-8">{cat.desc}</p>

                                <div className="mt-auto pt-6 border-t border-[#F3F0E9] w-full flex items-center justify-center text-[#3E4C37] font-black text-sm uppercase tracking-[0.3em] group-hover:bg-[#F3F0E9] py-3 transition-all duration-300">
                                    Explore Expertise
                                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
