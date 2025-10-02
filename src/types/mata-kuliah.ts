// src/types/mata-kuliah.ts
import { type Database } from './database'

export type MataKuliah = Database['public']['Tables']['mata_kuliah']['Row']
export type MataKuliahInsert =
  Database['public']['Tables']['mata_kuliah']['Insert']
export type MataKuliahUpdate =
  Database['public']['Tables']['mata_kuliah']['Update']

export interface MataKuliahWithDetails extends MataKuliah {
  dosen?: Database['public']['Tables']['users_profile']['Row']
  laboratory?: Database['public']['Tables']['laboratories']['Row']
  enrolled_count?: number
}

export interface CourseFilters {
  semester?: number
  dosenId?: string
  isActive?: boolean
  search?: string
}
