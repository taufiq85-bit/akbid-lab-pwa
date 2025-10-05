// src/context/NotificationContext.tsx
import { createContext } from 'react'
import type { Notification } from '@/types/common'

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  clearAll: () => Promise<void>
  showNotification: (
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ) => void
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined)
