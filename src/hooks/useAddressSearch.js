import { useState, useRef, useCallback } from 'react'
import { IS_GMAPS_CONFIGURED } from '../lib/maps'

// ── Google Places Autocomplete hook ───────────────────────────────────────
export function useAddressSearch() {
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const timerRef                = useRef(null)
  const serviceRef              = useRef(null)

  const search = useCallback((query) => {
    clearTimeout(timerRef.current)

    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(() => {
      // ── Google Places (when API key is configured) ──────────────────────
      if (IS_GMAPS_CONFIGURED && window.google?.maps?.places) {
        if (!serviceRef.current) {
          serviceRef.current = new window.google.maps.places.AutocompleteService()
        }

        setLoading(true)
        serviceRef.current.getPlacePredictions(
          {
            input:                  query,
            componentRestrictions:  { country: 'sa' },
            language:               'ar',
          },
          (predictions, status) => {
            setLoading(false)
            if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
              setResults([])
              return
            }
            // Resolve each prediction to lat/lng via Geocoder
            const geocoder = new window.google.maps.Geocoder()
            const resolved = []
            let pending    = predictions.length

            predictions.slice(0, 5).forEach(pred => {
              geocoder.geocode({ placeId: pred.place_id }, (geoResults, geoStatus) => {
                pending--
                if (geoStatus === 'OK' && geoResults[0]) {
                  const loc = geoResults[0].geometry.location
                  resolved.push({
                    label: pred.structured_formatting?.main_text   || pred.description,
                    full:  pred.description,
                    lat:   loc.lat(),
                    lng:   loc.lng(),
                  })
                }
                if (pending === 0) setResults(resolved)
              })
            })
          }
        )
        return
      }

      // ── Nominatim fallback (no API key) ───────────────────────────────
      setLoading(true)
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=sa&accept-language=ar`,
        { headers: { 'Accept-Language': 'ar' } }
      )
        .then(r => r.json())
        .then(data => {
          setResults(
            data.map(r => ({
              label: r.display_name.split(',').slice(0, 2).join('، '),
              full:  r.display_name,
              lat:   parseFloat(r.lat),
              lng:   parseFloat(r.lon),
            }))
          )
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 400)
  }, [])

  const clear = useCallback(() => setResults([]), [])

  return { results, loading, search, clear }
}
