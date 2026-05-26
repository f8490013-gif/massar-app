import { useState } from 'react'
import Layout from '../../components/Layout'
import { useApp } from '../../context/AppContext'
import { updateUserProfile } from '../../firebase/db'
import { Star, Car, Shield, Camera, Edit2, Save, Loader, Phone, Mail } from 'lucide-react'

export default function DriverProfile() {
  const { user, patchUser, showNotification, isFirebase } = useApp()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    car:     user?.car     || 'تويوتا كامري',
    plate:   user?.plate   || 'ن ص م 1234',
    carYear: user?.carYear || '2023',
    carColor: user?.carColor || 'أبيض',
  })

  async function save() {
    setSaving(true)
    try {
      if (isFirebase && user?.uid) {
        await updateUserProfile(user.uid, form)
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
    <Layout title="الملف الشخصي">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Avatar */}
        <div className="card flex flex-col items-center text-center py-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center text-5xl">
              👨‍✈️
            </div>
            <button
              onClick={() => showNotification('تغيير الصورة — قريباً', 'info')}
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Camera size={14} className="text-black" />
            </button>
          </div>
          <h2 className="font-black text-2xl">{user?.name}</h2>
          <p className="text-gray-500 text-sm mt-1">سائق معتمد · منذ 2022</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={16} className="text-primary-500 fill-primary-500" />
                <span className="font-black">{user?.rating ?? 4.9}</span>
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
              <p className="font-black">98%</p>
              <p className="text-xs text-gray-400 mt-0.5">قبول</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="card space-y-3">
          <h3 className="font-bold text-sm">بيانات التواصل</h3>
          {[
            { icon: Mail,  label: 'البريد',  value: user?.email,            key: null },
            { icon: Phone, label: 'الجوال',  value: user?.phone || '—',     key: 'phone' },
          ].map(({ icon: Icon, label, value, key }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-50 dark:bg-dark-border rounded-xl flex items-center justify-center shrink-0">
                <Icon size={15} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">{label}</p>
                {editing && key ? (
                  <input className="input-field py-1 text-sm" value={form[key]} onChange={e => upd(key, e.target.value)} />
                ) : (
                  <p className="font-semibold text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle info */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Car size={18} className="text-primary-500" /> بيانات المركبة
            </h3>
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
          <div className="space-y-3 text-sm">
            {[
              { label: 'نوع المركبة',  key: 'car'      },
              { label: 'موديل السنة',  key: 'carYear'  },
              { label: 'اللوحة',       key: 'plate'    },
              { label: 'اللون',        key: 'carColor' },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-500">{label}</span>
                {editing ? (
                  <input
                    defaultValue={form[key]}
                    onChange={e => upd(key, e.target.value)}
                    className="text-left font-semibold bg-gray-100 dark:bg-dark-border rounded-lg px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-primary-500 w-36"
                  />
                ) : (
                  <span className="font-semibold">{form[key]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Shield size={18} className="text-green-500" /> الوثائق والاعتماد
          </h3>
          <div className="space-y-3">
            {[
              { label: 'رخصة القيادة',   exp: '2026/03/15', ok: true  },
              { label: 'رخصة المركبة',   exp: '2025/11/20', ok: true  },
              { label: 'التأمين الشامل', exp: '2025/09/01', ok: false },
              { label: 'الهوية الوطنية', exp: '2027/06/30', ok: true  },
            ].map(doc => (
              <div key={doc.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${doc.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="flex-1 text-sm font-medium">{doc.label}</span>
                <span className={`text-xs ${doc.ok ? 'text-gray-400' : 'text-red-500 font-semibold'}`}>
                  {doc.ok ? `صالح حتى ${doc.exp}` : `منتهٍ ${doc.exp}`}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => showNotification('تحديث الوثائق — قريباً', 'info')}
            className="btn-outline w-full mt-4 text-sm py-2.5"
          >
            تحديث الوثائق
          </button>
        </div>
      </div>
    </Layout>
  )
}
