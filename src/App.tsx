// src/App.tsx
import { useEffect, useState } from 'react'
import { supabase, checkSupabaseConnection } from '@/lib/supabase'
import type { User } from '@/types/user'
import './App.css'

function App() {
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">
          Sistem Informasi Praktikum PWA
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
            <p className={connectionStatus ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus ? '✅ Connected to Supabase' : '❌ Not Connected'}
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Test Query Results</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p>Found {users.length} users</p>
                <ul className="mt-2 space-y-1">
                  {users.map(user => (
                    <li key={user.id} className="text-sm">
                      {user.full_name} - {user.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App