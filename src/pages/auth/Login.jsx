import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { loginWithGoogle } from '../../firebase/auth'
import { IS_FIREBASE_CONFIGURED } from '../../firebase/config'
import { Car, User, LayoutDashboard, Eye, EyeOff, ArrowRight, Flame } from 'lucide-react'

const roles = [
  { id: 'passenger', label: 'راكب',  icon: User,            bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-400',   text: 'text-blue-600 dark:text-blue-400' },
  { id: 'driver',    label: 'سائق',  icon: Car,             bg: 'bg-primary-50 dark:bg-primary-900/20', border: 'border-primary-400', text: 'text-primary-600 dark:text-primary-400' },
  { id: 'admin',     label: 'مشرف', icon: LayoutDashboard, bg: 'bg-purple-50 dark:bg-purple-900/20',  border: 'border-purple-400',  text: 'text-purple-600 dark:text-purple-400' },
]

const DEMO_CREDS = {
  passenger: 'passenger@massar.app',
  driver:    'driver@massar.app',
  admin:     'admin@massar.app',
}

export default function Login() {
  const [role, setRole]       = useState('passenger')
  const [email, setEmail]     = useState(DEMO_CREDS.passenger)
  const [pass, setPass]       = useState('demo1234')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError]     = useState('')

  const { login, showNotification } = useApp()
  const navigate = useNavigate()

  function selectRole(r) {
    setRole(r)
    setEmail(DEMO_CREDS[r])
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(IS_FIREBASE_CONFIGURED ? email : role, pass)
      showNotification('مرحباً بك في مسار! 👋', 'info')
      navigate(`/${role}`)
    } catch (err) {
      setError(
        err.code === 'auth/user-not-found'   ? 'البريد الإلكتروني غير مسجل' :
        err.code === 'auth/wrong-password'   ? 'كلمة المرور غير صحيحة' :
        err.code === 'auth/invalid-email'    ? 'البريد الإلكتروني غير صالح' :
        err.code === 'auth/too-many-requests'? 'محاولات كثيرة — حاول لاحقاً' :
        'حدث خطأ، يرجى المحاولة مجدداً'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError('')
    try {
      await loginWithGoogle(role)
      showNotification('تم تسجيل الدخول بـ Google ✅', 'success')
      navigate(`/${role}`)
    } catch (err) {
      setError('فشل تسجيل الدخول بـ Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6">
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

        <div className="card space-y-5">
          {/* Role selector */}
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-3">اختر دورك</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(({ id, label, icon: Icon, bg, border, text }) => (
                <button
                  key={id}
                  onClick={() => selectRole(id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    role === id ? `${bg} ${border} ${text}` : 'border-transparent bg-gray-100 dark:bg-dark-border text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={20} />
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
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-field" placeholder="example@massar.app" required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="input-field pl-12" placeholder="••••••••" required
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading
                ? <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <>دخول <ArrowRight size={18} /></>
              }
            </button>
          </form>

          {/* Google Sign-In (Firebase only) */}
          {IS_FIREBASE_CONFIGURED && (
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 border-gray-200 dark:border-dark-border font-bold text-sm hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
            >
              {googleLoading
                ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                : <span className="text-lg">G</span>
              }
              تسجيل الدخول بـ Google
            </button>
          )}

          {/* Demo hint */}
          {!IS_FIREBASE_CONFIGURED && (
            <div className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-3 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-bold text-primary-600 dark:text-primary-400 mb-1 flex items-center gap-1">
                <Flame size={12} /> وضع تجريبي
              </p>
              <p>البريد: <span className="font-mono">{DEMO_CREDS[role]}</span></p>
              <p>الرقم السري: <span className="font-mono">demo1234</span></p>
            </div>
          )}

          <p className="text-center text-sm text-gray-500">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">أنشئ حساباً</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
