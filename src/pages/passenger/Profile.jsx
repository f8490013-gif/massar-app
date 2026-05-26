import { useState } from 'react'
import Layout from '../../components/Layout'
import { useApp } from '../../context/AppContext'
import { updateUserProfile } from '../../firebase/db'
import { Camera, Edit2, Save, Star, Car, Phone, Mail, MapPin, Loader } from 'lucide-react'

export default function PassengerProfile() {
  const { user, patchUser, showNotification, isFirebase } = useApp()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
    city:  user?.city  || 'الرياض',
  })

  async function save() {
    setSaving(true)
    try {
      if (isFirebase && user?.uid) {
        await updateUserProfile(user.uid, { name: form.name, phone: form.phone, city: form.city })
      }
      patchUser(form)
      setEditing(false)
      showNotification('تم حفظ التغييرات ✅', 'success')
    } catch {
      showNotification('حدث خطأ أثناء الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <Layout title="حسابي">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Avatar + name */}
        <div className="card flex flex-col items-center text-center py-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center text-5xl">
              👤
            </div>
            <button
              onClick={() => showNotification('تغيير الصورة — قريباً', 'info')}
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Camera size={14} className="text-black" />
            </button>
          </div>
          <h2 className="font-black text-2xl">{user?.name}</h2>
          <p className="text-gray-500 text-sm mt-1">راكب · {user?.city || 'الرياض'}</p>
          <div className="flex items-center gap-6 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={16} className="text-primary-500 fill-primary-500" />
                <span className="font-black">{user?.rating ?? '5.0'}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">التقييم</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-dark-border" />
            <div className="text-center">
              <p className="font-black">{user?.trips ?? 0}</p>
              <p className="text-xs text-gray-400 mt-0.5">رحلة</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-dark-border" />
            <div className="text-center">
              <p className="font-black">{(user?.balance ?? 0).toFixed(0)} ر.س</p>
              <p className="text-xs text-gray-400 mt-0.5">رصيدي</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">البيانات الشخصية</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="text-sm text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1">
                <Edit2 size={14} /> تعديل
              </button>
            ) : (
              <button onClick={save} disabled={saving}
                className="text-sm text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                حفظ
              </button>
            )}
          </div>

          <div className="space-y-4">
            {[
              { key: 'name',  label: 'الاسم الكامل',       icon: Car,   type: 'text'  },
              { key: 'phone', label: 'رقم الجوال',          icon: Phone, type: 'tel'   },
              { key: 'city',  label: 'المدينة',             icon: MapPin, type: 'text' },
            ].map(({ key, label, icon: Icon, type }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 dark:bg-dark-border rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  {editing ? (
                    <input
                      type={type}
                      className="input-field py-1.5 text-sm"
                      value={form[key]}
                      onChange={e => upd(key, e.target.value)}
                    />
                  ) : (
                    <p className="font-semibold text-sm">{user?.[key] || '—'}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Email — read-only */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-dark-border rounded-xl flex items-center justify-center shrink-0">
                <Mail size={16} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">البريد الإلكتروني</p>
                <p className="font-semibold text-sm">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mode indicator */}
        <div className="card bg-gray-50 dark:bg-dark-border text-center py-4">
          <p className="text-sm font-semibold">
            {isFirebase
              ? <><span className="text-green-500">🔥</span> متصل بـ Firebase — بياناتك محفوظة</>
              : <><span className="text-primary-500">🎭</span> الوضع التجريبي — لا يوجد اتصال بقاعدة البيانات</>
            }
          </p>
        </div>
      </div>
    </Layout>
  )
}
