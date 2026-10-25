'use client'

import { useEffect } from 'react'

// Marks [data-reveal] / [data-grow] elements as they scroll into view.
// The hiding CSS only applies under .js-reveal, so the page is fully visible without JS.
export default function Reveal() {
    useEffect(() => {
        const root = document.documentElement
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const targets = document.querySelectorAll('[data-reveal], [data-grow]')
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in')
                    io.unobserve(e.target)
                }
            }),
            { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
        )
        targets.forEach((t) => io.observe(t))
        root.classList.add('js-reveal')
        return () => {
            io.disconnect()
            root.classList.remove('js-reveal')
        }
    }, [])
    return null
}
