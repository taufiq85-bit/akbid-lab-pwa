// src/types/peminjaman.ts
// src/types/peminjaman.ts
import type { Database } from './database'

export type Peminjaman = Database['public']['Tables']['peminjaman']['Row']
export type PeminjamanInsert =
  Database['public']['Tables']['peminjaman']['Insert']
export type PeminjamanUpdate =
  Database['public']['Tables']['peminjaman']['Update']

export type Booking = Database['public']['Tables']['booking']['Row']
export type BookingInsert = Database['public']['Tables']['booking']['Insert']
export type BookingUpdate = Database['public']['Tables']['booking']['Update']

export type PeminjamanStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
export type BookingStatus = 'confirmed' | 'in_use' | 'completed' | 'cancelled'

export interface PeminjamanWithDetails extends Peminjaman {
  requester?: Database['public']['Tables']['users_profile']['Row']
  laboratory?: Database['public']['Tables']['laboratories']['Row']
  mata_kuliah?: Database['public']['Tables']['mata_kuliah']['Row']
  booking?: Booking
}

export interface BookingRequest {
  laboratoryId: string
  requestedDate: string
  startTime: string
  endTime: string
  purpose: string
  equipmentNeeded?: string[]
  participantCount?: number
  mataKuliahId?: string
}
