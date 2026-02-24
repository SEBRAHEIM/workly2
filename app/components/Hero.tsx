'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
    hideCta?: boolean
    title?: string
    subtitle?: string
}

export default function Hero({
    hideCta = false,
    title = "Workly.",
    subtitle = "Creative."
}: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

    useEffect(() => {
        if (titleRef.current) {
            gsap.fromTo(titleRef.current.children,
                { opacity: 0, scale: 0.95, y: 40 },
                { opacity: 1, scale: 1, y: 0, stagger: 0.2, duration: 1.5, ease: "power4.out", delay: 0.2 }
            )
        }
    }, [])

    return (
        <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Sophisticated Gradient Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#F0F9FF_0%,_#FFFFFF_100%)]" />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#BAE6FD]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#0EA5E9]/5 blur-[120px] rounded-full animate-pulse" />
            </div>

            {/* Subtle Grid Accent */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#0EA5E9 1px, transparent 1px), linear-gradient(90deg, #0EA5E9 1px, transparent 1px)', backgroundSize: '100px 100px' }}
            />

            <motion.div
                style={{ y, opacity }}
                className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center select-none"
            >
                {/* Headline: WORKLY. CREATIVE. */}
                {(title || subtitle) && (
                    <h1 ref={titleRef} className="mb-12 flex flex-col items-center">
                        {title && (
                            <span className="block font-sans font-black text-[15vw] md:text-[14rem] text-[#1E293B] leading-none tracking-tight transition-all duration-700 hover:tracking-normal cursor-default">
                                {title}
                            </span>
                        )}
                        {subtitle && (
                            <span className="block font-sans font-black text-[14vw] md:text-[13rem] text-[#0EA5E9] leading-none tracking-tighter -mt-4 md:-mt-8">
                                {subtitle}
                            </span>
                        )}
                    </h1>
                )}

                {/* Subtext with Group Vision */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 1 }}
                    className="max-w-2xl px-4"
                >
                    <p className="text-[#1E293B]/80 text-lg md:text-2xl font-bold leading-relaxed">
                        Connecting <span className="text-[#1E293B] font-black">elite independent talent</span> with creative visionaries. The definitive ecosystem for projects that matter.
                    </p>
                </motion.div>
            </motion.div>

            {/* Modern Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
            >
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0EA5E9]">Scroll</div>
                <div className="w-px h-16 bg-gradient-to-b from-[#0EA5E9] to-transparent" />
            </motion.div>
        </section>
    )
}
