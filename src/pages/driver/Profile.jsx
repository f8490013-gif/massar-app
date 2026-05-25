import { useState } from 'react'
import Layout from '../../components/Layout'
import { useApp } from '../../context/AppContext'
import { Star, Car, Shield, Camera, Edit2 } from 'lucide-react'

export default function DriverProfile() {
  const { user, showNotification } = useApp()
  const [editing, setEditing] = useState(false)

  return (
    <Layout title="الملف الشخصي">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Avatar + name */}
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
          <h2 className="font-black text-2xl">{user?.name || 'أحمد السبيعي'}</h2>
          <p className="text-gray-500 text-sm mt-1">سائق معتمد · منذ 2022</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={16} className="text-primary-500 fill-primary-500" />
                <span className="font-black">4.9</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">التقييم</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-dark-border" />
            <div className="text-center">
              <p className="font-black">312</p>
              <p className="text-xs text-gray-400 mt-0.5">رحلة</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-dark-border" />
            <div className="text-center">
              <p className="font-black">98%</p>
              <p className="text-xs text-gray-400 mt-0.5">قبول</p>
            </div>
          </div>
        </div>

        {/* Vehicle info */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><Car size={18} className="text-primary-500" /> بيانات المركبة</h3>
            <button onClick={() => setEditing(e => !e)} className="text-sm text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1">
              <Edit2 size={14} /> تعديل
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ['نوع المركبة',   'تويوتا كامري'],
              ['موديل السنة',   '2023'],
              ['اللوحة',        'ن ص م 1234'],
              ['اللون',         'أبيض'],
              ['نوع الخدمة',    'سيارة + نقل مدرسي'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-500">{label}</span>
                {editing
                  ? <input defaultValue={value} className="text-left font-semibold bg-gray-100 dark:bg-dark-border rounded-lg px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-primary-500 w-36" />
                  : <span className="font-semibold">{value}</span>
                }
              </div>
            ))}
          </div>
          {editing && (
            <button onClick={() => { setEditing(false); showNotification('تم حفظ التغييرات', 'success') }}
              className="btn-primary w-full mt-4 text-sm py-2.5">
              حفظ التغييرات
            </button>
          )}
        </div>

        {/* Documents */}
        <div className="card">
          <h3 className="font-bold flex items-center gap-2 mb-4"><Shield size={18} className="text-green-500" /> الوثائق والاعتماد</h3>
          <div className="space-y-3">
            {[
              { label: 'رخصة القيادة',    exp: '2026/03/15', ok: true },
              { label: 'رخصة المركبة',    exp: '2025/11/20', ok: true },
              { label: 'التأمين الشامل',  exp: '2025/09/01', ok: false },
              { label: 'الهوية الوطنية',  exp: '2027/06/30', ok: true },
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
        </div>
      </div>
    </Layout>
  )
}
