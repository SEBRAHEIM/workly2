'use client'

import { useEffect } from 'react'

/**
 * Writes the element's scroll progress (0 → 1) into the CSS variable --p, without re-rendering.
 * "sticky": progress across a tall wrapper whose child is position: sticky.
 * "pass": progress while the element travels from entering the viewport to leaving it.
 * Reduced motion pins --p to 1, the resting (fully revealed) state; CSS defaults to 1 too, so no-JS views are complete.
 */
export function useScrollVar(
    ref: React.RefObject<HTMLElement | null>,
    mode: 'sticky' | 'pass' = 'sticky',
    onProgress?: (p: number) => void,
) {
    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.style.setProperty('--p', '1')
            onProgress?.(1)
            return
        }
        let raf = 0
        const update = () => {
            raf = 0
            const r = el.getBoundingClientRect()
            const vh = window.innerHeight
            const p = mode === 'sticky'
                ? -r.top / Math.max(1, r.height - vh)
                : (vh - r.top) / (vh + r.height)
            const clamped = Math.min(1, Math.max(0, p))
            el.style.setProperty('--p', clamped.toFixed(4))
            onProgress?.(clamped)
        }
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [ref, mode, onProgress])
}
