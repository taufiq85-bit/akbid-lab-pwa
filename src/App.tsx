import { useEffect } from 'react'
import { testConnection } from '@/lib/test-connection'
import { Button } from '@/components/ui/button'

function App() {
  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Sistem Informasi Praktikum PWA
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Akademi Kebidanan Mega Buana
      </p>
      <Button onClick={() => testConnection()}>
        Test Database Connection
      </Button>
    </div>
  )
}

export default App