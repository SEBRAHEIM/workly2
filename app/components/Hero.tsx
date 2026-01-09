'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import { Sparkles, GraduationCap, ArrowRight, Zap } from 'lucide-react'

// 3D Scene Component
function Scene() {
    return (
        <group>
            <Float speed={1.4} rotationIntensity={1.5} floatIntensity={2}>
                <mesh position={[-2, 1, 0]} rotation={[0.4, 0.2, 0.5]}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#3E4C37" wireframe />
                </mesh>
            </Float>
            <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
                <Sphere args={[1, 100, 100]} position={[2, -1, -2]}>
                    <MeshDistortMaterial
                        color="#C6A87C"
                        attach="material"
                        distort={0.4}
                        speed={1.5}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </Sphere>
            </Float>
            <Float speed={1} rotationIntensity={3} floatIntensity={2}>
                <mesh position={[0, -2, 2]} rotation={[Math.PI / 4, 0, 0]}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
            </Float>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        </group>
    )
}

interface HeroProps {
    hideCta?: boolean
}

export default function Hero({ hideCta = false }: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    useEffect(() => {
        if (titleRef.current) {
            gsap.fromTo(titleRef.current.children,
                { opacity: 0, y: 100, rotateX: -90 },
                { opacity: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 1.2, ease: "expo.out", delay: 0.5 }
            )
        }
    }, [])

    const handleJoinClick = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3E4C37', '#C6A87C', '#F3F0E9']
        })
    }

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center bg-[#F8F7F2] overflow-hidden">
            {/* 3D Canvas Layer */}
            <div className="absolute inset-0 z-0 opacity-40">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <Suspense fallback={null}>
                        <Scene />
                        <Environment preset="city" />
                    </Suspense>
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>

            {/* Static Background Accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 border-l-[1px] border-t-[1px] border-[#3E4C37]/30 w-40 h-40" />
                <div className="absolute bottom-20 right-20 border-r-[1px] border-b-[1px] border-[#3E4C37]/30 w-40 h-40" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#3E4C37 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center"
            >
                {/* Micro-Interaction Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="inline-flex items-center space-x-3 bg-white/50 backdrop-blur-2xl border border-[#3E4C37]/10 px-6 py-2.5 rounded-full mb-12 cursor-default group overflow-hidden"
                >
                    <GraduationCap size={18} className="text-[#3E4C37] group-hover:rotate-12 transition-transform" />
                    <span className="text-[#3E4C37] text-xs md:text-sm font-black tracking-[0.4em] uppercase">
                        The Future of Academia
                    </span>
                    <Zap size={16} className="text-[#C6A87C] group-hover:scale-125 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A87C]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.div>

                {/* Headline: WORKLY. GLOBAL. */}
                <h1 ref={titleRef} className="perspective-1000 mb-12">
                    <span className="block font-serif font-black text-7xl md:text-[12rem] text-[#3E4C37] leading-[0.75] tracking-tighter uppercase transition-colors hover:text-[#C6A87C]">
                        Workly.
                    </span>
                    <span className="block font-serif font-black text-7xl md:text-[12rem] text-[#333333] leading-[0.75] tracking-tighter uppercase mt-4">
                        Global.
                    </span>
                </h1>

                {/* Subtext with Global Vision */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="flex flex-col md:flex-row items-center gap-8 mb-16 max-w-4xl"
                >
                    <div className="h-[1px] w-24 bg-[#C6A87C] hidden md:block" />
                    <p className="text-[#333333]/70 text-lg md:text-2xl font-medium leading-relaxed md:text-left flex-1">
                        The definitive ecosystem for <span className="text-[#3E4C37] font-black underline decoration-4 underline-offset-8">elite freelancers</span> and student visionaries. Linking world-class creators with the projects that define the future.
                    </p>
                </motion.div>

                {!hideCta && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-8 items-center"
                    >
                        <motion.button
                            onClick={handleJoinClick}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#3E4C37] text-white px-16 py-8 rounded-none text-xl font-black uppercase tracking-[0.2em] shadow-[12px_12px_0px_0px_#C6A87C] hover:shadow-[4px_4px_0px_0px_#C6A87C] transition-all relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center">
                                Initialize Enrollment
                                <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-[#C6A87C] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>

                        <Link
                            href="/how-it-works"
                            className="text-[#3E4C37] font-black uppercase tracking-widest text-sm border-b-2 border-[#C6A87C] pb-2 hover:text-[#C6A87C] transition-colors"
                        >
                            Technical Methodology
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity"
            >
                <div className="w-[1px] h-12 bg-[#3E4C37]" />
                <span className="text-[10px] font-black uppercase tracking-widest mt-3 vertical-text">Scroll To Experience</span>
            </motion.div>
        </section>
    )
}
