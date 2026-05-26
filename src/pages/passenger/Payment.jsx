import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { useApp } from '../../context/AppContext'
import { getPassengerTrips } from '../../firebase/db'
import { recentTrips as mockTrips } from '../../data/mockData'
import { CreditCard, Plus, Check, Loader } from 'lucide-react'
import clsx from 'clsx'

const methods = [
  { id: 'applepay', label: 'Apple Pay', icon: '🍎', last4: null },
  { id: 'mada',     label: 'مدى',       icon: '💳', last4: '4521' },
  { id: 'visa',     label: 'فيزا',      icon: '💳', last4: '9312' },
  { id: 'cash',     label: 'نقداً',     icon: '💵', last4: null },
]

const statusAr = {
  completed: 'مكتمل',
  cancelled: 'ملغي',
  pending:   'معلق',
  accepted:  'قيد التنفيذ',
}

export default function Payment() {
  const [selected, setSelected]     = useState('mada')
  const [trips, setTrips]           = useState([])
  const [loadingTrips, setLoadingTrips] = useState(false)
  const { user, isFirebase, showNotification } = useApp()

  useEffect(() => {
    if (isFirebase && user?.uid) {
      setLoadingTrips(true)
      getPassengerTrips(user.uid)
        .then(data => setTrips(data.filter(t => t.priceNum > 0 || t.price > 0)))
        .catch(() => setTrips(mockTrips.filter(t => t.price > 0)))
        .finally(() => setLoadingTrips(false))
    } else {
      setTrips(mockTrips.filter(t => t.price > 0))
    }
  }, [isFirebase, user?.uid])

  const total = trips.reduce((s, t) => s + (Number(t.priceNum) || Number(t.price) || 0), 0)

  return (
    <Layout title="الدفع">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Wallet */}
        <div className="card bg-gradient-to-l from-primary-500 to-primary-400 text-black border-0">
          <p className="text-sm font-semibold opacity-80">محفظة مسار</p>
          <p className="text-4xl font-black mt-1">{(user?.balance ?? 0).toFixed(2)} <span className="text-xl">ر.س</span></p>
          <button
            onClick={() => showNotification('شحن المحفظة — قريباً', 'info')}
            className="mt-4 bg-black/20 hover:bg-black/30 text-black font-bold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            شحن الرصيد
          </button>
        </div>

        {/* Payment methods */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">طرق الدفع</h2>
            <button
              onClick={() => showNotification('إضافة بطاقة — قريباً', 'info')}
              className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 font-bold"
            >
              <Plus size={14} /> إضافة بطاقة
            </button>
          </div>
          <div className="space-y-3">
            {methods.map(m => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                className={clsx(
                  'w-full card flex items-center gap-4 transition-all',
                  selected === m.id ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-2 border-transparent'
                )}>
                <div className="w-12 h-12 bg-gray-100 dark:bg-dark-border rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-bold text-sm">{m.label}</p>
                  {m.last4 && <p className="text-xs text-gray-400">**** **** **** {m.last4}</p>}
                </div>
                {selected === m.id && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">سجل المعاملات</h2>
            {trips.length > 0 && (
              <span className="text-xs text-gray-400 font-semibold">
                الإجمالي: <span className="text-primary-600 dark:text-primary-400 font-bold">{total} ر.س</span>
              </span>
            )}
          </div>

          {loadingTrips ? (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
              <Loader size={18} className="animate-spin" /> جارٍ التحميل…
            </div>
          ) : trips.length === 0 ? (
            <div className="card text-center py-8 text-gray-400">
              <CreditCard size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-semibold">لا توجد معاملات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="card flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-dark-border rounded-xl flex items-center justify-center text-lg shrink-0">🚗</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{trip.from} ← {trip.to}</p>
                    <p className="text-xs text-gray-400">
                      {trip.date || (trip.createdAt?.toDate
                        ? trip.createdAt.toDate().toLocaleDateString('ar-SA')
                        : '')}
                    </p>
                    <span className={`badge mt-1 ${trip.status === 'completed' || trip.status === 'مكتمل' ? 'badge-success' : 'badge-info'}`}>
                      {statusAr[trip.status] || trip.status}
                    </span>
                  </div>
                  <p className="font-black text-base shrink-0 text-red-500">
                    −{trip.priceNum || trip.price} ر.س
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
