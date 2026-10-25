import { Anton, Fraunces, Manrope, Reem_Kufi, Unbounded } from 'next/font/google'

// Each exhibition "world" gets its own typography; Inter, Instrument Serif and Geist Mono come from the root layout.
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', style: ['normal', 'italic'], axes: ['opsz'] })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded' })
const anton = Anton({ subsets: ['latin'], variable: '--font-anton', weight: '400' })
const reemKufi = Reem_Kufi({ subsets: ['arabic', 'latin'], variable: '--font-kufi' })

export const landingFonts = [fraunces, manrope, unbounded, anton, reemKufi].map((f) => f.variable).join(' ')
