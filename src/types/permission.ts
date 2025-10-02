// src/types/permission.ts
// src/types/permission.ts
import type { Database } from './database'

export type Permission = Database['public']['Tables']['permissions']['Row']
export type PermissionInsert =
  Database['public']['Tables']['permissions']['Insert']
export type PermissionUpdate =
  Database['public']['Tables']['permissions']['Update']

export interface PermissionModule {
  module: string
  actions: string[]
}

export interface PermissionCheck {
  module: string
  action: string
}

export const PERMISSION_MODULES = {
  USER: 'user',
  COURSE: 'course',
  QUIZ: 'quiz',
  BOOKING: 'booking',
  INVENTORY: 'inventory',
} as const

export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
} as const
