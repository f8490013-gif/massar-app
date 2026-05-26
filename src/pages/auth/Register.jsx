import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { registerUser } from '../../firebase/auth'
import { IS_FIREBASE_CONFIGURED } from '../../firebase/config'
import { Car, User, ArrowLeft, Upload, CheckCircle } from 'lucide-react'

const steps = ['دورك', 'بياناتك', 'تأكيد']
const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'تبوك', 'أبها']

export default function Register() {
  const [step, setStep]   = useState(0)
  const [role, setRole]   = useState('passenger')
  const [form, setForm]   = useState({ name: '', email: '', phone: '', password: '', city: 'الرياض' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, showNotification } = useApp()
  const navigate = useNavigate()

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function finish() {
    setError('')
    setLoading(true)
    try {
      if (IS_FIREBASE_CONFIGURED) {
        await registerUser({ ...form, role })
      } else {
        await login(role)
      }
      showNotification('تم إنشاء حسابك بنجاح! 🎉', 'success')
      navigate(`/${role}`)
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use' ? 'البريد الإلكتروني مسجل مسبقاً' :
        err.code === 'auth/weak-password'         ? 'كلمة المرور ضعيفة (6 أحرف على الأقل)' :
        'حدث خطأ أثناء إنشاء الحساب'
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center font-black text-2xl text-black">م</div>
            <span className="font-black text-2xl">مسار</span>
          </Link>
          <h1 className="text-2xl font-black">إنشاء حساب جديد</h1>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-1 mb-6">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-500 text-black' : 'bg-gray-200 dark:bg-dark-muted text-gray-400'}`}>
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={`text-xs font-medium mx-1 ${i === step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>{label}</span>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-dark-muted'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card space-y-5">

          {/* Step 0 — Role */}
          {step === 0 && (
            <>
              <p className="font-semibold">كيف ستستخدم مسار؟</p>
              <div className="space-y-3">
                {[
                  { id: 'passenger', label: 'راكب', desc: 'احجز رحلات وتتبعها',         icon: User },
                  { id: 'driver',    label: 'سائق', desc: 'استقبل طلبات واربح أكثر',    icon: Car },
                ].map(({ id, label, desc, icon: Icon }) => (
                  <button key={id} onClick={() => setRole(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all
                      ${role === id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-200 dark:border-dark-border hover:border-gray-300'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${role === id ? 'bg-primary-500 text-black' : 'bg-gray-100 dark:bg-dark-border text-gray-500'}`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{label}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                    {role === id && <CheckCircle size={18} className="text-primary-500 shrink-0" />}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="btn-primary w-full">التالي</button>
            </>
          )}

          {/* Step 1 — Info */}
          {step === 1 && (
            <>
              <p className="font-semibold">أدخل بياناتك</p>
              <div className="space-y-3">
                <input className="input-field" placeholder="الاسم الكامل" value={form.name}     onChange={e => update('name', e.target.value)} required />
                <input className="input-field" type="email" placeholder="البريد الإلكتروني" value={form.email}    onChange={e => update('email', e.target.value)} required />
                <input className="input-field" placeholder="رقم الجوال (05xxxxxxxx)" value={form.phone}    onChange={e => update('phone', e.target.value)} />
                <input className="input-field" type="password" placeholder="كلمة المرور (6 أحرف +)" value={form.password} onChange={e => update('password', e.target.value)} required />
                <select className="input-field" value={form.city} onChange={e => update('city', e.target.value)}>
                  {cities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {role === 'driver' && (
                <div className="border-2 border-dashed border-gray-300 dark:border-dark-muted rounded-2xl p-5 text-center cursor-pointer hover:border-primary-400 transition-colors">
                  <Upload size={22} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-semibold">رفع وثائق السائق</p>
                  <p className="text-xs text-gray-400 mt-1">رخصة القيادة • هوية وطنية • رخصة المركبة</p>
                  <p className="text-xs text-primary-500 mt-2">(اختياري في المرحلة التجريبية)</p>
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-outline flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> السابق
                </button>
                <button
                  onClick={() => { if (!form.name || !form.email || !form.password) { setError('يرجى تعبئة جميع الحقول المطلوبة'); return } setError(''); setStep(2) }}
                  className="btn-primary flex-1"
                >
                  التالي
                </button>
              </div>
            </>
          )}

          {/* Step 2 — Confirm */}
          {step === 2 && (
            <>
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-3 text-3xl">🎉</div>
                <h3 className="font-black text-xl">كل شيء جاهز!</h3>
                <p className="text-gray-500 text-sm mt-1">راجع بياناتك ثم أنشئ الحساب</p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-border rounded-2xl p-4 space-y-2.5 text-sm">
                {[
                  ['الدور',  role === 'passenger' ? 'راكب' : 'سائق'],
                  ['الاسم',  form.name || '—'],
                  ['البريد', form.email || '—'],
                  ['المدينة', form.city],
                  ['الوضع',  IS_FIREBASE_CONFIGURED ? '🔥 Firebase مفعّل' : '🎭 تجريبي'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> تعديل
                </button>
                <button onClick={finish} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'إنشاء الحساب'}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-gray-500">
            لديك حساب؟ <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">سجّل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
