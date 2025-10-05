// src/providers/AppProvider.tsx
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'
import { NotificationProvider } from './NotificationProvider'

interface AppProviderProps {
  children: React.ReactNode
  testUserId?: string
}

export function AppProvider({ children, testUserId }: AppProviderProps) {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <AuthProvider>
          <NotificationProvider userId={testUserId}>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
