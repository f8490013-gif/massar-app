import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useApp } from '../../context/AppContext'
import { School, Plus, Trash2, Clock, MapPin, ChevronLeft } from 'lucide-react'

const schools = ['مدرسة الأمل الأهلية', 'مدرسة النخيل الدولية', 'مدرسة التقوى', 'مدرسة الرواد', 'مدرسة الإتقان']

const registeredChildren = [
  { id: 'c1', name: 'محمد أحمد',   school: 'مدرسة الأمل الأهلية',  time: '07:15 ص', grade: 'الصف الرابع' },
  { id: 'c2', name: 'سارة أحمد',   school: 'مدرسة النخيل الدولية', time: '07:00 ص', grade: 'الصف السادس' },
]

export default function SchoolTransport() {
  const [children] = useState(registeredChildren)
  const [showAdd, setShowAdd] = useState(false)
  const { showNotification } = useApp()
  const navigate = useNavigate()

  return (
    <Layout title="النقل المدرسي">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Header card */}
        <div className="card bg-gradient-to-l from-blue-600 to-blue-500 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🚌</div>
            <div>
              <p className="font-black text-xl">النقل المدرسي</p>
              <p className="text-blue-100 text-sm mt-1">نقل آمن ومنظم لأطفالك</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5 text-center">
            {[['48', 'مدرسة'], ['99%', 'وصول بالوقت'], ['4.9★', 'تقييم']].map(([v, l]) => (
              <div key={l} className="bg-white/15 rounded-xl py-2">
                <p className="font-black">{v}</p>
                <p className="text-xs text-blue-100">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registered children */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">أطفالي المسجلون</h2>
            <button
              onClick={() => setShowAdd(s => !s)}
              className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl"
            >
              <Plus size={14} /> إضافة طفل
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="card mb-3 space-y-3 animate-slide-up border-2 border-primary-200 dark:border-primary-800">
              <p className="font-bold text-sm">بيانات الطفل</p>
              <input className="input-field" placeholder="اسم الطفل" />
              <select className="input-field">
                <option value="">اختر المدرسة</option>
                {schools.map(s => <option key={s}>{s}</option>)}
              </select>
              <input className="input-field" placeholder="الصف الدراسي" />
              <input className="input-field" type="time" defaultValue="07:00" />
              <button
                onClick={() => { showNotification('تم تسجيل الطفل بنجاح', 'success'); setShowAdd(false) }}
                className="btn-primary w-full"
              >
                تسجيل
              </button>
            </div>
          )}

          <div className="space-y-3">
            {children.map(child => (
              <div key={child.id} className="card flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-xl shrink-0">
                  👦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{child.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <School size={11} /> {child.school}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} /> {child.time}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{child.grade}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/passenger/track')}
                    className="text-xs bg-primary-500 text-black font-bold px-3 py-1.5 rounded-xl"
                  >
                    تتبع
                  </button>
                  <button className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                    <Trash2 size={12} /> حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today schedule */}
        <div>
          <h2 className="font-bold mb-3">جدول اليوم</h2>
          <div className="card space-y-3">
            {[
              { time: '07:00 ص', label: 'التوجه للمدرسة', child: 'سارة أحمد',   status: 'مكتمل' },
              { time: '07:15 ص', label: 'التوجه للمدرسة', child: 'محمد أحمد',   status: 'مكتمل' },
              { time: '01:30 م', label: 'العودة للمنزل',  child: 'سارة أحمد',   status: 'قادم' },
              { time: '02:00 م', label: 'العودة للمنزل',  child: 'محمد أحمد',   status: 'قادم' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-xs text-gray-400 w-14 text-left shrink-0">{item.time}</div>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.status === 'مكتمل' ? 'bg-green-500' : 'bg-gray-300 dark:bg-dark-muted'}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.child}</p>
                </div>
                <span className={`text-xs font-bold ${item.status === 'مكتمل' ? 'text-green-500' : 'text-gray-400'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
