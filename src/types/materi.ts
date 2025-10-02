// src/types/materi.ts
import { type Database } from './database'

export type Materi = Database['public']['Tables']['materi']['Row']
export type MateriInsert = Database['public']['Tables']['materi']['Insert']
export type MateriUpdate = Database['public']['Tables']['materi']['Update']

export type ContentType = 'pdf' | 'video' | 'document' | 'link'

export interface MateriWithCourse extends Materi {
  mata_kuliah?: Database['public']['Tables']['mata_kuliah']['Row']
  uploader?: Database['public']['Tables']['users_profile']['Row']
}

export interface MateriFilters {
  mataKuliahId?: string
  contentType?: ContentType
  isRequired?: boolean
  search?: string
}
