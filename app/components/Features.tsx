
import Link from 'next/link'

interface FeaturesProps {
    hideCta?: boolean
}

export default function Features({ hideCta = false }: FeaturesProps) {
    return (
        <section className="px-6 py-20 max-w-5xl mx-auto">
            <h2 className="font-sans font-semibold text-4xl md:text-5xl text-[#3E4C37] mb-16 leading-tight">
                Make it all happen with <br /> creators
            </h2>

            <div className="space-y-16">
                <div className="flex items-center group">
                    <div className="w-14 h-14 rounded-2xl bg-[#F3F0E9] flex items-center justify-center mr-8 shrink-0 shadow-sm border border-[#EBE7DE] group-hover:bg-[#EBE7DE] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3E4C37]">
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="hidden">Access top-talented creators</h3>
                        <p className="text-xl md:text-2xl font-sans font-normal text-[#333333] leading-snug">Access top-talented creators.</p>
                    </div>
                </div>

                <div className="flex items-center group">
                    <div className="w-14 h-14 rounded-2xl bg-[#F3F0E9] flex items-center justify-center mr-8 shrink-0 shadow-sm border border-[#EBE7DE] group-hover:bg-[#EBE7DE] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3E4C37]">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="hidden">Match easily with the right expert for your task</h3>
                        <p className="text-xl md:text-2xl font-sans font-normal text-[#333333] leading-snug">Match easily with the right expert for your task.</p>
                    </div>
                </div>

                <div className="flex items-center group">
                    <div className="w-14 h-14 rounded-2xl bg-[#F3F0E9] flex items-center justify-center mr-8 shrink-0 shadow-sm border border-[#EBE7DE] group-hover:bg-[#EBE7DE] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3E4C37]">
                            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="hidden">Get high-quality work delivered fast and within budget</h3>
                        <p className="text-xl md:text-2xl font-sans font-normal text-[#333333] leading-snug">Get high-quality work delivered fast and within budget.</p>
                    </div>
                </div>
            </div>

            {!hideCta && (
                <div className="flex flex-col sm:flex-row gap-4 mt-16">
                    <Link
                        href="/join"
                        className="bg-[#4B4B4B] text-white px-8 py-3 rounded-full text-lg hover:bg-black transition-colors"
                    >
                        Join now
                    </Link>
                </div>
            )}
        </section>
    )
}
