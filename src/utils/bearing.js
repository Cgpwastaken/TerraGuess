// Initial great-circle (forward azimuth) bearing from point A to point B,
// in degrees clockwise from true north (0 = N, 90 = E, 180 = S, 270 = W).
// This is the direction an SVG arrow should point to indicate where the
// mystery country lies relative to a guessed country.
export function bearing(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180
  const toDeg = (r) => (r * 180) / Math.PI
  const phi1 = toRad(lat1)
  const phi2 = toRad(lat2)
  const dLng = toRad(lng2 - lng1)
  const y = Math.sin(dLng) * Math.cos(phi2)
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

// Compass label for a bearing — handy for tooltips / accessibility.
const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
export function compass(deg) {
  return COMPASS[Math.round(((deg % 360) / 45)) % 8]
}
