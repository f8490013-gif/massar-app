import { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Polyline, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api'
import { useApp } from '../../context/AppContext'
import {
  GOOGLE_MAPS_API_KEY, IS_GMAPS_CONFIGURED,
  GOOGLE_MAPS_LIBRARIES, DEFAULT_CENTER,
  DARK_MAP_STYLE, LIGHT_MAP_STYLE,
  makePinIcon, makeMarkerIcon, toLatLng,
} from '../../lib/maps'
import { MapPin } from 'lucide-react'

// ── Shared loader (called once, reused everywhere) ─────────────────────────
export function useGoogleMaps() {
  return useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries:        GOOGLE_MAPS_LIBRARIES,
    language:         'ar',
    region:           'SA',
  })
}

// ── Map placeholder when Google Maps not configured ────────────────────────
function MapPlaceholder({ height, from, to }) {
  return (
    <div
      className="w-full rounded-3xl overflow-hidden flex flex-col items-center justify-center relative"
      style={{ height, background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' }}
    >
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,197,24,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(245,197,24,.08) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <MapPin size={32} className="text-primary-400 mb-2 relative z-10" />
      <p className="text-white/70 text-sm font-semibold relative z-10">خريطة Google غير مفعّلة</p>
      <p className="text-white/40 text-xs mt-1 relative z-10 px-6 text-center">
        أضف VITE_GOOGLE_MAPS_API_KEY في ملف .env
      </p>
      {(from || to) && (
        <div className="absolute bottom-4 right-4 left-4 flex justify-between pointer-events-none">
          {from && (
            <div className="bg-primary-500/90 text-black text-xs px-3 py-1.5 rounded-xl font-bold max-w-[45%] truncate">
              {from}
            </div>
          )}
          {to && (
            <div className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-xl max-w-[45%] truncate">
              {to}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Google Map component ──────────────────────────────────────────────
export default function RealMap({
  origin,        // { lat, lng } or [lat, lng]
  destination,   // { lat, lng } or [lat, lng]
  driverPos,     // { lat, lng } — animated driver marker
  schoolPos,     // { lat, lng } — school marker
  homePos,       // { lat, lng } — home marker
  height = '300px',
  interactive = true,
  showDirections = true,
  showTraffic   = false,
  fromLabel,
  toLabel,
}) {
  const { theme }             = useApp()
  const { isLoaded, loadError } = useGoogleMaps()
  const mapRef                  = useRef(null)
  const [directions, setDirections] = useState(null)

  const isDark = theme === 'dark'

  // Normalize coords to { lat, lng }
  const originLatLng = toLatLng(origin)
  const destLatLng   = toLatLng(destination)
  const driverLatLng = toLatLng(driverPos)
  const schoolLatLng = toLatLng(schoolPos)
  const homeLatLng   = toLatLng(homePos)

  const center = originLatLng ?? destLatLng ?? driverLatLng ?? DEFAULT_CENTER

  // ── Fetch directions when origin + destination are both set ─────────────
  useEffect(() => {
    if (!isLoaded || !originLatLng || !destLatLng || !showDirections) return

    const service = new window.google.maps.DirectionsService()
    service.route(
      {
        origin:      originLatLng,
        destination: destLatLng,
        travelMode:  window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') setDirections(result)
        else setDirections(null)
      }
    )
  }, [
    isLoaded,
    originLatLng?.lat, originLatLng?.lng,
    destLatLng?.lat,   destLatLng?.lng,
    showDirections,
  ])

  // ── Fit map bounds to all visible markers ───────────────────────────────
  const onMapLoad = useCallback(map => {
    mapRef.current = map
  }, [])

  useEffect(() => {
    if (!mapRef.current || !isLoaded) return
    const points = [originLatLng, destLatLng, driverLatLng, schoolLatLng, homeLatLng].filter(Boolean)
    if (points.length === 0) return
    if (points.length === 1) {
      mapRef.current.setCenter(points[0])
      mapRef.current.setZoom(15)
      return
    }
    const bounds = new window.google.maps.LatLngBounds()
    points.forEach(p => bounds.extend(p))
    mapRef.current.fitBounds(bounds, { top: 60, right: 40, bottom: 60, left: 40 })
  }, [
    isLoaded,
    JSON.stringify({ originLatLng, destLatLng, driverLatLng, schoolLatLng, homeLatLng }),
  ])

  // Not configured — show placeholder
  if (!IS_GMAPS_CONFIGURED) {
    return <MapPlaceholder height={height} from={fromLabel} to={toLabel} />
  }

  if (loadError) {
    return <MapPlaceholder height={height} from={fromLabel} to={toLabel} />
  }

  if (!isLoaded) {
    return (
      <div className="w-full rounded-3xl bg-gray-100 dark:bg-dark-border animate-pulse" style={{ height }} />
    )
  }

  return (
    <div style={{ height }} className="rounded-3xl overflow-hidden w-full shadow-lg">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={13}
        onLoad={onMapLoad}
        options={{
          styles:            isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE,
          disableDefaultUI:  !interactive,
          zoomControl:       interactive,
          streetViewControl: false,
          mapTypeControl:    false,
          fullscreenControl: false,
          gestureHandling:   interactive ? 'auto' : 'none',
          clickableIcons:    false,
        }}
      >
        {showTraffic && <TrafficLayer />}

        {/* Directions route (replaces manual polyline) */}
        {directions ? (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor:   '#f5c518',
                strokeWeight:  5,
                strokeOpacity: 0.9,
              },
            }}
          />
        ) : (
          /* Fallback polyline when directions not loaded */
          originLatLng && destLatLng && (
            <Polyline
              path={[originLatLng, destLatLng]}
              options={{ strokeColor: '#f5c518', strokeWeight: 4, strokeOpacity: 0.7, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '16px' }] }}
            />
          )
        )}

        {/* School route */}
        {homeLatLng && schoolLatLng && (
          <Polyline
            path={[homeLatLng, schoolLatLng]}
            options={{ strokeColor: '#3b82f6', strokeWeight: 4, strokeOpacity: 0.8 }}
          />
        )}

        {/* Driver → destination route */}
        {driverLatLng && destLatLng && !directions && (
          <Polyline
            path={[driverLatLng, destLatLng]}
            options={{ strokeColor: '#9ca3af', strokeWeight: 2, strokeOpacity: 0.5, strokeDashArray: '6 6' }}
          />
        )}

        {/* Origin marker — yellow pin */}
        {originLatLng && (
          <Marker position={originLatLng} icon={makePinIcon('#f5c518', 32)} title="نقطة الانطلاق" />
        )}

        {/* Destination marker — dark pin */}
        {destLatLng && (
          <Marker position={destLatLng} icon={makePinIcon('#1c1c1e', 32)} title="الوجهة" />
        )}

        {/* Driver — animated car marker */}
        {driverLatLng && (
          <Marker
            position={driverLatLng}
            icon={makeMarkerIcon('#f5c518', '🚗', 40)}
            title="السائق"
            zIndex={100}
          />
        )}

        {/* School marker */}
        {schoolLatLng && (
          <Marker position={schoolLatLng} icon={makeMarkerIcon('#3b82f6', '🏫', 38)} title="المدرسة" />
        )}

        {/* Home marker */}
        {homeLatLng && (
          <Marker position={homeLatLng} icon={makeMarkerIcon('#10b981', '🏠', 38)} title="المنزل" />
        )}
      </GoogleMap>
    </div>
  )
}
