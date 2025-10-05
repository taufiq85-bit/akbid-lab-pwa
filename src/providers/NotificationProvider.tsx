// src/providers/NotificationProvider.tsx

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { NotificationContext } from '@/context/NotificationContext'
import type { NotificationContextType } from '@/context/NotificationContext'
import type { Notification } from '@/types/common'
import type { Database } from '@/types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Ambil tipe Row dari skema database
type NotificationRow = Database['public']['Tables']['notifications']['Row']

interface NotificationProviderProps {
  children: React.ReactNode
  userId?: string
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function NotificationProvider({
  children,
  userId,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true) // Set initial loading to true

  const fetchNotifications = useCallback(async () => {
    if (!userId || !isValidUUID(userId)) {
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      const mappedNotifications: Notification[] = (data || []).map(
        (n: NotificationRow) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type as Notification['type'],
          read: n.is_read || false,
          createdAt: n.created_at,
        })
      )

      setNotifications(mappedNotifications)
      setUnreadCount(mappedNotifications.filter((n) => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Gagal memuat notifikasi')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const markAsRead = useCallback(
    async (id: string) => {
      if (!userId || !isValidUUID(userId)) return
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() } as never)
          .eq('id', id)
          .eq('user_id', userId)

        if (error) throw error

        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error('Error marking as read:', error)
        toast.error('Gagal memperbarui notifikasi')
      }
    },
    [userId]
  )

  const markAllAsRead = useCallback(async () => {
    if (!userId || !isValidUUID(userId)) return
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() } as never)
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success('Semua notifikasi ditandai terbaca')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Gagal memperbarui notifikasi')
    }
  }, [userId])

  const deleteNotification = useCallback(
    async (id: string) => {
      if (!userId || !isValidUUID(userId)) return
      try {
        await supabase
          .from('notifications')
          .delete()
          .eq('id', id)
          .eq('user_id', userId)
        setNotifications((prev) => {
          const updated = prev.filter((n) => n.id !== id)
          setUnreadCount(updated.filter((n) => !n.read).length)
          return updated
        })
        toast.success('Notifikasi dihapus')
      } catch (error) {
        console.error('Error deleting notification:', error)
        toast.error('Gagal menghapus notifikasi')
      }
    },
    [userId]
  )

  const clearAll = useCallback(async () => {
    if (!userId || !isValidUUID(userId)) return
    try {
      await supabase.from('notifications').delete().eq('user_id', userId)
      setNotifications([])
      setUnreadCount(0)
      toast.success('Semua notifikasi dihapus')
    } catch (error) {
      console.error('Error clearing notifications:', error)
      toast.error('Gagal menghapus notifikasi')
    }
  }, [userId])

  const showNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
      if (!userId || !isValidUUID(userId)) return

      const newDbNotification = {
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(supabase.from('notifications').insert as any)(newDbNotification).then(
        ({ error }: { error: any }) => {
          if (error) {
            console.error('Error sending notification:', error)
            toast.error('Gagal mengirim notifikasi')
          }
        }
      )
    },
    [userId]
  )

  useEffect(() => {
    if (userId) {
      fetchNotifications()
    }
  }, [userId, fetchNotifications])

  useEffect(() => {
    if (!userId || !isValidUUID(userId)) return

    const channel = supabase
      .channel(`notifications-channel-for-${userId}`)
      .on<NotificationRow>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<NotificationRow>) => {
          if (!('id' in payload.new)) return

          const data = payload.new
          const newNotification: Notification = {
            id: data.id,
            title: data.title,
            message: data.message,
            type: data.type as Notification['type'],
            read: data.is_read || false,
            createdAt: data.created_at,
          }

          setNotifications((prev) => [newNotification, ...prev])
          if (!newNotification.read) {
            setUnreadCount((prev) => prev + 1)
            toast.info(newNotification.title, {
              description: newNotification.message,
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    showNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
