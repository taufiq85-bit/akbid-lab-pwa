// src/types/auth.ts
// src/types/auth.ts
import type { Database } from './database'

export type UserProfile = Database['public']['Tables']['users_profile']['Row']
export type Role = Database['public']['Tables']['roles']['Row']
export type RoleCode = 'ADMIN' | 'DOSEN' | 'MAHASISWA' | 'LABORAN'

export interface AuthUser {
  id: string
  email: string
  profile?: UserProfile
  roles?: Role[]
  permissions?: string[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  fullName: string
  nimNip: string
  role: RoleCode
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  checkPermission: (permission: string) => boolean
  hasRole: (role: RoleCode) => boolean
}
