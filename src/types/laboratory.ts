// src/types/laboratory.ts
import { type Database } from './database'

export type Laboratory = Database['public']['Tables']['laboratories']['Row']
export type LaboratoryInsert =
  Database['public']['Tables']['laboratories']['Insert']
export type LaboratoryUpdate =
  Database['public']['Tables']['laboratories']['Update']

export interface LaboratoryWithEquipment extends Laboratory {
  equipment_count?: number
  available_equipment?: number
}

export interface OperatingHours {
  [key: string]: {
    start: string
    end: string
  }
}

export interface LaboratoryStats {
  totalLabs: number
  activeLabs: number
  utilizationRate: number
  upcomingBookings: number
}
