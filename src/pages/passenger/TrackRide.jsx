import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import RealMap from '../../components/common/RealMap'
import { RIYADH_CENTER } from '../../hooks/useGeolocation'
import { Phone, MessageCircle, Star, X, Navigation, CheckCircle2 } from 'lucide-react'

// Linearly interpolate between two [lat,lng] points
function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

const STEPS = [
  { label: 'تم قبول الطلب',             done: true  },
  { label: 'السائق في الطريق إليك',     done: true  },
  { label: 'تم الوصول لنقطة الانطلاق', done: false },
  { label: 'في الطريق للوجهة',          done: false },
  { label: 'تم الوصول بأمان',           done: false },
]

export default function TrackRide() {
  const { activeRide, setActiveRide, showNotification } = useApp()
  const navigate = useNavigate()

  // ── Fallback demo ride ────────────────────────────────────────────────
  const ride = activeRide ?? {
    from:        'مدرسة الأمل الأهلية',
    to:          'حي الياسمين',
    fromCoords:  [24.7200, 46.6900],
    toCoords:    [24.7748, 46.7264],
    driverStart: [24.7050, 46.6750],
    driver: { name: 'محمد علي', rating: 4.9, car: 'تويوتا كامري 2023', plate: 'ن ص م 1234', phone: '+966501234567' },
    price: 'من 25 ر.س',
  }

  const origin  = ride.fromCoords  ?? RIYADH_CENTER
  const dest    = ride.toCoords    ?? [origin[0] + 0.05, origin[1] + 0.06]
  const drvStart = ride.driverStart ?? [origin[0] - 0.012, origin[1] - 0.008]

  // ── Driver position animation ─────────────────────────────────────────
  const [progress, setProgress] = useState(0)         // 0 → 1 over ~5 min
  const [steps, setSteps]       = useState(STEPS)
  const [arrived, setArrived]   = useState(false)

  // Driver moves: driverStart → origin (first 30%) → dest (30–100%)
  const driverPos = (() => {
    if (progress < 0.3) return lerp(drvStart, origin, progress / 0.3)
    return lerp(origin, dest, (progress - 0.3) / 0.7)
  })()

  useEffect(() => {
    if (arrived) return
    const id = setInterval(() => {
      setProgress(p => {
        const next = p + 0.002          // full trip ≈ 500 ticks = ~8 min

        // Unlock step 3 when driver reaches origin
        if (next >= 0.3 && !steps[2].done) {
          setSteps(s => s.map((st, i) => i === 2 ? { ...st, done: true } : st))
          showNotification('وصل السائق — يمكنك الركوب الآن 🚗', 'info')
        }
        // Unlock step 4
        if (next >= 0.5 && !steps[3].done) {
          setSteps(s => s.map((st, i) => i === 3 ? { ...st, done: true } : st))
        }
        // Arrived
        if (next >= 1) {
          setSteps(s => s.map(st => ({ ...st, done: true })))
          setArrived(true)
          showNotification('تم الوصول بأمان! 🎉', 'success')
          clearInterval(id)
          return 1
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrived])

  // ── ETA countdown ─────────────────────────────────────────────────────
  const totalSecs = Math.round((1 - progress) * 480)    // 480s = 8 min total
  const etaMin = Math.floor(totalSecs / 60)
  const etaSec = totalSecs % 60

  // ── Price string ──────────────────────────────────────────────────────
  const priceDisplay = typeof ride.price === 'string' ? ride.price : `${ride.price} ر.س`

  function cancelRide() {
    showNotification('تم إلغاء الرحلة', 'error')
    setActiveRide(null)
    navigate('/passenger')
  }

  return (
    <Layout title="تتبع الرحلة">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Live map */}
        <RealMap
          origin={origin}
          destination={dest}
          driverPos={driverPos}
          height="300px"
          interactive
        />

        {/* ETA + price */}
        <div className="flex gap-3">
          <div className={`card flex-1 text-center border-0 transition-colors ${arrived ? 'bg-green-500' : 'bg-primary-500'} text-black`}>
            {arrived ? (
              <>
                <CheckCircle2 size={28} className="mx-auto mb-1" />
                <p className="text-sm font-bold">وصلت!</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-black tabular-nums">
                  {String(etaMin).padStart(2, '0')}:{String(etaSec).padStart(2, '0')}
                </p>
                <p className="text-xs font-semibold opacity-80 mt-1">الوقت المتبقي</p>
              </>
            )}
          </div>
          <div className="card flex-1 text-center">
            <p className="text-2xl font-black">{priceDisplay}</p>
            <p className="text-xs text-gray-400 mt-1">السعر الإجمالي</p>
          </div>
        </div>

        {/* Driver card */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              👨‍✈️
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg">{ride.driver?.name}</p>
              <p className="text-sm text-gray-500 truncate">{ride.driver?.car}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 text-sm">
                  <Star size={13} className="text-primary-500 fill-primary-500" />
                  <strong>{ride.driver?.rating}</strong>
                </span>
                <span className="text-xs bg-gray-100 dark:bg-dark-border px-2 py-0.5 rounded-lg font-mono">
                  {ride.driver?.plate}
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={`tel:${ride.driver?.phone}`}
                className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors"
              >
                <Phone size={18} />
              </a>
              <button className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>

          {/* Route summary */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border space-y-2">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0 mt-1.5" />
              <div>
                <p className="text-gray-400 text-xs">من</p>
                <p className="font-semibold">{ride.from}</p>
              </div>
            </div>
            <div className="w-0.5 h-4 bg-gray-200 dark:bg-dark-border mr-1" />
            <div className="flex items-start gap-3 text-sm">
              <Navigation size={12} className="text-gray-400 shrink-0 mt-1" />
              <div>
                <p className="text-gray-400 text-xs">إلى</p>
                <p className="font-semibold">{ride.to}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status timeline */}
        <div className="card">
          <p className="font-bold mb-4">حالة الرحلة</p>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-500
                  ${s.done ? 'bg-primary-500 text-black' : 'bg-gray-100 dark:bg-dark-border text-gray-400'}`}>
                  {s.done ? '✓' : i + 1}
                </div>
                <span className={`text-sm transition-colors ${s.done ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {i === 1 && !steps[2].done && (
                  <span className="mr-auto text-xs text-primary-500 font-bold animate-pulse">جارٍ…</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cancel / Rate */}
        {arrived ? (
          <button
            onClick={() => { setActiveRide(null); navigate('/passenger') }}
            className="btn-primary w-full py-4 text-lg"
          >
            تقييم الرحلة ⭐
          </button>
        ) : (
          <button
            onClick={cancelRide}
            className="w-full py-3 rounded-2xl border-2 border-red-200 dark:border-red-900/50 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} /> إلغاء الرحلة
          </button>
        )}
      </div>
    </Layout>
  )
}
