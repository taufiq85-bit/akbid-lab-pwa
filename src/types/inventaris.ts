// src/types/inventaris.ts
// src/types/inventaris.ts
import type { Database } from './database'

export type Inventaris = Database['public']['Tables']['inventaris']['Row']
export type InventarisInsert =
  Database['public']['Tables']['inventaris']['Insert']
export type InventarisUpdate =
  Database['public']['Tables']['inventaris']['Update']

export type StockMovement =
  Database['public']['Tables']['stock_movements']['Row']
export type MovementType =
  | 'in'
  | 'out'
  | 'transfer'
  | 'adjustment'
  | 'maintenance'

export interface InventarisWithEquipment extends Inventaris {
  equipment?: Database['public']['Tables']['equipments']['Row']
  recent_movements?: StockMovement[]
}

export interface StockAlert {
  equipmentId: string
  equipmentName: string
  currentStock: number
  minimumStock: number
  reorderPoint: number
  alertType: 'low_stock' | 'out_of_stock' | 'reorder'
}
