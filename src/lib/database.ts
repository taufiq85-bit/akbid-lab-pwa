// src/lib/database.ts

import { supabase } from './supabase'
import type {
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// Generic CRUD helpers with proper typing
export class DatabaseService<
  T extends Record<string, unknown> & { id: string },
> {
  private tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  // Get all records with pagination
  async getAll(
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc',
      } = params || {}

      let query = supabase.from(this.tableName).select('*', { count: 'exact' })

      // Add search if provided
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      // Add sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Add pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return {
          status: 400,
          success: false,
          error: { code: error.code, message: error.message },
        }
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return {
        status: 200,
        success: true,
        data: {
          items: (data as T[]) || [],
          total: count || 0,
          page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        status: 500,
        success: false,
        error: { code: 'INTERNAL_ERROR', message: errorMessage },
      }
    }
  }

  // Get single record by ID
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return {
          status: 404,
          success: false,
          error: { code: error.code, message: error.message },
        }
      }

      return {
        status: 200,
        success: true,
        data: data as T,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        status: 500,
        success: false,
        error: { code: 'INTERNAL_ERROR', message: errorMessage },
      }
    }
  }

  // Create new record - using a more flexible approach
  async create(
    payload: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<T>> {
    try {
      // Use type assertion for the entire query chain
      const { data, error } = await (supabase
        .from(this.tableName)
        .insert(payload as never)
        .select()
        .single() as unknown as Promise<{
        data: T | null
        error: Error | null
      }>)

      if (error) {
        return {
          status: 400,
          success: false,
          error: {
            code: 'code' in error ? String(error.code) : 'UNKNOWN',
            message: error.message,
          },
        }
      }

      if (!data) {
        return {
          status: 400,
          success: false,
          error: { code: 'NO_DATA', message: 'No data returned after insert' },
        }
      }

      return {
        status: 201,
        success: true,
        data,
        message: 'Record created successfully',
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        status: 500,
        success: false,
        error: { code: 'INTERNAL_ERROR', message: errorMessage },
      }
    }
  }

  // Update record
  async update(
    id: string,
    payload: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<ApiResponse<T>> {
    try {
      // Use type assertion for the entire query chain
      const { data, error } = await (supabase
        .from(this.tableName)
        .update(payload as never)
        .eq('id', id)
        .select()
        .single() as unknown as Promise<{
        data: T | null
        error: Error | null
      }>)

      if (error) {
        return {
          status: 400,
          success: false,
          error: {
            code: 'code' in error ? String(error.code) : 'UNKNOWN',
            message: error.message,
          },
        }
      }

      if (!data) {
        return {
          status: 400,
          success: false,
          error: { code: 'NO_DATA', message: 'No data returned after update' },
        }
      }

      return {
        status: 200,
        success: true,
        data,
        message: 'Record updated successfully',
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        status: 500,
        success: false,
        error: { code: 'INTERNAL_ERROR', message: errorMessage },
      }
    }
  }

  // Delete record
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) {
        return {
          status: 400,
          success: false,
          error: { code: error.code, message: error.message },
        }
      }

      return {
        status: 200,
        success: true,
        message: 'Record deleted successfully',
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        status: 500,
        success: false,
        error: { code: 'INTERNAL_ERROR', message: errorMessage },
      }
    }
  }

  // Batch operations
  async createMany(
    payloads: Array<Omit<T, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<ApiResponse<T[]>> {
    try {
      // Use type assertion for the entire query chain
      const { data, error } = await (supabase
        .from(this.tableName)
        .insert(payloads as never)
        .select() as unknown as Promise<{
        data: T[] | null
        error: Error | null
      }>)

      if (error) {
        return {
          status: 400,
          success: false,
          error: {
            code: 'code' in error ? String(error.code) : 'UNKNOWN',
            message: error.message,
          },
        }
      }

      return {
        status: 201,
        success: true,
        data: data || [],
        message: `${data?.length || 0} records created successfully`,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        status: 500,
        success: false,
        error: { code: 'INTERNAL_ERROR', message: errorMessage },
      }
    }
  }

  // Custom query builder
  query() {
    return supabase.from(this.tableName)
  }
}

// Specific database services with proper typing
import type {
  User,
  Laboratory,
  Equipment,
  MataKuliah,
  Jadwal,
  Kuis,
  Peminjaman,
  Nilai,
} from '@/types'

// Create services with proper base types
export const userService = new DatabaseService<User>('users_profile')
export const laboratoryService = new DatabaseService<Laboratory>('laboratories')
export const equipmentService = new DatabaseService<Equipment>('equipments')
export const mataKuliahService = new DatabaseService<MataKuliah>('mata_kuliah')
export const jadwalService = new DatabaseService<Jadwal>('jadwal')
export const kuisService = new DatabaseService<Kuis>('kuis')
export const peminjamanService = new DatabaseService<Peminjaman>('peminjaman')
export const nilaiService = new DatabaseService<Nilai>('nilai')

// Export helper functions for complex queries
export const getUserWithRoles = async (userId: string) => {
  const { data, error } = await supabase
    .from('users_profile')
    .select(
      `
      *,
      user_roles (
        role:roles (*)
      )
    `
    )
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const getMataKuliahWithDetails = async (courseId: string) => {
  const { data, error } = await supabase
    .from('mata_kuliah')
    .select(
      `
      *,
      laboratory:laboratories (*),
      dosen:users_profile (*)
    `
    )
    .eq('id', courseId)
    .single()

  if (error) throw error
  return data
}

export const getJadwalWithDetails = async (date: string) => {
  const { data, error } = await supabase
    .from('jadwal')
    .select(
      `
      *,
      mata_kuliah (*),
      laboratory:laboratories (*),
      dosen:users_profile (*)
    `
    )
    .eq('scheduled_date', date)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}
