import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Car, User, LayoutDashboard, Eye, EyeOff, ArrowRight } from 'lucide-react'

const roles = [
  { id: 'passenger', label: 'راكب',     desc: 'احجز رحلتك الآن',        icon: User,            bg: 'bg-blue-50 dark:bg-blue-900/20',   border: 'border-blue-200 dark:border-blue-800',   text: 'text-blue-600 dark:text-blue-400' },
  { id: 'driver',    label: 'سائق',     desc: 'استقبل الطلبات واربح',    icon: Car,             bg: 'bg-primary-50 dark:bg-primary-900/20', border: 'border-primary-200 dark:border-primary-800', text: 'text-primary-600 dark:text-primary-400' },
  { id: 'admin',     label: 'مشرف',     desc: 'إدارة المنصة والمستخدمين', icon: LayoutDashboard, bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400' },
]

// Demo credentials shown to user
const demoCreds = {
  passenger: { email: 'passenger@massar.app', pass: 'demo1234' },
  driver:    { email: 'driver@massar.app',    pass: 'demo1234' },
  admin:     { email: 'admin@massar.app',     pass: 'demo1234' },
}

export default function Login() {
  const [params]         = useSearchParams()
  const [role, setRole]  = useState(params.get('role') || 'passenger')
  const [email, setEmail] = useState(demoCreds[role]?.email || '')
  const [pass, setPass]  = useState('demo1234')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const { login, showNotification } = useApp()
  const navigate = useNavigate()

  function selectRole(r) {
    setRole(r)
    setEmail(demoCreds[r].email)
    setPass('demo1234')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // simulate network
    login(role)
    showNotification('مرحباً بك في مسار! 👋', 'info')
    navigate(`/${role}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6">
      {/* Card */}
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center font-black text-2xl text-black">م</div>
            <span className="font-black text-2xl">مسار</span>
          </Link>
          <h1 className="text-2xl font-black">أهلاً بك مجدداً</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">سجّل دخولك للمتابعة</p>
        </div>

        <div className="card space-y-6">
          {/* Role selector */}
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">اختر دورك</p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(({ id, label, icon: Icon, bg, border, text }) => (
                <button
                  key={id}
                  onClick={() => selectRole(id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${role === id
                    ? `${bg} ${border} ${text} scale-[1.03] shadow-sm`
                    : 'border-transparent bg-gray-100 dark:bg-dark-border text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-muted'
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs font-bold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="example@massar.app"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>دخول <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-3 text-xs text-gray-600 dark:text-gray-400">
            <p className="font-bold text-primary-600 dark:text-primary-400 mb-1">حساب تجريبي — {roles.find(r => r.id === role)?.label}</p>
            <p>البريد: <span className="font-mono">{demoCreds[role]?.email}</span></p>
            <p>الرقم السري: <span className="font-mono">demo1234</span></p>
          </div>

          <p className="text-center text-sm text-gray-500">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              أنشئ حساباً
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
