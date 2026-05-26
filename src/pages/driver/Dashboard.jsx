import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import RealMap from '../../components/common/RealMap'
import { driverRequests, driverCurrentRides } from '../../data/mockData'
import { Phone, MapPin, Clock, User, Star, CheckCircle, XCircle, Navigation } from 'lucide-react'
import clsx from 'clsx'

// Mock coords for demo requests
const REQUEST_COORDS = {
  'r1': { from: [24.7200, 46.6900], to: [24.7748, 46.7264] },
  'r2': { from: [24.7300, 46.7100], to: [24.6900, 46.7200] },
  'r3': { from: [24.7115, 46.6742], to: [24.9578, 46.6989] },
}

export default function DriverDashboard() {
  const { user, showNotification } = useApp()
  const navigate  = useNavigate()
  const [requests, setRequests]   = useState(driverRequests)
  const [online, setOnline]       = useState(true)
  const [activeRide, setActiveRide] = useState(null)
  const [expandedReq, setExpandedReq] = useState(null)

  // Driver's mock current position (Riyadh center)
  const driverPos = [24.7136, 46.6753]

  function accept(id) {
    const req = requests.find(r => r.id === id)
    setRequests(rs => rs.filter(r => r.id !== id))
    setActiveRide({
      ...req,
      status:      'في الطريق',
      eta:         '7 دقائق',
      phone:       '+966501234567',
      fromCoords:  REQUEST_COORDS[id]?.from,
      toCoords:    REQUEST_COORDS[id]?.to,
    })
    showNotification('تم قبول الطلب! اتجه لنقطة الانطلاق 🚗', 'success')
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

        {/* Driver status bar */}
        <div className="card flex items-center gap-4">
          <div className="flex-1">
            <p className="font-black text-lg">{user?.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star size={14} className="text-primary-500 fill-primary-500" />
              <span className="text-sm font-semibold">{user?.rating}</span>
              <span className="text-xs text-gray-400">• {user?.trips} رحلة</span>
              <span className={`badge mr-2 ${online ? 'badge-success' : 'badge-error'}`}>
                {online ? 'متاح' : 'غير متاح'}
              </span>
            </div>
          </div>
          <div className="text-center px-4 border-l border-r border-gray-100 dark:border-dark-border">
            <p className="text-xs text-gray-400 mb-0.5">اليوم</p>
            <p className="font-black text-lg text-primary-600 dark:text-primary-400">45.60 ر.س</p>
          </div>
          {/* Online toggle */}
          <button
            onClick={() => {
              setOnline(o => !o)
              showNotification(online ? 'أصبحت غير متاح' : 'أصبحت متاحاً للطلبات 🟢', online ? 'error' : 'success')
            }}
            className={clsx(
              'relative w-14 h-7 rounded-full transition-colors duration-300 shrink-0',
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
            {activeRide.fromCoords && activeRide.toCoords && (
              <RealMap
                origin={activeRide.fromCoords}
                destination={activeRide.toCoords}
                driverPos={driverPos}
                height="220px"
                interactive
              />
            )}
            <div className="card border-2 border-primary-500">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-black text-lg">{activeRide.passenger}</p>
                  <span className="badge badge-warning">{activeRide.status}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${activeRide.phone}`}
                    className="w-10 h-10 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center"
                  >
                    <Phone size={18} />
                  </a>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0" />
                  <span className="text-gray-500">من:</span>
                  <span className="font-semibold truncate">{activeRide.from}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation size={12} className="text-gray-400 shrink-0" />
                  <span className="text-gray-500">إلى:</span>
                  <span className="font-semibold truncate">{activeRide.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-gray-400 shrink-0" />
                  <span className="text-gray-500">الوصول المتوقع:</span>
                  <span className="font-semibold">{activeRide.eta}</span>
                </div>
              </div>
              <button onClick={completeRide} className="btn-primary w-full mt-4">
                إتمام الرحلة — {activeRide.price} ر.س
              </button>
            </div>
          </div>
        )}

        {/* Incoming requests */}
        {online && !activeRide && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">الطلبات الواردة</h2>
              <span className="badge badge-success">{requests.length} طلب</span>
            </div>

            {requests.length === 0 ? (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-5xl mb-3">🚦</p>
                <p className="font-semibold">لا توجد طلبات حالياً</p>
                <p className="text-sm mt-1">سيصلك إشعار فور وجود طلب جديد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(req => {
                  const coords = REQUEST_COORDS[req.id]
                  const isExpanded = expandedReq === req.id
                  return (
                    <div key={req.id} className="card hover:shadow-md transition-shadow">
                      {/* Header */}
                      <button
                        className="w-full flex items-center gap-3 mb-3 text-right"
                        onClick={() => setExpandedReq(isExpanded ? null : req.id)}
                      >
                        <div className="w-10 h-10 bg-gray-100 dark:bg-dark-border rounded-xl flex items-center justify-center text-xl shrink-0">
                          {req.type === 'school' ? '🚌' : '🚗'}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{req.passenger}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock size={11} /> {req.time}
                            {req.children > 0 && <><User size={11} /> {req.children} أطفال</>}
                            <span className="mr-1">{req.distance}</span>
                          </div>
                        </div>
                        <p className="font-black text-xl text-primary-600 dark:text-primary-400 shrink-0">{req.price} ر.س</p>
                      </button>

                      {/* Route info */}
                      <div className="space-y-1.5 text-sm mb-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{req.from}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{req.to}</span>
                        </div>
                      </div>

                      {/* Expandable map */}
                      {isExpanded && coords && (
                        <div className="mb-3 animate-fade-in">
                          <RealMap
                            origin={coords.from}
                            destination={coords.to}
                            driverPos={driverPos}
                            height="180px"
                            interactive={false}
                          />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => reject(req.id)}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <XCircle size={16} /> رفض
                        </button>
                        <button
                          onClick={() => accept(req.id)}
                          className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                        >
                          <CheckCircle size={16} /> قبول
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Offline state */}
        {!online && (
          <div className="card text-center py-14 text-gray-400">
            <p className="text-5xl mb-4">😴</p>
            <p className="font-bold text-lg">أنت غير متاح حالياً</p>
            <p className="text-sm mt-1">فعّل مفتاح الاستعداد أعلاه لاستقبال الطلبات</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
