import { useState, useCallback } from 'react'
import { IS_GMAPS_CONFIGURED } from '../lib/maps'

export const RIYADH_CENTER = [24.7136, 46.6753]

export function useGeolocation() {
  const [coords, setCoords]   = useState(null)   // [lat, lng]
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const getLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('المتصفح لا يدعم تحديد الموقع')
        resolve(null)
        return
      }
      setLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        async pos => {
          const { latitude: lat, longitude: lng } = pos.coords
          const c = [lat, lng]
          setCoords(c)

          // ── Reverse geocode with Google Geocoding API ──────────────────
          if (IS_GMAPS_CONFIGURED && window.google?.maps) {
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode(
              { location: { lat, lng }, language: 'ar' },
              (results, status) => {
                const addr = status === 'OK' && results[0]
                  ? results[0].address_components
                      .filter(c => ['route', 'neighborhood', 'sublocality', 'locality'].includes(c.types[0]))
                      .map(c => c.long_name)
                      .join('، ') || results[0].formatted_address.split(',')[0]
                  : 'موقعي الحالي'
                setAddress(addr)
                setLoading(false)
                resolve({ coords: c, address: addr })
              }
            )
            return
          }

          // ── Nominatim fallback ─────────────────────────────────────────
          try {
            const res  = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
              { headers: { 'Accept-Language': 'ar' } }
            )
            const data = await res.json()
            const parts = [
              data.address?.road,
              data.address?.suburb,
              data.address?.city ?? data.address?.town,
            ].filter(Boolean)
            const addr = parts.join('، ') || 'موقعي الحالي'
            setAddress(addr)
            setLoading(false)
            resolve({ coords: c, address: addr })
          } catch {
            setAddress('موقعي الحالي')
            setLoading(false)
            resolve({ coords: c, address: 'موقعي الحالي' })
          }
        },
        err => {
          setError('تعذّر تحديد موقعك — تحقق من صلاحيات الموقع')
          setLoading(false)
          resolve(null)
        },
        { timeout: 8000, enableHighAccuracy: true }
      )
    })
  }, [])

  return { coords, address, loading, error, getLocation }
}
