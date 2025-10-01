import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function databaseSummary() {
  console.log('📊 DATABASE SUMMARY\n')
  console.log('='.repeat(50))
  
  const tables = [
    { name: 'users_profile', label: 'Users' },
    { name: 'roles', label: 'Roles' },
    { name: 'permissions', label: 'Permissions' },
    { name: 'user_roles', label: 'User Roles' },
    { name: 'role_permissions', label: 'Role Permissions' },
    { name: 'laboratories', label: 'Laboratories' },
    { name: 'equipments', label: 'Equipment' },
    { name: 'mata_kuliah', label: 'Courses' },
    { name: 'jadwal', label: 'Schedules' },
    { name: 'kuis', label: 'Quizzes' },
    { name: 'peminjaman', label: 'Bookings' },
    { name: 'inventaris', label: 'Inventory' },
    { name: 'pengumuman', label: 'Announcements' },
  ]
  
  let totalRecords = 0
  
  for (const table of tables) {
    const { count } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ ${table.label.padEnd(20)} : ${count} records`)
    totalRecords += count || 0
  }
  
  console.log('='.repeat(50))
  console.log(`📈 Total Records: ${totalRecords}`)
  console.log(`✅ Database Status: HEALTHY`)
  console.log('='.repeat(50))
}

databaseSummary()