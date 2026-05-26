import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import RealMap from '../../components/common/RealMap'
import { useApp } from '../../context/AppContext'
import { School, Plus, Trash2, Clock, MapPin, Shield, Bus } from 'lucide-react'

const schools = ['مدرسة الأمل الأهلية', 'مدرسة النخيل الدولية', 'مدرسة التقوى', 'مدرسة الرواد', 'مدرسة الإتقان']

// Mock school/home coordinates (Riyadh)
const SCHOOL_COORDS = {
  'مدرسة الأمل الأهلية':  [24.7200, 46.6900],
  'مدرسة النخيل الدولية': [24.7300, 46.7100],
  'مدرسة التقوى':          [24.7050, 46.6800],
  'مدرسة الرواد':          [24.7400, 46.7000],
  'مدرسة الإتقان':         [24.7150, 46.7200],
}
const HOME_COORDS = [24.7748, 46.7264] // حي الياسمين

const registeredChildren = [
  { id: 'c1', name: 'محمد أحمد',  school: 'مدرسة الأمل الأهلية',  time: '07:15 ص', grade: 'الصف الرابع',  status: 'وصل' },
  { id: 'c2', name: 'سارة أحمد',  school: 'مدرسة النخيل الدولية', time: '07:00 ص', grade: 'الصف السادس', status: 'في الطريق' },
]

export default function SchoolTransport() {
  const [children, setChildren] = useState(registeredChildren)
  const [showAdd, setShowAdd]   = useState(false)
  const [selected, setSelected] = useState(registeredChildren[0])
  const [newChild, setNewChild] = useState({ name: '', school: schools[0], grade: '', time: '07:00' })

  const { showNotification } = useApp()
  const navigate = useNavigate()

  function addChild() {
    if (!newChild.name || !newChild.grade) {
      showNotification('يرجى إدخال الاسم والصف', 'error')
      return
    }
    const child = { id: `c${Date.now()}`, ...newChild, time: `${newChild.time} ص`, status: 'غير مجدول' }
    setChildren(c => [...c, child])
    setShowAdd(false)
    setNewChild({ name: '', school: schools[0], grade: '', time: '07:00' })
    showNotification('تم تسجيل الطفل بنجاح ✅', 'success')
  }

  function removeChild(id) {
    setChildren(c => c.filter(ch => ch.id !== id))
    showNotification('تم حذف التسجيل', 'error')
  }

  const schoolCoords = selected ? SCHOOL_COORDS[selected.school] : null

  return (
    <Layout title="النقل المدرسي">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Header */}
        <div className="card bg-gradient-to-l from-blue-600 to-blue-500 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🚌</div>
            <div>
              <p className="font-black text-xl">النقل المدرسي</p>
              <p className="text-blue-100 text-sm mt-0.5">نقل آمن ومنظم لأطفالك</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            {[['48', 'مدرسة'], ['99%', 'وصول بالوقت'], ['4.9★', 'تقييم']].map(([v, l]) => (
              <div key={l} className="bg-white/15 rounded-xl py-2">
                <p className="font-black">{v}</p>
                <p className="text-xs text-blue-100">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live map for selected child */}
        {selected && schoolCoords && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-sm">خريطة رحلة {selected.name}</p>
              <span className={`badge ${selected.status === 'وصل' ? 'badge-success' : selected.status === 'في الطريق' ? 'badge-warning' : 'badge-info'}`}>
                {selected.status}
              </span>
            </div>
            <RealMap
              homePos={HOME_COORDS}
              schoolPos={schoolCoords}
              driverPos={selected.status === 'في الطريق'
                ? [HOME_COORDS[0] - 0.025, HOME_COORDS[1] - 0.018]
                : undefined
              }
              height="220px"
              interactive
            />
          </div>
        )}

        {/* Children list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">أطفالي المسجلون ({children.length})</h2>
            <button
              onClick={() => setShowAdd(s => !s)}
              className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl"
            >
              <Plus size={14} /> إضافة
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="card mb-3 space-y-3 animate-slide-up border-2 border-primary-200 dark:border-primary-800">
              <p className="font-bold text-sm">بيانات الطفل الجديد</p>
              <input className="input-field" placeholder="اسم الطفل" value={newChild.name} onChange={e => setNewChild(n => ({ ...n, name: e.target.value }))} />
              <select className="input-field" value={newChild.school} onChange={e => setNewChild(n => ({ ...n, school: e.target.value }))}>
                {schools.map(s => <option key={s}>{s}</option>)}
              </select>
              <input className="input-field" placeholder="الصف الدراسي (مثال: الصف الثالث)" value={newChild.grade} onChange={e => setNewChild(n => ({ ...n, grade: e.target.value }))} />
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500 shrink-0">وقت الانطلاق</label>
                <input type="time" className="input-field" value={newChild.time} onChange={e => setNewChild(n => ({ ...n, time: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)} className="btn-outline flex-1 text-sm py-2.5">إلغاء</button>
                <button onClick={addChild} className="btn-primary flex-1 text-sm py-2.5">تسجيل</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {children.map(child => (
              <div
                key={child.id}
                onClick={() => setSelected(child)}
                className={`card flex items-center gap-4 cursor-pointer transition-all hover:shadow-md
                  ${selected?.id === child.id ? 'border-2 border-blue-400 dark:border-blue-600' : 'border-2 border-transparent'}`}
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-xl shrink-0">
                  👦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{child.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 truncate">
                    <School size={11} /> {child.school}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} /> {child.time}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{child.grade}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0 items-end">
                  <span className={`badge ${child.status === 'وصل' ? 'badge-success' : child.status === 'في الطريق' ? 'badge-warning' : 'badge-info'}`}>
                    {child.status}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); removeChild(child.id) }}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety features */}
        <div className="card">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={18} className="text-green-500" /> مزايا الأمان</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📍', label: 'تتبع لحظي',       desc: 'تابع موقع طفلك في الوقت الفعلي' },
              { icon: '🔔', label: 'إشعارات فورية',   desc: 'عند الوصول والمغادرة' },
              { icon: '👨‍✈️', label: 'سائقون معتمدون', desc: 'تدقيق أمني كامل' },
              { icon: '🚌', label: 'سيارات مؤمّنة',   desc: 'تأمين شامل لكل رحلة' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-border rounded-2xl">
                <span className="text-xl shrink-0">{f.icon}</span>
                <div>
                  <p className="font-bold text-xs">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today schedule */}
        <div className="card">
          <h3 className="font-bold mb-4">جدول اليوم</h3>
          <div className="space-y-3">
            {[
              { time: '07:00 ص', label: 'توجّه سارة للمدرسة',  status: 'مكتمل', icon: '✅' },
              { time: '07:15 ص', label: 'توجّه محمد للمدرسة',  status: 'مكتمل', icon: '✅' },
              { time: '01:30 م', label: 'عودة سارة للمنزل',    status: 'قادم',  icon: '⏳' },
              { time: '02:00 م', label: 'عودة محمد للمنزل',    status: 'قادم',  icon: '⏳' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div className="text-xs text-gray-400 w-14 shrink-0">{item.time}</div>
                <span className={`flex-1 text-sm font-medium ${item.status === 'مكتمل' ? '' : 'text-gray-400'}`}>{item.label}</span>
                <span className={`text-xs font-bold ${item.status === 'مكتمل' ? 'text-green-500' : 'text-gray-400'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
