import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, IS_FIREBASE_CONFIGURED } from '../firebase/config'
import { getUserProfile } from '../firebase/auth'
import { loginUser, logoutUser } from '../firebase/auth'

export const AppContext = createContext(null)
export const useApp     = () => useContext(AppContext)

// ── Demo users ────────────────────────────────────────────────────────────
const DEMO_USERS = {
  passenger: { uid: 'p1', name: 'أحمد الشهري',   email: 'passenger@massar.app', role: 'passenger', rating: 4.8, trips: 34,  balance: 120, city: 'الرياض', phone: '0501234567' },
  driver:    { uid: 'd1', name: 'محمد السبيعي',  email: 'driver@massar.app',    role: 'driver',    rating: 4.9, trips: 312, balance: 456, city: 'الرياض', phone: '0559876543', car: 'تويوتا كامري', plate: 'ن ص م 1234', carYear: '2023' },
  admin:     { uid: 'a1', name: 'مشرف النظام',   email: 'admin@massar.app',     role: 'admin',     rating: 5.0, trips: 0,   balance: 0,   city: 'الرياض', phone: '' },
}

export function AppProvider({ children }) {
  const [user,         setUser]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [theme,        setTheme]        = useState(() => localStorage.getItem('massar-theme') || 'light')
  const [activeRide,   setActiveRide]   = useState(null)
  const [notification, setNotification] = useState(null)

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('massar-theme', theme)
  }, [theme])

  // Auth state listener
  useEffect(() => {
    if (!IS_FIREBASE_CONFIGURED) {
      const saved = localStorage.getItem('massar-demo-user')
      if (saved) {
        try { setUser(JSON.parse(saved)) } catch {}
      }
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
      const u = DEMO_USERS[roleOrEmail] ?? DEMO_USERS.passenger
      setUser(u)
      localStorage.setItem('massar-demo-user', JSON.stringify(u))
      return u
    }
    await loginUser(roleOrEmail, password)
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  async function logout() {
    if (IS_FIREBASE_CONFIGURED) await logoutUser()
    setUser(null)
    setActiveRide(null)
    localStorage.removeItem('massar-demo-user')
  }

  // ── Update user state (after profile edit) ───────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!user?.uid) return
    if (IS_FIREBASE_CONFIGURED) {
      const profile = await getUserProfile(user.uid)
      if (profile) setUser(profile)
    }
  }, [user?.uid])

  const patchUser = useCallback((patch) => {
    setUser(u => {
      const updated = { ...u, ...patch }
      if (!IS_FIREBASE_CONFIGURED) {
        localStorage.setItem('massar-demo-user', JSON.stringify(updated))
      }
      return updated
    })
  }, [])

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
    refreshUser,
    patchUser,
    theme,
    toggleTheme,
    activeRide,
    setActiveRide,
    showNotification,
    isFirebase: IS_FIREBASE_CONFIGURED,
  }

  // Show full-screen spinner while auth resolves
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center font-black text-3xl text-black animate-pulse">م</div>
          <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" style={{ borderWidth: 3 }} />
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={value}>
      {children}

      {/* Toast notification */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
          px-6 py-3 rounded-2xl shadow-xl font-semibold text-sm animate-slide-up
          ${notification.type === 'success' ? 'bg-green-500 text-white'   : ''}
          ${notification.type === 'error'   ? 'bg-red-500 text-white'     : ''}
          ${notification.type === 'info'    ? 'bg-primary-500 text-black' : ''}`}>
          {notification.msg}
        </div>
      )}
    </AppContext.Provider>
  )
}
