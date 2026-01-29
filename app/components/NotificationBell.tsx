'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, CheckCircle, Info, AlertTriangle, RefreshCw } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Notification = {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    link: string | null
    is_read: boolean
    created_at: string
}

// Create a stable client outside the component
const supabase = createClient()

export default function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const bellRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const fetchNotifications = useCallback(async () => {
        if (!userId) return
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(10)

            if (error) throw error

            if (data) {
                setNotifications(data as Notification[])
                setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
            }
        } catch (err) {
            console.error('Fetch notifications error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [userId, supabase])

    useEffect(() => {
        fetchNotifications()

        // Realtime Subscription
        const channel = supabase
            .channel(`notifications-${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                const newNotif = payload.new as Notification
                setNotifications(prev => [newNotif, ...prev])
                setUnreadCount(prev => prev + 1)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, supabase, fetchNotifications])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkAsRead = async (id: string, link: string | null) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))

        await supabase.from('notifications').update({ is_read: true }).eq('id', id)

        if (link) {
            setIsOpen(false)
            router.push(link)
        }
    }

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId)
    }

    return (
        <div className="relative" ref={bellRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-2xl border border-sky-100 hover:bg-sky-50 active:scale-95 transition-all relative text-[#0EA5E9] shadow-sm bg-white flex items-center justify-center touch-manipulation"
                aria-label="Open Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0EA5E9] rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-[2rem] shadow-2xl border border-sky-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-6 border-b border-sky-50 flex justify-between items-center bg-sky-50/30">
                        <div className="flex items-center gap-3">
                            <h3 className="font-serif font-black text-slate-900 uppercase tracking-tight">Intelligence</h3>
                            <button
                                onClick={() => { fetchNotifications() }}
                                disabled={isLoading}
                                className={`p-2 hover:bg-sky-100 rounded-full transition-all ${isLoading ? 'animate-spin opacity-50' : ''}`}
                                title="Refresh"
                            >
                                <RefreshCw className="w-4 h-4 text-[#0EA5E9]" />
                            </button>
                        </div>
                        <div className="flex flex-col items-end">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-[10px] text-[#0EA5E9] font-black uppercase tracking-widest hover:underline">
                                    Purge Alerts
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                No notifications yet
                            </div>
                        ) : (
                            <div>
                                {notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleMarkAsRead(notif.id, notif.link)}
                                        className={`p-6 border-b border-sky-50 hover:bg-sky-50/50 cursor-pointer transition-colors flex items-start gap-4 ${!notif.is_read ? 'bg-sky-50/30' : ''}`}
                                    >
                                        <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!notif.is_read ? 'bg-[#0EA5E9] shadow-sm shadow-sky-500' : 'bg-slate-200'}`}></div>
                                        <div className="flex-1">
                                            <p className={`text-sm leading-snug ${!notif.is_read ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                <div className="w-1 h-1 bg-sky-200 rounded-full" />
                                                {new Date(notif.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
