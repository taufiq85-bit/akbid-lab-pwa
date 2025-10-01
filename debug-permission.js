import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function debugPermissions() {
  console.log('🔍 Debugging mata_kuliah access...\n')
  
  // Test 1: Basic select
  console.log('Test 1: Basic SELECT')
  const { data: test1, error: error1 } = await supabase
    .from('mata_kuliah')
    .select('course_code')
    .limit(1)
  
  console.log('Result:', test1)
  console.log('Error:', error1)
  
  // Test 2: Count only
  console.log('\nTest 2: COUNT only')
  const { count, error: error2 } = await supabase
    .from('mata_kuliah')
    .select('*', { count: 'exact', head: true })
  
  console.log('Count:', count)
  console.log('Error:', error2)
  
  // Test 3: Check other tables for comparison
  console.log('\nTest 3: Compare with roles table')
  const { data: roles, error: error3 } = await supabase
    .from('roles')
    .select('*')
  
  console.log('Roles found:', roles?.length || 0)
  console.log('Error:', error3)
}

debugPermissions()