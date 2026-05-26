import { useState, useCallback } from 'react'

// Default fallback: Riyadh city center
export const RIYADH_CENTER = [24.7136, 46.6753]

export function useGeolocation() {
  const [coords, setCoords]   = useState(null)   // [lat, lng]
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع')
      return
    }
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCoords([lat, lng])

        // Reverse geocode with Nominatim
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`,
            { headers: { 'Accept-Language': 'ar' } }
          )
          const data = await res.json()
          const parts = [
            data.address?.road,
            data.address?.suburb,
            data.address?.city || data.address?.town,
          ].filter(Boolean)
          setAddress(parts.join('، ') || data.display_name?.split(',')[0] || 'موقعي الحالي')
        } catch {
          setAddress('موقعي الحالي')
        }
        setLoading(false)
      },
      () => {
        setError('تعذّر تحديد موقعك — تحقق من صلاحيات الموقع')
        setLoading(false)
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }, [])

  return { coords, address, loading, error, getLocation }
}
