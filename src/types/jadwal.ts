// src/types/jadwal.ts
// src/types/jadwal.ts
import type { Database } from './database'

export type Jadwal = Database['public']['Tables']['jadwal']['Row']
export type JadwalInsert = Database['public']['Tables']['jadwal']['Insert']
export type JadwalUpdate = Database['public']['Tables']['jadwal']['Update']

export type SessionType = 'lecture' | 'practice' | 'exam' | 'consultation'
export type RecurringType = 'none' | 'weekly' | 'monthly'
export type JadwalStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'

export interface JadwalWithDetails extends Jadwal {
  mata_kuliah?: Database['public']['Tables']['mata_kuliah']['Row']
  laboratory?: Database['public']['Tables']['laboratories']['Row']
  dosen?: Database['public']['Tables']['users_profile']['Row']
}

export interface JadwalFilters {
  date?: string
  laboratoryId?: string
  dosenId?: string
  status?: JadwalStatus
  mataKuliahId?: string
}
