'use client'

import React from 'react'

export default function AEDIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Stylized D with two bars - Filling more of the box */}
            <path d="M5 3h7a8 8 0 0 1 0 16H5V3Z" />
            <path d="M2 8h13" />
            <path d="M2 13h13" />
        </svg>
    )
}
