import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import { recentTrips } from '../../data/mockData'
import { Car, School, MapPin, Star, ChevronLeft, Tag } from 'lucide-react'
import clsx from 'clsx'

const vehicleTypes = [
  { id: 'car',    label: 'سيارة',        icon: '🚗', path: '/passenger/request?type=car' },
  { id: 'school', label: 'نقل مدرسي',   icon: '🚌', path: '/passenger/school' },
]

const statusStyle = {
  'مكتمل': 'badge-success',
  'ملغي':  'badge-error',
  'جارٍ':  'badge-warning',
}

export default function PassengerDashboard() {
  const { user } = useApp()
  const navigate  = useNavigate()

  return (
    <Layout title="الرئيسية">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Greeting */}
        <div className="card bg-gradient-to-l from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 text-black border-0">
          <p className="text-lg font-black">مرحباً، {user?.name || 'أحمد'} 👋</p>
          <p className="text-sm opacity-80 mt-1">إلى أين تريد الذهاب اليوم؟</p>
          {/* Quick search */}
          <button
            onClick={() => navigate('/passenger/request')}
            className="mt-4 w-full bg-white/90 hover:bg-white rounded-2xl px-4 py-3 flex items-center gap-3 text-right transition-colors"
          >
            <MapPin size={18} className="text-primary-600 shrink-0" />
            <span className="text-gray-400 font-medium text-sm flex-1">اكتب وجهتك…</span>
          </button>
        </div>

        {/* Vehicle type quick select */}
        <div>
          <h2 className="font-bold mb-3">اختر نوع الرحلة</h2>
          <div className="grid grid-cols-2 gap-3">
            {vehicleTypes.map(({ id, label, icon, path }) => (
              <button
                key={id}
                onClick={() => navigate(path)}
                className="card hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center gap-3 py-6"
              >
                <span className="text-4xl">{icon}</span>
                <span className="font-bold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promo banner */}
        <div className="card bg-gradient-to-l from-black to-gray-900 dark:from-dark-card text-white border-0 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shrink-0">
            <Tag size={22} className="text-black" />
          </div>
          <div className="flex-1">
            <p className="font-bold">خصم 20%</p>
            <p className="text-xs text-gray-400 mt-0.5">على أول رحلة مدرسية هذا الشهر</p>
          </div>
          <span className="text-primary-400 text-xs font-bold whitespace-nowrap">استخدم الآن</span>
        </div>

        {/* Recent trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">رحلاتي الأخيرة</h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1">
              عرض الكل <ChevronLeft size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentTrips.slice(0, 4).map(trip => (
              <div key={trip.id} className="card flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-gray-100 dark:bg-dark-border rounded-xl flex items-center justify-center shrink-0 text-lg">
                  🚗
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{trip.from}</p>
                  <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {trip.to}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{trip.date} · {trip.time}</p>
                </div>
                <div className="text-left shrink-0 space-y-1">
                  <span className={clsx('badge', statusStyle[trip.status] || 'badge-info')}>{trip.status}</span>
                  {trip.price > 0 && <p className="text-sm font-bold text-left">{trip.price} ر.س</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
