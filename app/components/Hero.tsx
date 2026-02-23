'use client'

import { useEffect, useRef, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment, Torus } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import confetti from 'canvas-confetti'

// NEW: Kinetic Sculpture Component - OVERHAULED FOR PREMIUM "NICER" BUBBLES
function KineticSculpture() {
    const meshRef = useRef<THREE.Group>(null)
    const { mouse, viewport } = useThree()

    useFrame((state) => {
        if (!meshRef.current) return

        // Very subtle drift
        meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05
        meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.15) * 0.05

        // Magnetic mouse reaction
        const targetX = (mouse.x * viewport.width) / 15
        const targetY = (mouse.y * viewport.height) / 15
        meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05
    })

    return (
        <group ref={meshRef}>
            {/* Scattered Glass & Liquid Bubbles */}
            {Array.from({ length: 45 }).map((_, i) => {
                const randomPos: [number, number, number] = [
                    (Math.random() - 0.5) * 25,
                    (Math.random() - 0.5) * 25,
                    (Math.random() - 0.5) * 15
                ]
                const size = Math.random() * 0.4 + 0.1
                const speed = 0.5 + Math.random() * 2

                return (
                    <Float key={i} speed={speed} rotationIntensity={1} floatIntensity={1} position={randomPos}>
                        <mesh rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                            <sphereGeometry args={[size, 64, 64]} />
                            {i % 4 === 0 ? (
                                <MeshDistortMaterial
                                    color="#0EA5E9"
                                    speed={speed}
                                    distort={0.4}
                                    radius={1}
                                    transparent
                                    opacity={0.15}
                                />
                            ) : (
                                <meshPhysicalMaterial
                                    color={i % 2 === 0 ? "#F0F9FF" : "#FFFFFF"}
                                    transparent
                                    opacity={0.4}
                                    metalness={0.1}
                                    roughness={0}
                                    transmission={1}
                                    thickness={1.5}
                                    ior={1.4}
                                />
                            )}
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
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#0EA5E9" />
            <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" castShadow />
            <directionalLight position={[0, -5, 5]} intensity={0.5} color="#BAE6FD" />
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

            {/* 3D Canvas Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
                    <Suspense fallback={null}>
                        <Scene />
                        <Environment preset="studio" />
                    </Suspense>
                </Canvas>
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
                            <span className="block font-serif italic text-[14vw] md:text-[13rem] text-[#0EA5E9] leading-none tracking-tighter -mt-4 md:-mt-8">
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
                    <p className="text-[#1E293B]/60 text-lg md:text-2xl font-medium leading-relaxed">
                        Connecting <span className="text-[#1E293B] font-bold">elite independent talent</span> with creative visionaries. The definitive ecosystem for projects that matter.
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
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0EA5E9]/50">Scroll</div>
                <div className="w-px h-16 bg-gradient-to-b from-[#0EA5E9] to-transparent" />
            </motion.div>
        </section>
    )
}
