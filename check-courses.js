import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkCourses() {
  console.log('📚 Checking Mata Kuliah...\n')
  
  const { data, error, count } = await supabase
    .from('mata_kuliah')
    .select('*', { count: 'exact' })
    .order('course_code')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Total Courses: ${count}\n`)
  
  if (data && data.length > 0) {
    console.table(data.map(course => ({
      Code: course.course_code,
      Name: course.course_name,
      Credits: course.credit_hours,
      Semester: course.semester
    })))
  }
}

checkCourses()