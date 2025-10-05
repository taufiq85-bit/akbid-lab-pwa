// src/lib/supabase.ts
// DO NOT MODIFY - core database connection

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  global: {
    headers: {
      'x-application-name': 'sistem-praktikum-pwa',
    },
  },
  db: {
    schema: 'public',
  },
})

// Helper to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('system_settings')
      .select('setting_key')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to connect to Supabase:', error)
    return false
  }
}

// Export types for use in other files
export type { Database }
