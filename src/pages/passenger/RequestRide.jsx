import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import RealMap from '../../components/common/RealMap'
import { vehicleTypes, paymentMethods } from '../../data/mockData'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useAddressSearch } from '../../hooks/useAddressSearch'
import { MapPin, Navigation, Locate, Loader, Search } from 'lucide-react'
import clsx from 'clsx'

// Mock nearby Riyadh coords for demo destination search
const QUICK_PLACES = [
  { label: 'مدرسة الأمل الأهلية',  lat: 24.7200, lng: 46.6900 },
  { label: 'مطار الملك خالد',       lat: 24.9578, lng: 46.6989 },
  { label: 'مركز المملكة',           lat: 24.7115, lng: 46.6742 },
  { label: 'حي الياسمين',            lat: 24.7748, lng: 46.7264 },
  { label: 'حي العليا',              lat: 24.7167, lng: 46.6667 },
]

function AddressInput({ label, value, onChange, onSelect, placeholder, icon: Icon, iconColor, showLocate, onLocate, locating }) {
  const { results, loading, search, clear } = useAddressSearch()
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  function handleChange(v) {
    onChange(v)
    search(v)
  }

  function handleSelect(r) {
    onChange(r.label)
    onSelect({ lat: r.lat, lng: r.lng })
    clear()
    inputRef.current?.blur()
  }

  const showDropdown = focused && (results.length > 0 || loading)

  return (
    <div className="relative">
      <div className="relative">
        <Icon size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 ${iconColor}`} />
        <input
          ref={inputRef}
          className="input-field pr-11 pl-11"
          placeholder={placeholder}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          dir="rtl"
        />
        {showLocate && (
          <button
            type="button"
            onClick={onLocate}
            disabled={locating}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors"
            title="استخدم موقعي الحالي"
          >
            {locating
              ? <Loader size={16} className="animate-spin" />
              : <Locate size={16} />
            }
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="address-dropdown">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-gray-400 text-sm">
              <Loader size={14} className="animate-spin shrink-0" /> جارٍ البحث…
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border text-right transition-colors border-b border-gray-50 dark:border-dark-border last:border-0"
            >
              <MapPin size={14} className="text-primary-500 shrink-0" />
              <span className="text-sm truncate">{r.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RequestRide() {
  const [fromText, setFromText]   = useState('')
  const [toText, setToText]       = useState('')
  const [fromCoords, setFromCoords] = useState(null)
  const [toCoords, setToCoords]   = useState(null)
  const [vehicle, setVehicle]     = useState('economy')
  const [payment, setPayment]     = useState('mada')
  const [loading, setLoading]     = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const { showNotification, setActiveRide } = useApp()
  const { coords, address, loading: locating, getLocation } = useGeolocation()
  const navigate = useNavigate()

  // Auto-fill "from" when geolocation resolves
  async function handleLocate() {
    await getLocation()
    if (coords) {
      setFromText(address || 'موقعي الحالي')
      setFromCoords(coords)
    }
  }

  // Watch geolocation state changes
  useState(() => {
    if (coords && !fromCoords) {
      setFromText(address || 'موقعي الحالي')
      setFromCoords(coords)
    }
  })

  function handleQuickPlace(place) {
    setToText(place.label)
    setToCoords([place.lat, place.lng])
  }

  async function book() {
    if (!fromText || !toText) {
      showNotification('يرجى إدخال نقطة الانطلاق والوجهة', 'error')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const selected = vehicleTypes.find(v => v.id === vehicle)

    // Create a driver position slightly offset from origin for tracking
    const driverStart = fromCoords
      ? [fromCoords[0] - 0.012, fromCoords[1] - 0.008]
      : null

    setActiveRide({
      from:        fromText,
      to:          toText,
      fromCoords,
      toCoords,
      driverStart,
      vehicle,
      driver: { name: 'محمد علي', rating: 4.9, car: 'تويوتا كامري 2023', plate: 'ن ص م 1234', phone: '+966501234567' },
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

        {/* Live map preview */}
        <RealMap
          origin={fromCoords}
          destination={toCoords}
          height="260px"
          interactive={false}
        />

        {/* Location inputs */}
        <div className="card space-y-3">
          <AddressInput
            label="من"
            value={fromText}
            onChange={setFromText}
            onSelect={c => setFromCoords([c.lat, c.lng])}
            placeholder="نقطة الانطلاق"
            icon={MapPin}
            iconColor="text-primary-500"
            showLocate
            onLocate={() => {
              getLocation().then(() => {
                if (coords) { setFromText(address); setFromCoords(coords) }
              })
            }}
            locating={locating}
          />
          <div className="h-px bg-gray-100 dark:bg-dark-border mx-2" />
          <AddressSearch
            value={toText}
            onChange={setToText}
            onSelect={c => setToCoords([c.lat, c.lng])}
            placeholder="إلى أين؟"
          />
        </div>

        {/* Quick places */}
        <div>
          <p className="text-xs text-gray-400 mb-2 font-semibold">وجهات شائعة</p>
          <div className="flex gap-2 flex-wrap">
            {QUICK_PLACES.map(p => (
              <button
                key={p.label}
                onClick={() => handleQuickPlace(p)}
                className={clsx(
                  'text-xs px-3 py-1.5 rounded-xl border font-medium transition-all',
                  toText === p.label
                    ? 'bg-primary-500 text-black border-primary-500'
                    : 'border-gray-200 dark:border-dark-border hover:border-primary-300 text-gray-600 dark:text-gray-400'
                )}
              >
                {p.label}
              </button>
            ))}
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

        {/* Summary */}
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

        {/* Book */}
        <button
          onClick={book}
          disabled={loading || confirmed}
          className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
        >
          {loading   ? <><span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> جارٍ البحث…</> :
           confirmed ? '✓ تم تأكيد الطلب' :
           'تأكيد الطلب'}
        </button>
      </div>
    </Layout>
  )
}

// Inline simplified search for "to" field
function AddressSearch({ value, onChange, onSelect, placeholder }) {
  const { results, loading, search, clear } = useAddressSearch()
  const [focused, setFocused] = useState(false)

  return (
    <div className="relative">
      <Navigation size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        className="input-field pr-11"
        placeholder={placeholder}
        value={value}
        onChange={e => { onChange(e.target.value); search(e.target.value) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        dir="rtl"
      />
      {focused && (results.length > 0 || loading) && (
        <div className="address-dropdown">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-gray-400 text-sm">
              <Loader size={14} className="animate-spin" /> جارٍ البحث…
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              onMouseDown={() => { onChange(r.label); onSelect({ lat: r.lat, lng: r.lng }); clear() }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border text-right transition-colors border-b border-gray-50 dark:border-dark-border last:border-0"
            >
              <Navigation size={14} className="text-gray-400 shrink-0" />
              <span className="text-sm truncate">{r.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
