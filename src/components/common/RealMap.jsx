import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import { RIYADH_CENTER } from '../../hooks/useGeolocation'

// ── Custom DivIcons — no PNG asset dependency ────────────────────────────
function makeIcon(html, size = 24) {
  return L.divIcon({
    html,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -size / 2],
  })
}

const originIcon = makeIcon(`
  <div style="
    width:20px;height:20px;
    background:#f5c518;
    border:3px solid #000;
    border-radius:50%;
    box-shadow:0 0 0 5px rgba(245,197,24,0.25);
  "></div>`, 20)

const destIcon = makeIcon(`
  <div style="
    width:20px;height:20px;
    background:#fff;
    border:3px solid #374151;
    border-radius:50%;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
  "></div>`, 20)

const driverIcon = makeIcon(`
  <div style="
    font-size:26px;line-height:1;
    filter:drop-shadow(0 2px 6px rgba(0,0,0,0.4));
    transform:scaleX(-1);
  ">🚗</div>`, 30)

const schoolIcon = makeIcon(`
  <div style="
    font-size:24px;line-height:1;
    filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  ">🏫</div>`, 28)

const homeIcon = makeIcon(`
  <div style="
    font-size:22px;line-height:1;
    filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  ">🏠</div>`, 26)

// ── Auto-fit bounds when positions change ───────────────────────────────
function BoundsController({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (!positions || positions.length === 0) return
    try {
      const valid = positions.filter(p => p && p[0] && p[1])
      if (valid.length === 0) return
      if (valid.length === 1) {
        map.setView(valid[0], 14, { animate: true })
      } else {
        map.fitBounds(L.latLngBounds(valid), { padding: [50, 50], maxZoom: 15, animate: true })
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(positions)])
  return null
}

// ── Main Map Component ───────────────────────────────────────────────────
export default function RealMap({
  origin,        // [lat, lng]
  destination,   // [lat, lng]
  driverPos,     // [lat, lng] — animated driver
  schoolPos,     // [lat, lng] — school marker
  homePos,       // [lat, lng] — home marker
  height = '300px',
  showRoute = true,
  interactive = true,
  zoom = 13,
}) {
  const center    = origin ?? destination ?? driverPos ?? RIYADH_CENTER
  const positions = useMemo(
    () => [origin, destination, driverPos, schoolPos, homePos].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify({ origin, destination, driverPos, schoolPos, homePos })]
  )

  return (
    <div style={{ height }} className="rounded-3xl overflow-hidden shadow-lg w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
      >
        {/* OpenStreetMap tiles — free, no API key */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {interactive && <ZoomControl position="bottomleft" />}

        {/* Markers */}
        {origin     && <Marker position={origin}     icon={originIcon} />}
        {destination && <Marker position={destination} icon={destIcon}  />}
        {driverPos  && <Marker position={driverPos}  icon={driverIcon} />}
        {schoolPos  && <Marker position={schoolPos}  icon={schoolIcon} />}
        {homePos    && <Marker position={homePos}    icon={homeIcon}   />}

        {/* Route line */}
        {showRoute && origin && destination && (
          <Polyline
            positions={[origin, destination]}
            pathOptions={{ color: '#f5c518', weight: 4, dashArray: '10 8', opacity: 0.9 }}
          />
        )}

        {/* Driver → destination line */}
        {driverPos && destination && (
          <Polyline
            positions={[driverPos, destination]}
            pathOptions={{ color: '#6b7280', weight: 2, dashArray: '5 6', opacity: 0.5 }}
          />
        )}

        {/* School route */}
        {schoolPos && homePos && (
          <Polyline
            positions={[homePos, schoolPos]}
            pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10 8', opacity: 0.8 }}
          />
        )}

        {positions.length > 0 && <BoundsController positions={positions} />}
      </MapContainer>
    </div>
  )
}
