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
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-all relative"
            >
                <Bell className="w-5 h-5 text-[#333333]" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#E6E2D6] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-[#E6E2D6] flex justify-between items-center bg-[#F3F0E9]/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#333333]">Notifications</h3>
                            <button
                                onClick={() => { fetchNotifications() }}
                                disabled={isLoading}
                                className={`p-1 hover:bg-black/5 rounded-full transition-all ${isLoading ? 'animate-spin opacity-50' : ''}`}
                                title="Refresh"
                            >
                                <RefreshCw className="w-3 h-3 text-gray-400" />
                            </button>
                        </div>
                        <div className="flex flex-col items-end">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-[10px] text-[#3E4C37] font-medium hover:underline">
                                    Mark all read
                                </button>
                            )}
                            <span className="text-[8px] text-gray-300 font-mono mt-0.5">ID: {userId.substring(0, 8)}...</span>
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
                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 ${!notif.is_read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!notif.is_read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                        <div>
                                            <p className={`text-sm ${!notif.is_read ? 'font-semibold text-[#333333]' : 'text-gray-600'}`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
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
