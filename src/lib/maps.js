// ── Google Maps configuration ──────────────────────────────────────────────

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
export const IS_GMAPS_CONFIGURED  = !!GOOGLE_MAPS_API_KEY

export const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry', 'directions']

// Saudi Arabia — Riyadh city center
export const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }
export const DEFAULT_ZOOM   = 13

// ── Map style presets ──────────────────────────────────────────────────────
export const LIGHT_MAP_STYLE = []   // Google default

export const DARK_MAP_STYLE = [
  { elementType: 'geometry',        stylers: [{ color: '#1c1c1e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1c1c1e' }] },
  { featureType: 'road',             elementType: 'geometry', stylers: [{ color: '#2c2c2e' }] },
  { featureType: 'road.highway',     elementType: 'geometry', stylers: [{ color: '#3a3a3c' }] },
  { featureType: 'road.highway',     elementType: 'geometry.stroke', stylers: [{ color: '#f5c518', lightness: -60 }] },
  { featureType: 'water',            elementType: 'geometry', stylers: [{ color: '#0f3460' }] },
  { featureType: 'poi',              elementType: 'geometry', stylers: [{ color: '#2c2c2e' }] },
  { featureType: 'poi',              elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'transit',          elementType: 'geometry', stylers: [{ color: '#2c2c2e' }] },
  { featureType: 'administrative',   elementType: 'geometry.stroke', stylers: [{ color: '#3a3a3c' }] },
  { featureType: 'landscape',        elementType: 'geometry', stylers: [{ color: '#1c1c1e' }] },
]

// ── SVG marker helpers (created after API loads) ───────────────────────────
export function makeMarkerIcon(color, emoji, size = 36) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#fff" stroke-width="2"/>
      <text x="${size/2}" y="${size/2 + 6}" font-size="16" text-anchor="middle" font-family="Arial">${emoji}</text>
    </svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: { width: size, height: size },
    anchor:     { x: size / 2, y: size / 2 },
  }
}

export function makePinIcon(color = '#f5c518', size = 32) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 ${size} ${size * 1.3}">
      <path d="M${size/2} 0 C${size*0.22} 0 0 ${size*0.22} 0 ${size/2} C0 ${size*0.78} ${size/2} ${size*1.3} ${size/2} ${size*1.3} C${size/2} ${size*1.3} ${size} ${size*0.78} ${size} ${size/2} C${size} ${size*0.22} ${size*0.78} 0 ${size/2} 0Z" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.25}" fill="#fff"/>
    </svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: { width: size, height: size * 1.3 },
    anchor:     { x: size / 2, y: size * 1.3 },
  }
}

// ── Coordinate helpers ─────────────────────────────────────────────────────
export function toLatLng(coords) {
  if (!coords) return null
  if (Array.isArray(coords)) return { lat: coords[0], lng: coords[1] }
  return coords
}

export function fromLatLng(latLng) {
  if (!latLng) return null
  return [latLng.lat, latLng.lng]
}

// ── Riyadh mock locations for demo ────────────────────────────────────────
export const MOCK_LOCATIONS = [
  { label: 'مدرسة الأمل الأهلية',  lat: 24.720, lng: 46.690 },
  { label: 'مطار الملك خالد',       lat: 24.958, lng: 46.699 },
  { label: 'مركز المملكة',           lat: 24.712, lng: 46.674 },
  { label: 'حي الياسمين',            lat: 24.775, lng: 46.726 },
  { label: 'حي العليا',              lat: 24.717, lng: 46.667 },
  { label: 'حي النرجس',              lat: 24.780, lng: 46.710 },
]
