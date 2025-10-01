import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function insertCourses() {
  console.log('🎓 Inserting Mata Kuliah...\n')
  
  const courses = [
    { course_code: 'AK101', course_name: 'Keterampilan Dasar Praktik Kebidanan', description: 'Pembelajaran keterampilan dasar praktik kebidanan', credit_hours: 3, theory_hours: 1, practice_hours: 2, semester: 1, is_active: true },
    { course_code: 'AK201', course_name: 'Asuhan Kehamilan (ANC)', description: 'Praktik asuhan antenatal care komprehensif', credit_hours: 4, theory_hours: 2, practice_hours: 2, semester: 2, is_active: true },
    { course_code: 'AK301', course_name: 'Asuhan Nifas (PNC)', description: 'Praktik asuhan postnatal care dan laktasi', credit_hours: 3, theory_hours: 1, practice_hours: 2, semester: 3, is_active: true },
    { course_code: 'AK401', course_name: 'Asuhan Persalinan (INC)', description: 'Praktik asuhan intranatal care normal dan patologis', credit_hours: 4, theory_hours: 2, practice_hours: 2, semester: 4, is_active: true },
    { course_code: 'AK501', course_name: 'Asuhan Bayi Baru Lahir', description: 'Perawatan komprehensif bayi baru lahir', credit_hours: 3, theory_hours: 1, practice_hours: 2, semester: 5, is_active: true },
    { course_code: 'KB101', course_name: 'Pelayanan Keluarga Berencana', description: 'Konseling dan pelayanan KB', credit_hours: 3, theory_hours: 2, practice_hours: 1, semester: 4, is_active: true },
    { course_code: 'KK101', course_name: 'Konseling dan Pendidikan Kesehatan', description: 'Teknik konseling dan edukasi kesehatan', credit_hours: 2, theory_hours: 1, practice_hours: 1, semester: 3, is_active: true },
    { course_code: 'KM101', course_name: 'Kebidanan Komunitas', description: 'Praktik kebidanan berbasis masyarakat', credit_hours: 3, theory_hours: 2, practice_hours: 1, semester: 5, is_active: true },
    { course_code: 'KA101', course_name: 'Kesehatan Anak dan Balita', description: 'Asuhan kesehatan anak komprehensif', credit_hours: 3, theory_hours: 1, practice_hours: 2, semester: 4, is_active: true }
  ]
  
  for (const course of courses) {
    const { data, error } = await supabase
      .from('mata_kuliah')
      .insert([course])
      .select()
    
    if (error) {
      console.error(`❌ Error inserting ${course.course_code}:`, error.message)
    } else {
      console.log(`✅ Inserted: ${course.course_code} - ${course.course_name}`)
    }
  }
  
  // Check total count
  const { count } = await supabase
    .from('mata_kuliah')
    .select('*', { count: 'exact', head: true })
  
  console.log(`\n📊 Total Mata Kuliah: ${count} courses`)
}

insertCourses()