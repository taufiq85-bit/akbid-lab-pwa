// src/context/AuthContext.tsx
import { createContext } from 'react'
import type {
  AuthState,
  LoginCredentials,
  RegisterData,
  RoleCode,
  UserProfile,
} from '@/types/auth'

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  checkPermission: (permission: string) => boolean
  hasRole: (role: RoleCode) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
