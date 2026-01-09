'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-sm max-w-none ${className}`} dir="auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
            <style jsx global>{`
                .prose p {
                    margin-bottom: 0.5rem;
                    line-height: 1.6;
                }
                .prose p:last-child {
                    margin-bottom: 0;
                }
                .prose ul {
                    list-style-type: disc;
                    padding-left: 1.25rem;
                    margin-bottom: 1rem;
                }
                .prose li {
                    margin-bottom: 0.25rem;
                }
                .prose strong {
                    font-weight: 700;
                    color: inherit;
                }
                .prose em {
                    font-style: italic;
                    color: inherit;
                }
            `}</style>
        </div>
    )
}
