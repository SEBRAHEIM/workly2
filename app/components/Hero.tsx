'use client'

import { useEffect, useRef, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment, Torus } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import confetti from 'canvas-confetti'

// NEW: Kinetic Sculpture Component - REFINED FOR MINIMALIST SCATTERED LOOK
function KineticSculpture() {
    const meshRef = useRef<THREE.Group>(null)
    const { mouse, viewport } = useThree()

    useFrame((state) => {
        if (!meshRef.current) return

        // Subtle rotation for the whole group
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.05
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08

        // Subtle mouse tilt
        const targetX = (mouse.x * viewport.width) / 20
        const targetY = (mouse.y * viewport.height) / 20
        meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02
    })

    return (
        <group ref={meshRef}>
            {/* The Central Subtle Core - Ultra Glassy */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[0, 0, 0]}>
                    <icosahedronGeometry args={[2, 2]} />
                    <meshStandardMaterial
                        color="#0EA5E9"
                        transparent
                        opacity={0.02}
                        wireframe
                    />
                </mesh>
            </Float>

            {/* Scattered Glass Bubbles - Organic and Soft */}
            {Array.from({ length: 60 }).map((_, i) => {
                const randomPos: [number, number, number] = [
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 10
                ]
                const size = Math.random() * 0.2 + 0.05

                return (
                    <Float key={i} speed={Math.random() * 2.5} rotationIntensity={0.5} position={randomPos}>
                        <mesh rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                            <sphereGeometry args={[size, 32, 32]} />
                            <meshPhysicalMaterial
                                color={i % 3 === 0 ? "#BAE6FD" : (i % 3 === 1 ? "#FFFFFF" : "#E0F2FE")}
                                transparent
                                opacity={0.3}
                                metalness={0.05}
                                roughness={0.05}
                                transmission={0.95}
                                thickness={0.5}
                                envMapIntensity={1.5}
                                ior={1.5}
                            />
                        </mesh>
                    </Float>
                )
            })}
        </group>
    )
}

// 3D Scene Component
function Scene() {
    return (
        <>
            <KineticSculpture />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={3} color="#BAE6FD" />
            <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={5} color="#ffffff" castShadow />
            <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
        </>
    )
}

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

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#E0F2FE] via-white to-white" />

            {/* 3D Canvas Layer */}
            <div className="absolute inset-0 z-10 opacity-80">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
                    <Suspense fallback={null}>
                        <Scene />
                        <Environment preset="apartment" />
                    </Suspense>
                </Canvas>
            </div>

            {/* Static Background Accents */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 md:top-20 left-10 md:left-20 border-l-[1px] border-t-[1px] border-[#0EA5E9]/10 w-20 h-20 md:w-40 md:h-40" />
                <div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 border-r-[1px] border-b-[1px] border-[#0EA5E9]/10 w-20 h-20 md:w-40 md:h-40" />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#0EA5E9 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center"
            >
                {/* Headline: WORKLY. CREATIVE. */}
                <h1 ref={titleRef} className="perspective-1000 mb-8 md:mb-12">
                    <span className="block font-serif font-black text-[12vw] sm:text-7xl md:text-[13rem] text-[#1E293B] leading-[0.75] tracking-tighter uppercase transition-colors hover:text-[#0EA5E9]">
                        {title}
                    </span>
                    <span className="block font-serif font-black text-[12vw] sm:text-7xl md:text-[13rem] text-[#0EA5E9] leading-[0.75] tracking-tighter uppercase mt-2 md:mt-4">
                        {subtitle}
                    </span>
                </h1>

                {/* Subtext with Group Vision */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12 md:mb-16 max-w-4xl"
                >
                    <div className="h-[1px] w-12 md:w-24 bg-[#0EA5E9] hidden sm:block" />
                    <p className="text-[#1E293B]/70 text-base sm:text-lg md:text-2xl font-medium leading-relaxed md:text-left flex-1 px-4 md:px-0">
                        The definitive ecosystem for <span className="text-[#0EA5E9] font-black border-b-2 md:border-b-4 border-[#0EA5E9] pb-1 transition-all hover:text-[#1E293B] hover:border-[#1E293B]">independent talent</span> and creative visionaries. Linking elite freelancers with projects that matter.
                    </p>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity z-20"
            >
                <div className="w-[1px] h-12 bg-[#0EA5E9]" />
                <span className="text-[10px] font-black uppercase tracking-widest mt-3 text-[#0EA5E9] vertical-text">Experience</span>
            </motion.div>
        </section>
    )
}
