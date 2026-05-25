import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import MapView from '../../components/common/MapView'
import { vehicleTypes, paymentMethods } from '../../data/mockData'
import { MapPin, Navigation } from 'lucide-react'
import clsx from 'clsx'

export default function RequestRide() {
  const [from, setFrom]       = useState('')
  const [to, setTo]           = useState('')
  const [vehicle, setVehicle] = useState('economy')
  const [payment, setPayment] = useState('mada')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const { showNotification, setActiveRide } = useApp()
  const navigate = useNavigate()

  async function book() {
    if (!from || !to) {
      showNotification('يرجى إدخال نقطة الانطلاق والوجهة', 'error')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const selected = vehicleTypes.find(v => v.id === vehicle)
    setActiveRide({
      from,
      to,
      vehicle,
      driver: { name: 'محمد علي', rating: 4.9, car: 'تويوتا كامري 2023', plate: 'ن ص م 1234' },
      price: selected?.price ?? '—',
    })
    showNotification('تم تأكيد الطلب! جارٍ البحث عن سائق…', 'success')
    setLoading(false)
    setConfirmed(true)
    setTimeout(() => navigate('/passenger/track'), 800)
  }

  const selectedVehicle = vehicleTypes.find(v => v.id === vehicle)

  return (
    <Layout title="طلب مشوار">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Map preview */}
        <MapView from={from || 'موقعي الحالي'} to={to || 'الوجهة'} height="260px" />

        {/* Location inputs */}
        <div className="card space-y-3">
          <div className="relative">
            <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500" />
            <input
              className="input-field pr-11"
              placeholder="نقطة الانطلاق"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>
          <div className="h-px bg-gray-100 dark:bg-dark-border mx-2" />
          <div className="relative">
            <Navigation size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pr-11"
              placeholder="إلى أين؟"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>
        </div>

        {/* Vehicle type */}
        <div>
          <h3 className="font-bold mb-3 text-sm">نوع المركبة</h3>
          <div className="grid grid-cols-2 gap-3">
            {vehicleTypes.map(v => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id)}
                className={clsx(
                  'card text-right transition-all',
                  vehicle === v.id
                    ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'border-2 border-transparent hover:border-gray-200 dark:hover:border-dark-border'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{v.icon}</span>
                  {vehicle === v.id && <span className="text-primary-500 font-black text-xs">✓</span>}
                </div>
                <p className="font-bold text-sm">{v.label}</p>
                <p className="text-xs text-gray-400">{v.desc}</p>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-1">{v.price}</p>
                <p className="text-xs text-gray-400">{v.eta}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div>
          <h3 className="font-bold mb-3 text-sm">طريقة الدفع</h3>
          <div className="card flex items-center gap-3 flex-wrap">
            {paymentMethods.map(p => (
              <button
                key={p.id}
                onClick={() => setPayment(p.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all',
                  payment === p.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                )}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price summary */}
        {selectedVehicle && (
          <div className="card bg-gray-50 dark:bg-dark-border flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">التقدير المبدئي</p>
              <p className="font-black text-xl">{selectedVehicle.price}</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400">الوصول المتوقع</p>
              <p className="font-bold">{selectedVehicle.eta}</p>
            </div>
          </div>
        )}

        {/* Book button */}
        <button
          onClick={book}
          disabled={loading || confirmed}
          className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
        >
          {loading ? (
            <><span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> جارٍ البحث…</>
          ) : confirmed ? (
            '✓ تم تأكيد الطلب'
          ) : (
            'تأكيد الطلب'
          )}
        </button>
      </div>
    </Layout>
  )
}
