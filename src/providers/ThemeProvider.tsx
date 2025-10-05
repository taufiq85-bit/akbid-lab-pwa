// src/providers/ThemeProvider.tsx
import { useState, useEffect } from 'react'
import { ThemeContext } from '@/context/ThemeContext'
import type { Theme, ThemeContextType } from '@/context/ThemeContext'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'app-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey) as Theme
    return stored || defaultTheme
  })

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement

    const applyTheme = (selectedTheme: Theme) => {
      root.classList.remove('light', 'dark')

      let effectiveTheme: 'light' | 'dark'

      if (selectedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light'
        effectiveTheme = systemTheme
      } else {
        effectiveTheme = selectedTheme
      }

      root.classList.add(effectiveTheme)
      setActualTheme(effectiveTheme)
    }

    applyTheme(theme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = actualTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
