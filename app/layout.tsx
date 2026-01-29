'use client'

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
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-white text-dark-gray selection:bg-[#BAE6FD] selection:text-black`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
