import { useState, useCallback, useRef } from 'react'

export function useAddressSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  const search = useCallback((query) => {
    clearTimeout(timerRef.current)

    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(query)}` +
          `&format=json&limit=6&countrycodes=sa` +
          `&accept-language=ar`

        const res  = await fetch(url, { headers: { 'Accept-Language': 'ar' } })
        const data = await res.json()

        setResults(
          data.map(r => ({
            label: r.display_name.split(',').slice(0, 3).join('، '),
            full:  r.display_name,
            lat:   parseFloat(r.lat),
            lng:   parseFloat(r.lon),
          }))
        )
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 450)
  }, [])

  const clear = useCallback(() => setResults([]), [])

  return { results, loading, search, clear }
}
