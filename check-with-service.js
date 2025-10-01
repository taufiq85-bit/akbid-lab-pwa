import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Get service role key from Supabase Dashboard → Settings → API
const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  SUPABASE_SERVICE_KEY, // Use service role key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function checkWithAdmin() {
  console.log('🔍 Checking with Service Role (Bypasses RLS)...\n')
  
  // Check mata_kuliah
  const { data, error, count } = await supabaseAdmin
    .from('mata_kuliah')
    .select('*', { count: 'exact' })
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log(`Found ${count} courses in mata_kuliah table`)
    if (data && data.length > 0) {
      console.log('\nCourses found:')
      data.forEach(course => {
        console.log(`- ${course.course_code}: ${course.course_name}`)
      })
    } else {
      console.log('Table is empty!')
    }
  }
}

checkWithAdmin()