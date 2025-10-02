// src/types/equipment.ts
// src/types/equipment.ts
import type { Database } from './database'

export type Equipment = Database['public']['Tables']['equipments']['Row']
export type EquipmentInsert =
  Database['public']['Tables']['equipments']['Insert']
export type EquipmentUpdate =
  Database['public']['Tables']['equipments']['Update']

export type EquipmentCondition =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'broken'
export type EquipmentStatus =
  | 'available'
  | 'in_use'
  | 'maintenance'
  | 'broken'
  | 'retired'

export interface EquipmentWithLocation extends Equipment {
  laboratory?: Database['public']['Tables']['laboratories']['Row']
  current_location?: Database['public']['Tables']['laboratories']['Row']
}

export interface EquipmentFilters {
  category?: string
  status?: EquipmentStatus
  condition?: EquipmentCondition
  laboratoryId?: string
  search?: string
}
