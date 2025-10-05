// src/hooks/useNotifications.ts

import { useContext } from 'react'
import { NotificationContext } from '@/context/NotificationContext' // Pastikan path ini benar

// Custom hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    )
  }
  return context
}
