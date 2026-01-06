'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Placeholder from '@tiptap/extension-placeholder'
import {
    List,
    Check,
    ArrowRight,
    AlertCircle,
    Info,
    ShieldCheck,
    Bold as BoldIcon,
    Italic as ItalicIcon,
    FileText,
    Clock,
    Target,
} from 'lucide-react'
import { useEffect } from 'react'

interface FormattedTextareaProps {
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    rows?: number
    className?: string
}

export default function FormattedTextarea({
    value,
    onChange,
    label,
    placeholder = 'Start typing...',
    className = ''
}: FormattedTextareaProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                code: false,
                codeBlock: false,
            }),
            Markdown,
            Placeholder.configure({
                placeholder: placeholder,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            // Get markdown output
            const markdown = (editor.storage as any).markdown.getMarkdown()
            onChange(markdown)
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none max-w-none min-h-[150px] p-4 text-sm text-[#333] leading-relaxed',
            },
        },
    })

    // Sync external value changes (like presets)
    useEffect(() => {
        if (editor && value !== (editor.storage as any).markdown.getMarkdown()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    const tools = [
        {
            icon: BoldIcon,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
            label: 'Bold'
        },
        {
            icon: ItalicIcon,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
            label: 'Italic'
        },
        {
            icon: List,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
            label: 'Bullet Point'
        },
    ]

    const insertIcon = (symbol: string) => {
        editor.chain().focus().insertContent(symbol).run()
    }

    const iconTools = [
        { icon: Check, action: () => insertIcon('✅ '), label: 'Checkmark' },
        { icon: ArrowRight, action: () => insertIcon('→ '), label: 'Arrow' },
        { icon: ShieldCheck, action: () => insertIcon('🛡️ '), label: 'Guarantee' },
        { icon: FileText, action: () => insertIcon('📄 '), label: 'Deliverable' },
        { icon: Clock, action: () => insertIcon('🕒 '), label: 'Timeline' },
        { icon: Target, action: () => insertIcon('🎯 '), label: 'Milestone' },
        { icon: AlertCircle, action: () => insertIcon('⚠️ '), label: 'Note' },
    ]

    const presets = [
        {
            name: 'Deliverables',
            content: '\n\n**WHAT YOU WILL GET:**\n• Item 1\n• Item 2\n• Item 3'
        },
        {
            name: 'Requirements',
            content: '\n\n**WHAT I NEED FROM YOU:**\n• Requirement 1\n• Requirement 2'
        },
        {
            name: 'Workflow',
            content: '\n\n**MY PROCESS:**\n1. Research → 2. Draft → 3. Final Review'
        }
    ]

    return (
        <div className={className}>
            {label && <label className="block text-xs font-bold text-[#333] mb-1.5">{label}</label>}

            <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3E4C37] focus-within:border-transparent transition-all bg-white shadow-sm">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F9F7F2] border-b border-gray-100">
                    <div className="flex items-center gap-0.5 mr-1">
                        {tools.map((tool, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={tool.action}
                                className={`p-1.5 rounded-lg transition-all hover:shadow-sm ${tool.isActive ? 'bg-white text-[#3E4C37] shadow-sm' : 'text-gray-500 hover:text-[#3E4C37] hover:bg-white'}`}
                                title={tool.label}
                            >
                                <tool.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-4 bg-gray-300 mx-1" />

                    <div className="flex items-center gap-0.5">
                        {iconTools.map((tool, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={tool.action}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#3E4C37] hover:bg-white transition-all hover:shadow-sm"
                                title={tool.label}
                            >
                                <tool.icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-4 bg-gray-300 mx-1 hidden md:block" />

                    <div className="flex items-center gap-1 ml-auto">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mr-1 opacity-60">Presets:</span>
                        {presets.map((preset, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => editor.chain().focus().insertContent(preset.content).run()}
                                className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[9px] font-bold text-gray-500 hover:border-[#3E4C37] hover:text-[#3E4C37] transition-all"
                            >
                                + {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="bg-transparent overflow-y-auto">
                    <EditorContent editor={editor} />
                </div>
            </div>
            <div className="flex justify-between items-center mt-1.5 px-px">
                <p className="text-[9px] text-gray-400 italic">
                    WYSIWYG Editor: Bold and italic will appear immediately.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                    <Info className="w-3 h-3" />
                    Clean Markdown Output
                </div>
            </div>

            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .tiptap .prose {
                    max-width: none;
                }
                .tiptap .prose p {
                    margin: 0;
                }
                .tiptap:focus {
                    outline: none;
                }
            `}</style>
        </div>
    )
}
