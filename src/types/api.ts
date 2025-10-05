// src/types/api.ts

export interface ApiResponse<T = unknown> {
  // Changed from any to unknown
  data?: T
  error?: ApiError
  message?: string
  status: number
  success: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: unknown // Changed from any to unknown
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface QueryOptions {
  enabled?: boolean
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  retry?: number | boolean
  staleTime?: number
  cacheTime?: number
}

export interface MutationOptions {
  onSuccess?: (data: unknown) => void // Changed from any to unknown
  onError?: (error: unknown) => void // Changed from any to unknown
  onSettled?: () => void
}
