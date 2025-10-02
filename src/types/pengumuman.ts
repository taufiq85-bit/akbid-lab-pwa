// src/types/pengumuman.ts
// src/types/pengumuman.ts
import type { Database } from './database'

export type Pengumuman = Database['public']['Tables']['pengumuman']['Row']
export type PengumumanInsert =
  Database['public']['Tables']['pengumuman']['Insert']
export type PengumumanUpdate =
  Database['public']['Tables']['pengumuman']['Update']

export type AnnouncementType = 'general' | 'urgent' | 'maintenance' | 'academic'

export interface PengumumanWithAuthor extends Pengumuman {
  author?: Database['public']['Tables']['users_profile']['Row']
}

export interface PengumumanFilters {
  type?: AnnouncementType
  targetRole?: string
  isActive?: boolean
  search?: string
}
