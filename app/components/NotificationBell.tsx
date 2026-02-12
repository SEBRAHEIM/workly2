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
                className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all relative text-slate-600 bg-white flex items-center justify-center touch-manipulation"
                aria-label="Open Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0EA5E9] rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Notifications</h3>
                            <button
                                onClick={() => { fetchNotifications() }}
                                disabled={isLoading}
                                className={`p-1.5 hover:bg-slate-200 rounded-lg transition-all ${isLoading ? 'animate-spin opacity-50' : ''}`}
                                title="Refresh"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                        </div>
                        <div className="flex flex-col items-end">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-[9px] text-[#0EA5E9] font-bold uppercase tracking-widest hover:underline">
                                    Mark all read
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
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors flex items-start gap-3 ${!notif.is_read ? 'bg-slate-50/30' : ''}`}
                                    >
                                        <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!notif.is_read ? 'bg-[#0EA5E9]' : 'bg-slate-200'}`}></div>
                                        <div className="flex-1">
                                            <p className={`text-xs leading-normal ${!notif.is_read ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1.5 flex items-center gap-2">
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
