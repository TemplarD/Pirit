'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Получаем тему из cookies или localStorage
    const savedTheme = (document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] || 
      localStorage.getItem('theme') || 
      'light') as 'light' | 'dark'

    // Применяем тему к document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Устанавливаем тему в состояние через setTimeout для избежания синхронного setState
    const timer = setTimeout(() => {
      setTheme(savedTheme)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('ToggleTheme:', { currentTheme: theme, newTheme })
    
    // Применяем класс к document немедленно
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
      console.log('Added dark class to html and body')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      console.log('Removed dark class from html and body')
    }
    
    // Проверяем, что класс применился
    setTimeout(() => {
      console.log('HTML classes after timeout:', document.documentElement.classList.toString())
      console.log('Body classes after timeout:', document.body.classList.toString())
      console.log('Computed background:', getComputedStyle(document.body).backgroundColor)
    }, 100)
    
    setTheme(newTheme)
    
    // Сохраняем в cookies и localStorage
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
