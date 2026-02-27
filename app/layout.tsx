'use client'

import { Toaster } from "sonner";
import { Inter, Geist_Mono, Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} ${outfit.variable} ${instrumentSerif.variable} antialiased bg-white text-dark-gray selection:bg-[#BAE6FD] selection:text-black`}
      >
        <NextTopLoader
          color="#0EA5E9"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0EA5E9,0 0 5px #0EA5E9"
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
