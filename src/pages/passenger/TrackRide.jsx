import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import MapView from '../../components/common/MapView'
import { Phone, MessageCircle, Star, X, Navigation } from 'lucide-react'

export default function TrackRide() {
  const { activeRide, setActiveRide, showNotification } = useApp()
  const navigate = useNavigate()
  const [eta, setEta] = useState(5)

  // Countdown ETA
  useEffect(() => {
    if (eta <= 0) return
    const t = setInterval(() => setEta(e => Math.max(0, e - 1)), 60000)
    return () => clearInterval(t)
  }, [eta])

  const ride = activeRide || {
    from:    'مدرسة الأمل الأهلية',
    to:      'حي الياسمين',
    driver:  { name: 'محمد علي', rating: 4.9, car: 'تويوتا كامري 2023', plate: 'ن ص م 1234' },
    price:   '25 ر.س',
  }

  function cancelRide() {
    showNotification('تم إلغاء الرحلة', 'error')
    setActiveRide(null)
    navigate('/passenger')
  }

  return (
    <Layout title="تتبع الرحلة">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Map */}
        <MapView from={ride.from} to={ride.to} height="300px" />

        {/* ETA chip */}
        <div className="flex gap-3">
          <div className="card flex-1 text-center bg-primary-500 text-black border-0">
            <p className="text-3xl font-black">{eta}:{String(Math.floor(Math.random()*60)).padStart(2,'0')}</p>
            <p className="text-xs font-semibold opacity-80 mt-1">الوقت المتبقي للوصول</p>
          </div>
          <div className="card flex-1 text-center">
            <p className="text-3xl font-black">{ride.price || '25 ر.س'}</p>
            <p className="text-xs text-gray-400 mt-1">السعر الإجمالي</p>
          </div>
        </div>

        {/* Driver card */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              👨‍✈️
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{ride.driver?.name}</p>
              <p className="text-sm text-gray-500">{ride.driver?.car}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={13} className="text-primary-500 fill-primary-500" />
                <span className="text-sm font-semibold">{ride.driver?.rating}</span>
                <span className="text-xs text-gray-400">• {ride.driver?.plate}</span>
              </div>
            </div>
            {/* Contact buttons */}
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors">
                <Phone size={18} />
              </button>
              <button className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>

          {/* Route */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
              <span className="text-gray-500">من:</span>
              <span className="font-semibold flex-1 truncate">{ride.from}</span>
            </div>
            <div className="w-0.5 h-4 bg-gray-200 dark:bg-dark-border mr-[3px]" />
            <div className="flex items-center gap-3 text-sm">
              <Navigation size={10} className="text-gray-400 shrink-0" />
              <span className="text-gray-500">إلى:</span>
              <span className="font-semibold flex-1 truncate">{ride.to}</span>
            </div>
          </div>
        </div>

        {/* Status timeline */}
        <div className="card">
          <p className="font-bold mb-4">حالة الرحلة</p>
          <div className="space-y-3">
            {[
              { label: 'تم قبول الطلب',          done: true },
              { label: 'السائق في الطريق إليك',  done: true },
              { label: 'تم الوصول لنقطة الانطلاق', done: false },
              { label: 'في الطريق للوجهة',        done: false },
              { label: 'تم الوصول',              done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0
                  ${s.done ? 'bg-primary-500 text-black' : 'bg-gray-200 dark:bg-dark-border text-gray-400'}`}>
                  {s.done ? '✓' : i + 1}
                </div>
                <span className={`text-sm ${s.done ? 'font-semibold' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel */}
        <button
          onClick={cancelRide}
          className="w-full py-3 rounded-2xl border-2 border-red-200 dark:border-red-900/50 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
        >
          <X size={18} /> إلغاء الرحلة
        </button>
      </div>
    </Layout>
  )
}
