// src/App.tsx
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { supabase, checkSupabaseConnection } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import type { User } from '@/types'

// Temporary test pages with DB status
const TestDashboard = ({ role }: { role: string }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false)

  useEffect(() => {
    // Test connection
    checkSupabaseConnection().then(setConnectionStatus)
    
    // Test basic query
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users_profile')
          .select('*')
          .limit(5)
        
        if (error) {
          console.error('Query error:', error)
        } else {
          console.log('Users fetched:', data)
          setUsers((data as User[]) || [])
        }
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{role} Dashboard</h1>
        <p className="text-gray-600">Testing layout and database connection</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Connection Status</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connectionStatus ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className={connectionStatus ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus ? 'Connected to Supabase' : 'Not Connected'}
            </p>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Test Query Results</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div>
              <p className="font-medium">Found {users.length} users</p>
              <ul className="mt-2 space-y-1">
                {users.map(user => (
                  <li key={user.id} className="text-sm text-gray-600">
                    {user.full_name} - {user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Use the sidebar to navigate between pages</li>
          <li>• Check if the layout is responsive (try resizing the window)</li>
          <li>• Test the user menu in the header</li>
          <li>• Verify that the database connection is working</li>
        </ul>
      </div>
    </div>
  )
}

// Individual role dashboards
const AdminDashboard = () => <TestDashboard role="Admin" />
const DosenDashboard = () => <TestDashboard role="Dosen" />
const MahasiswaDashboard = () => <TestDashboard role="Mahasiswa" />
const LaboranDashboard = () => <TestDashboard role="Laboran" />

// Placeholder pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <div className="p-4 border rounded-lg bg-gray-50">
      <p className="text-gray-600">This page is under construction.</p>
      <Button className="mt-4" variant="outline">
        Coming Soon
      </Button>
    </div>
  </div>
)

function App() {
  // For testing - you can change this to test different roles
  const testRole = 'ADMIN' as const // Change to 'DOSEN', 'MAHASISWA', or 'LABORAN'
  const testUser = {
    name: 'Test User',
    email: 'test@akbidmegabuana.ac.id',
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${testRole.toLowerCase()}`} replace />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <MainLayout 
              userRole="ADMIN"
              userName={testUser.name}
              userEmail={testUser.email}
            />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<PlaceholderPage title="User Management" />} />
          <Route path="roles" element={<PlaceholderPage title="Roles & Permissions" />} />
          <Route path="laboratories" element={<PlaceholderPage title="Laboratories" />} />
          <Route path="equipments" element={<PlaceholderPage title="Equipments" />} />
          <Route path="announcements" element={<PlaceholderPage title="Announcements" />} />
          <Route path="system/analytics" element={<PlaceholderPage title="Analytics" />} />
        </Route>

        {/* Dosen Routes */}
        <Route 
          path="/dosen/*" 
          element={
            <MainLayout 
              userRole="DOSEN"
              userName={testUser.name}
              userEmail={testUser.email}
            />
          }
        >
          <Route index element={<DosenDashboard />} />
          <Route path="mata-kuliah" element={<PlaceholderPage title="Mata Kuliah" />} />
          <Route path="jadwal" element={<PlaceholderPage title="Jadwal" />} />
          <Route path="kuis" element={<PlaceholderPage title="Kuis" />} />
          <Route path="peminjaman" element={<PlaceholderPage title="Peminjaman" />} />
          <Route path="mahasiswa" element={<PlaceholderPage title="Mahasiswa" />} />
          <Route path="materi" element={<PlaceholderPage title="Materi" />} />
          <Route path="penilaian" element={<PlaceholderPage title="Penilaian" />} />
        </Route>

        {/* Mahasiswa Routes */}
        <Route 
          path="/mahasiswa/*" 
          element={
            <MainLayout 
              userRole="MAHASISWA"
              userName={testUser.name}
              userEmail={testUser.email}
            />
          }
        >
          <Route index element={<MahasiswaDashboard />} />
          <Route path="jadwal" element={<PlaceholderPage title="Jadwal Praktikum" />} />
          <Route path="kuis" element={<PlaceholderPage title="Kuis" />} />
          <Route path="materi" element={<PlaceholderPage title="Materi" />} />
          <Route path="nilai" element={<PlaceholderPage title="Nilai" />} />
          <Route path="pengumuman" element={<PlaceholderPage title="Pengumuman" />} />
          <Route path="profil" element={<PlaceholderPage title="Profil" />} />
        </Route>

        {/* Laboran Routes */}
        <Route 
          path="/laboran/*" 
          element={
            <MainLayout 
              userRole="LABORAN"
              userName={testUser.name}
              userEmail={testUser.email}
            />
          }
        >
          <Route index element={<LaboranDashboard />} />
          <Route path="inventaris" element={<PlaceholderPage title="Inventaris" />} />
          <Route path="persetujuan" element={<PlaceholderPage title="Persetujuan" />} />
          <Route path="laboratorium" element={<PlaceholderPage title="Laboratorium" />} />
          <Route path="laporan" element={<PlaceholderPage title="Laporan" />} />
        </Route>

        {/* Catch all - redirect to role dashboard */}
        <Route path="*" element={<Navigate to={`/${testRole.toLowerCase()}`} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App