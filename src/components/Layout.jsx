import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  Home, Car, MapPin, CreditCard, User, TrendingUp,
  ClipboardList, LayoutDashboard, Users, School, BarChart2,
  Settings, LogOut, Menu, X, Sun, Moon, Bell
} from 'lucide-react'
import clsx from 'clsx'

// ── nav definitions ────────────────────────────────────────────────────────
const passengerNav = [
  { path: '/passenger',          label: 'الرئيسية',     icon: Home },
  { path: '/passenger/request',  label: 'طلب مشوار',   icon: Car },
  { path: '/passenger/track',    label: 'تتبع الرحلة', icon: MapPin },
  { path: '/passenger/school',   label: 'النقل المدرسي', icon: School },
  { path: '/passenger/payment',  label: 'الدفع',       icon: CreditCard },
]
const driverNav = [
  { path: '/driver',             label: 'استقبال الطلبات', icon: ClipboardList },
  { path: '/driver/rides',       label: 'الرحلات الحالية', icon: Car },
  { path: '/driver/earnings',    label: 'الأرباح',         icon: TrendingUp },
  { path: '/driver/profile',     label: 'الملف الشخصي',   icon: User },
]
const adminNav = [
  { path: '/admin',              label: 'الرئيسية',    icon: LayoutDashboard },
  { path: '/admin/passengers',   label: 'السائقون',   icon: Users },
  { path: '/admin/schools',      label: 'المدارس',    icon: School },
  { path: '/admin/trips',        label: 'الرحلات',    icon: Car },
  { path: '/admin/payments',     label: 'المدفوعات',  icon: CreditCard },
  { path: '/admin/reports',      label: 'التقارير',   icon: BarChart2 },
  { path: '/admin/settings',     label: 'الإعدادات',  icon: Settings },
]

function navForRole(role) {
  if (role === 'driver')    return driverNav
  if (role === 'admin')     return adminNav
  return passengerNav
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose }) {
  const { user, logout, theme, toggleTheme } = useApp()
  const navigate  = useNavigate()
  const location  = useLocation()
  const nav       = navForRole(user?.role)

  function go(path) {
    navigate(path)
    onClose()
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={clsx(
        'fixed top-0 right-0 h-full w-72 z-50 flex flex-col',
        'bg-white dark:bg-dark-card border-l border-gray-100 dark:border-dark-border',
        'transition-transform duration-300',
        open ? 'translate-x-0' : 'translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto lg:flex lg:h-screen lg:sticky lg:top-0'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center font-black text-lg text-black">م</div>
            <div>
              <p className="font-black text-lg leading-none">مسار</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.role === 'passenger' ? 'راكب' : user?.role === 'driver' ? 'سائق' : 'مشرف'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border">
            <X size={18} />
          </button>
        </div>

        {/* User chip */}
        <div className="mx-4 mt-4 p-3 rounded-2xl bg-primary-50 dark:bg-dark-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-black font-bold text-lg">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {nav.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => go(path)}
                className={clsx('sidebar-link w-full text-right', active && 'active')}
              >
                <Icon size={18} className="shrink-0" />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2 border-t border-gray-100 dark:border-dark-border">
          <button
            onClick={toggleTheme}
            className="sidebar-link w-full text-right"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'الوضع العادي' : 'الوضع الداكن'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-right text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Topbar ─────────────────────────────────────────────────────────────────
function Topbar({ onMenuOpen, title }) {
  const { user } = useApp()
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-5 h-16 flex items-center justify-between">
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center font-bold text-black">
          {user?.name?.charAt(0)}
        </div>
      </div>
    </header>
  )
}

// ── Layout ─────────────────────────────────────────────────────────────────
export default function Layout({ children, title = 'مسار' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuOpen={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-5 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
