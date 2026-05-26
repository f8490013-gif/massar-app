import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, IS_FIREBASE_CONFIGURED } from '../firebase/config'
import { getUserProfile } from '../firebase/auth'
import { loginUser, logoutUser } from '../firebase/auth'

export const AppContext = createContext(null)
export const useApp     = () => useContext(AppContext)

// ── Demo users (used when Firebase is not configured) ─────────────────────
const DEMO_USERS = {
  passenger: { uid: 'p1', name: 'مرحبا أحمد',  email: 'passenger@massar.app', role: 'passenger', rating: 4.8, trips: 34,  balance: 0 },
  driver:    { uid: 'd1', name: 'أحمد السبيعي', email: 'driver@massar.app',    role: 'driver',    rating: 4.9, trips: 312, balance: 456 },
  admin:     { uid: 'a1', name: 'مشرف النظام',  email: 'admin@massar.app',     role: 'admin',     rating: 5.0, trips: 0,   balance: 0 },
}

export function AppProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [theme, setTheme]       = useState(() => localStorage.getItem('massar-theme') || 'light')
  const [activeRide, setActiveRide] = useState(null)
  const [notification, setNotification] = useState(null)

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('massar-theme', theme)
  }, [theme])

  // Auth state listener
  useEffect(() => {
    if (!IS_FIREBASE_CONFIGURED) {
      // Restore demo session from localStorage
      const saved = localStorage.getItem('massar-demo-user')
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid)
        setUser(profile ?? {
          uid:   firebaseUser.uid,
          name:  firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          role:  'passenger',
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsub
  }, [])

  // ── Login ────────────────────────────────────────────────────────────────
  async function login(roleOrEmail, password) {
    if (!IS_FIREBASE_CONFIGURED) {
      // Demo login — roleOrEmail is a role string
      const u = DEMO_USERS[roleOrEmail] ?? DEMO_USERS.passenger
      setUser(u)
      localStorage.setItem('massar-demo-user', JSON.stringify(u))
      return u
    }
    // Firebase login
    await loginUser(roleOrEmail, password)
    // user state is set by onAuthStateChanged listener
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  async function logout() {
    if (IS_FIREBASE_CONFIGURED) await logoutUser()
    setUser(null)
    setActiveRide(null)
    localStorage.removeItem('massar-demo-user')
  }

  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }

  function showNotification(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    theme,
    toggleTheme,
    activeRide,
    setActiveRide,
    showNotification,
    isFirebase: IS_FIREBASE_CONFIGURED,
  }

  return (
    <AppContext.Provider value={value}>
      {children}

      {/* Toast notification */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
          px-6 py-3 rounded-2xl shadow-xl font-semibold text-sm animate-slide-up
          ${notification.type === 'success' ? 'bg-green-500 text-white'    : ''}
          ${notification.type === 'error'   ? 'bg-red-500 text-white'      : ''}
          ${notification.type === 'info'    ? 'bg-primary-500 text-black'  : ''}`}>
          {notification.msg}
        </div>
      )}
    </AppContext.Provider>
  )
}
