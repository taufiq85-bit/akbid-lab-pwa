import { supabase } from './supabase'

export async function testConnection() {
  try {
    // Test 1: Check connection
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .limit(1)
    
    if (error) throw error
    
    console.log('✅ Database connection successful!')
    console.log('📊 Sample data:', data)
    
    // Test 2: Check auth
    const { data: authData } = await supabase.auth.getSession()
    console.log('🔐 Auth status:', authData.session ? 'Authenticated' : 'Not authenticated')
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}