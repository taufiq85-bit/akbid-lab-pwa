// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import type { RoleCode } from '@/types/auth'

interface MainLayoutProps {
  userRole?: RoleCode
  userName?: string
  userEmail?: string
}

export default function MainLayout({
  userRole = 'MAHASISWA',
  userName = 'User',
  userEmail = 'user@example.com',
}: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications] = useState(3) // This would come from context/API

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const handleToggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)

    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = () => {
    // Implement logout logic
    // Clear auth data and redirect to login
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          userRole={userRole}
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          notifications={notifications}
          onLogout={handleLogout}
          onToggleTheme={handleToggleTheme}
          isDarkMode={isDarkMode}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
