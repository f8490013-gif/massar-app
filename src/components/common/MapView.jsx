import { MapPin, Navigation } from 'lucide-react'

// Lightweight SVG map placeholder — no API key required.
// Replace with react-leaflet or Google Maps in a future phase.
export default function MapView({ from, to, height = '320px', showRoute = true }) {
  return (
    <div
      className="map-placeholder rounded-3xl w-full relative flex items-center justify-center overflow-hidden"
      style={{ height }}
    >
      {/* Animated route dots */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
          {/* Dashed route line */}
          <path
            d="M 100 240 C 140 200 180 160 200 130 C 220 100 260 80 300 60"
            fill="none"
            stroke="#f5c518"
            strokeWidth="3"
            strokeDasharray="8 5"
            opacity="0.9"
          />
          {/* Origin dot */}
          <circle cx="100" cy="240" r="8" fill="#f5c518" opacity="0.95" />
          <circle cx="100" cy="240" r="16" fill="#f5c518" opacity="0.25">
            <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Destination dot */}
          <circle cx="300" cy="60" r="8" fill="#fff" opacity="0.95" />
          <circle cx="300" cy="60" r="16" fill="#fff" opacity="0.2">
            <animate attributeName="r" values="10;22;10" dur="2.5s" repeatCount="indefinite" />
          </circle>
          {/* Moving car */}
          <circle cx="100" cy="240" r="6" fill="#000">
            <animateMotion dur="4s" repeatCount="indefinite">
              <mpath xlinkHref="#route" />
            </animateMotion>
          </circle>
          <path id="route" d="M 100 240 C 140 200 180 160 200 130 C 220 100 260 80 300 60" fill="none" />
        </svg>
      )}

      {/* Labels */}
      <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end pointer-events-none">
        <div className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1.5 max-w-[45%]">
          <MapPin size={12} className="text-primary-500 shrink-0" />
          <span className="truncate">{from || 'نقطة الانطلاق'}</span>
        </div>
        <div className="bg-primary-500 text-black text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 max-w-[45%]">
          <Navigation size={12} className="shrink-0" />
          <span className="truncate">{to || 'الوجهة'}</span>
        </div>
      </div>

      {/* Map label */}
      <div className="absolute top-4 left-4 bg-black/60 text-white/70 text-xs px-3 py-1 rounded-lg backdrop-blur-sm">
        خريطة مسار
      </div>
    </div>
  )
}
