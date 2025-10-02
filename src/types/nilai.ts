// src/types/nilai.ts
import { type Database } from './database'

export type Nilai = Database['public']['Tables']['nilai']['Row']
export type NilaiInsert = Database['public']['Tables']['nilai']['Insert']
export type NilaiUpdate = Database['public']['Tables']['nilai']['Update']

export type AssessmentType =
  | 'quiz'
  | 'midterm'
  | 'final'
  | 'assignment'
  | 'practice'
export type LetterGrade = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E'

export interface NilaiWithDetails extends Nilai {
  student?: Database['public']['Tables']['users_profile']['Row']
  mata_kuliah?: Database['public']['Tables']['mata_kuliah']['Row']
  grader?: Database['public']['Tables']['users_profile']['Row']
}

export interface GradeStatistics {
  average: number
  highest: number
  lowest: number
  passed: number
  failed: number
  distribution: Record<LetterGrade, number>
}
