'use client'

import { CheckCircle, Circle, ChevronDown, Edit2 } from 'lucide-react'

interface Props {
    title: string
    summary?: React.ReactNode
    isOpen: boolean
    isCompleted: boolean
    onToggle: () => void
    children: React.ReactNode
}

export default function ProfileSection({ title, summary, isOpen, isCompleted, onToggle, children }: Props) {
    return (
        <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#0EA5E9] shadow-md ring-1 ring-[#0EA5E9]/10' : 'border-[#F0F9FF] shadow-sm'
            }`}>
            {/* Header / Summary */}
            <div
                onClick={onToggle}
                className={`p-6 md:p-8 flex items-start md:items-center justify-between cursor-pointer group ${isOpen ? 'border-b border-[#F0F9FF]' : ''
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : <Circle className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                    <div>
                        <h2 className={`text-xl md:text-2xl font-serif font-bold transition-colors ${isOpen ? 'text-[#0EA5E9]' : 'text-[#1E293B]'
                            }`}>
                            {title}
                        </h2>
                        {!isOpen && summary && (
                            <div className="text-gray-500 text-sm md:text-base mt-1 font-medium">
                                {summary}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isOpen && isCompleted && (
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-[#0EA5E9] transition-colors flex items-center">
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                        </span>
                    )}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Content Body */}
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                <div className="p-6 md:p-8 pt-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
