import { createContext, useContext, useState, useEffect } from 'react'

export const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

// Demo users for mock login
const DEMO_USERS = {
  passenger: { id: 'p1', name: 'مرحبا أحمد', email: 'passenger@massar.app', role: 'passenger', avatar: null, rating: 4.8, trips: 34 },
  driver:    { id: 'd1', name: 'أحمد السبيعي', email: 'driver@massar.app',    role: 'driver',    avatar: null, rating: 4.9, trips: 312, balance: 456.00 },
  admin:     { id: 'a1', name: 'مشرف النظام',  email: 'admin@massar.app',     role: 'admin',     avatar: null },
}

export function AppProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [theme, setTheme]   = useState(() => localStorage.getItem('massar-theme') || 'light')
  const [activeRide, setActiveRide] = useState(null)
  const [notification, setNotification] = useState(null)

  // Apply dark class to html element
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('massar-theme', theme)
  }, [theme])

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('massar-user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  function login(role) {
    const u = DEMO_USERS[role]
    setUser(u)
    localStorage.setItem('massar-user', JSON.stringify(u))
  }

  function logout() {
    setUser(null)
    setActiveRide(null)
    localStorage.removeItem('massar-user')
  }

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  function showNotification(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  return (
    <AppContext.Provider value={{ user, login, logout, theme, toggleTheme, activeRide, setActiveRide, notification, showNotification }}>
      {children}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-xl font-semibold text-sm animate-slide-up
          ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
          ${notification.type === 'error'   ? 'bg-red-500 text-white'   : ''}
          ${notification.type === 'info'    ? 'bg-primary-500 text-black' : ''}`}>
          {notification.msg}
        </div>
      )}
    </AppContext.Provider>
  )
}
