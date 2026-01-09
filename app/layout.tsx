'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { Toaster } from "sonner";
import { Inter, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-[#F8F7F2] text-[#333333] selection:bg-[#3E4C37] selection:text-white`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
