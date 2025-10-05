// src/App.tsx
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { NotificationProvider } from '@/providers/NotificationProvider'
import { Toaster } from 'sonner'
import MainLayout from '@/components/layout/MainLayout'
import { supabase, checkSupabaseConnection } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useNotifications } from '@/hooks/useNotifications'
import type { User } from '@/types'

// Test page for contexts
const TestContexts = () => {
  const { theme, setTheme } = useTheme()
  const { showNotification, notifications, unreadCount } = useNotifications()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Context Testing Page</h1>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold mb-2">Theme Context Test</h2>
        <p className="mb-2">
          Current theme: <span className="font-mono">{theme}</span>
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setTheme('light')} variant="outline" size="sm">
            Light
          </Button>
          <Button onClick={() => setTheme('dark')} variant="outline" size="sm">
            Dark
          </Button>
          <Button
            onClick={() => setTheme('system')}
            variant="outline"
            size="sm"
          >
            System
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold mb-2">Notification Context Test</h2>
        <p className="mb-2">Total notifications: {notifications.length}</p>
        <p className="mb-3">Unread: {unreadCount}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              showNotification({
                title: 'Info Notification',
                message: 'This is an info notification',
                type: 'info',
              })
            }
            variant="outline"
            size="sm"
          >
            Show Info
          </Button>
          <Button
            onClick={() =>
              showNotification({
                title: 'Success!',
                message: 'Operation completed successfully',
                type: 'success',
              })
            }
            variant="outline"
            size="sm"
          >
            Show Success
          </Button>
          <Button
            onClick={() =>
              showNotification({
                title: 'Warning',
                message: 'Please be careful with this action',
                type: 'warning',
              })
            }
            variant="outline"
            size="sm"
          >
            Show Warning
          </Button>
          <Button
            onClick={() =>
              showNotification({
                title: 'Error',
                message: 'Something went wrong',
                type: 'error',
              })
            }
            variant="destructive"
            size="sm"
          >
            Show Error
          </Button>
        </div>
      </div>
    </div>
  )
}

// Test Dashboard with DB status
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
        <p className="text-muted-foreground">
          Testing layout and database connection
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Connection Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${connectionStatus ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <p className={connectionStatus ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus ? 'Connected to Supabase' : 'Not Connected'}
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Test Query Results</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div>
              <p className="font-medium">Found {users.length} users</p>
              {users.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {users.slice(0, 3).map((user) => (
                    <li key={user.id} className="text-sm text-muted-foreground">
                      {user.full_name || 'No name'} - {user.email}
                    </li>
                  ))}
                  {users.length > 3 && (
                    <li className="text-sm text-muted-foreground italic">
                      ...and {users.length - 3} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Use the sidebar to navigate between pages</li>
          <li>• Check if the layout is responsive (try resizing the window)</li>
          <li>• Test the user menu in the header</li>
          <li>• Verify that the database connection is working</li>
          <li>
            • Visit /test-contexts to test Theme and Notification contexts
          </li>
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
    <div className="p-4 border rounded-lg bg-muted">
      <p className="text-muted-foreground">This page is under construction.</p>
      <Button className="mt-4" variant="outline">
        Coming Soon
      </Button>
    </div>
  </div>
)

function App() {
  // For testing - you can change this to test different roles
  const testRole = 'ADMIN' as const // Change to 'DOSEN', 'MAHASISWA', or 'LABORAN'

  // Use undefined for userId to avoid UUID validation errors during testing
  // When you have real authentication, this will be replaced with actual user data
  const testUser = {
    id: undefined, // Set to undefined to skip notification fetching
    // Or use a valid UUID from your database:
    // id: '00000000-0000-0000-0000-000000000000',
    name: 'Test User',
    email: 'test@akbidmegabuana.ac.id',
  }

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <AuthProvider>
          <NotificationProvider userId={testUser.id}>
            <Routes>
              <Route
                path="/"
                element={<Navigate to={`/${testRole.toLowerCase()}`} replace />}
              />

              {/* Test route for contexts */}
              <Route
                path="/test-contexts"
                element={
                  <MainLayout
                    userRole={testRole}
                    userName={testUser.name}
                    userEmail={testUser.email}
                  />
                }
              >
                <Route index element={<TestContexts />} />
              </Route>

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
                <Route
                  path="users"
                  element={<PlaceholderPage title="User Management" />}
                />
                <Route
                  path="roles"
                  element={<PlaceholderPage title="Roles & Permissions" />}
                />
                <Route
                  path="laboratories"
                  element={<PlaceholderPage title="Laboratories" />}
                />
                <Route
                  path="equipments"
                  element={<PlaceholderPage title="Equipments" />}
                />
                <Route
                  path="announcements"
                  element={<PlaceholderPage title="Announcements" />}
                />
                <Route
                  path="system/analytics"
                  element={<PlaceholderPage title="Analytics" />}
                />
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
                <Route
                  path="mata-kuliah"
                  element={<PlaceholderPage title="Mata Kuliah" />}
                />
                <Route
                  path="jadwal"
                  element={<PlaceholderPage title="Jadwal" />}
                />
                <Route path="kuis" element={<PlaceholderPage title="Kuis" />} />
                <Route
                  path="peminjaman"
                  element={<PlaceholderPage title="Peminjaman" />}
                />
                <Route
                  path="mahasiswa"
                  element={<PlaceholderPage title="Mahasiswa" />}
                />
                <Route
                  path="materi"
                  element={<PlaceholderPage title="Materi" />}
                />
                <Route
                  path="penilaian"
                  element={<PlaceholderPage title="Penilaian" />}
                />
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
                <Route
                  path="jadwal"
                  element={<PlaceholderPage title="Jadwal Praktikum" />}
                />
                <Route path="kuis" element={<PlaceholderPage title="Kuis" />} />
                <Route
                  path="materi"
                  element={<PlaceholderPage title="Materi" />}
                />
                <Route
                  path="nilai"
                  element={<PlaceholderPage title="Nilai" />}
                />
                <Route
                  path="pengumuman"
                  element={<PlaceholderPage title="Pengumuman" />}
                />
                <Route
                  path="profil"
                  element={<PlaceholderPage title="Profil" />}
                />
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
                <Route
                  path="inventaris"
                  element={<PlaceholderPage title="Inventaris" />}
                />
                <Route
                  path="persetujuan"
                  element={<PlaceholderPage title="Persetujuan" />}
                />
                <Route
                  path="laboratorium"
                  element={<PlaceholderPage title="Laboratorium" />}
                />
                <Route
                  path="laporan"
                  element={<PlaceholderPage title="Laporan" />}
                />
              </Route>

              {/* Catch all - redirect to role dashboard */}
              <Route
                path="*"
                element={<Navigate to={`/${testRole.toLowerCase()}`} replace />}
              />
            </Routes>

            {/* Sonner Toast notifications with theme support */}
            <Toaster
              position="top-right"
              expand={true}
              richColors
              closeButton
              theme="system"
              duration={4000}
            />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
