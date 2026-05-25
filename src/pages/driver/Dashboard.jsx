import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import MapView from '../../components/common/MapView'
import { driverRequests, driverCurrentRides } from '../../data/mockData'
import { Phone, MapPin, Clock, User, Star, CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'

export default function DriverDashboard() {
  const { user, showNotification } = useApp()
  const navigate = useNavigate()
  const [requests, setRequests] = useState(driverRequests)
  const [online, setOnline]   = useState(true)
  const [activeRide, setActiveRide] = useState(driverCurrentRides[0] || null)

  function accept(id) {
    const req = requests.find(r => r.id === id)
    setRequests(rs => rs.filter(r => r.id !== id))
    setActiveRide({ ...req, status: 'في الطريق', eta: '7 دقائق', phone: '+966501234567' })
    showNotification('تم قبول الطلب! اتجه لنقطة الانطلاق', 'success')
  }

  function reject(id) {
    setRequests(rs => rs.filter(r => r.id !== id))
    showNotification('تم رفض الطلب', 'error')
  }

  function completeRide() {
    showNotification('تم إتمام الرحلة بنجاح! 🎉', 'success')
    setActiveRide(null)
  }

  return (
    <Layout title="استقبال الطلبات">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Online toggle + today stats */}
        <div className="card flex items-center gap-4">
          <div className="flex-1">
            <p className="font-black text-lg">{user?.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star size={14} className="text-primary-500 fill-primary-500" />
              <span className="text-sm font-semibold">{user?.rating}</span>
              <span className="text-xs text-gray-400">• {user?.trips} رحلة</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">اليوم</p>
            <p className="font-black text-lg">45.60 ر.س</p>
          </div>
          {/* Toggle */}
          <button
            onClick={() => { setOnline(o => !o); showNotification(online ? 'أصبحت غير متاح' : 'أصبحت متاحاً للطلبات', online ? 'error' : 'success') }}
            className={clsx(
              'relative w-14 h-7 rounded-full transition-colors duration-300',
              online ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-muted'
            )}
          >
            <span className={clsx(
              'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300',
              online ? 'right-0.5' : 'left-0.5'
            )} />
          </button>
        </div>

        {/* Active ride */}
        {activeRide && (
          <div className="space-y-3">
            <h2 className="font-bold">الرحلة الحالية</h2>
            <MapView from={activeRide.from} to={activeRide.to} height="200px" />
            <div className="card border-2 border-primary-500">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-black text-lg">{activeRide.passenger}</p>
                  <span className="badge badge-warning">{activeRide.status || 'في الطريق'}</span>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${activeRide.phone}`}
                    className="w-10 h-10 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center">
                    <Phone size={18} />
                  </a>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={14} className="text-primary-500" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{activeRide.from}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={14} />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{activeRide.to}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={14} />
                  <span>الوصول: {activeRide.eta || '8 دقائق'}</span>
                </div>
              </div>
              <button onClick={completeRide} className="btn-primary w-full mt-4">
                إتمام الرحلة — {activeRide.price || '28.00'} ر.س
              </button>
            </div>
          </div>
        )}

        {/* Incoming requests */}
        {online && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">الطلبات الواردة</h2>
              <span className="badge badge-success">{requests.length} طلب</span>
            </div>
            {requests.length === 0 ? (
              <div className="card text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">🚦</p>
                <p className="font-semibold">لا توجد طلبات حالياً</p>
                <p className="text-sm mt-1">سيصلك إشعار فور وجود طلب جديد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-dark-border rounded-xl flex items-center justify-center text-xl shrink-0">
                        {req.type === 'school' ? '🚌' : '🚗'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{req.passenger}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={11} /> {req.time}
                          {req.children > 0 && <><User size={11} /> {req.children} أطفال</>}
                        </div>
                      </div>
                      <p className="font-black text-lg text-primary-600 dark:text-primary-400">{req.price} ر.س</p>
                    </div>
                    <div className="space-y-1.5 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{req.from}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{req.to}</span>
                      </div>
                      <p className="text-gray-400 text-xs">المسافة: {req.distance}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => reject(req.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <XCircle size={16} /> رفض
                      </button>
                      <button onClick={() => accept(req.id)} className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
                        <CheckCircle size={16} /> قبول
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!online && (
          <div className="card text-center py-12 text-gray-400">
            <p className="text-5xl mb-4">😴</p>
            <p className="font-bold text-lg">أنت غير متاح حالياً</p>
            <p className="text-sm mt-1">فعّل وضع الاستعداد لاستقبال الطلبات</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
