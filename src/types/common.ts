// src/types/common.ts

// 👇 1. Impor tipe Database Anda (pastikan path './database' sudah benar)
import type { Database } from './database'

// 👇 2. Buat tipe turunan untuk jenis notifikasi dari skema database
type NotificationType =
  Database['public']['Tables']['notifications']['Row']['type']

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface TimeSlot {
  start: string // HH:mm
  end: string // HH:mm
}

export interface FileUpload {
  file: File
  preview?: string
  progress?: number
  error?: string
  uploaded?: boolean
  url?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  // 👇 3. Ganti tipe lama dengan tipe turunan yang baru
  type: NotificationType
  read: boolean
  createdAt: string
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

export interface FormState {
  isLoading: boolean
  error: string | null
  success: boolean
}

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export interface ToastMessage {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export type Status =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'in_progress'

export type Priority = 'low' | 'normal' | 'high' | 'urgent'
