// src/types/user.ts
// src/types/user.ts
import type { Database } from './database'

export type User = Database['public']['Tables']['users_profile']['Row']
export type UserInsert = Database['public']['Tables']['users_profile']['Insert']
export type UserUpdate = Database['public']['Tables']['users_profile']['Update']

export interface UserWithRole extends User {
  user_roles?: Array<{
    role: Database['public']['Tables']['roles']['Row']
  }>
}

export interface UserFilters {
  role?: string
  isActive?: boolean
  search?: string
  semester?: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  usersByRole: Record<string, number>
  recentRegistrations: number
}
