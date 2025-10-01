export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string
          nim_nip: string | null
          phone: string | null
          avatar_url: string | null
          birth_date: string | null
          address: string | null
          is_active: boolean
          email_verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users_profile']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users_profile']['Insert']>
      }
      // Add other tables here...
    }
  }
}