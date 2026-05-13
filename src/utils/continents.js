// Rough continent assignment from centroid coordinates.
// Used only as a HINT — accuracy is "good enough", not authoritative.
export function getContinent(lat, lng) {
  // South America
  if (lat <= 14 && lat >= -56 && lng <= -34 && lng >= -82) return 'South America'
  // Central America + Caribbean
  if (lat >= 7 && lat <= 24 && lng <= -60 && lng >= -120) return 'North America'
  // North America (including Greenland)
  if (lat >= 14 && lng >= -170 && lng <= -50) return 'North America'
  // Oceania
  if (lat <= 0 && lng >= 110) return 'Oceania'
  if (lat <= -10 && lng >= 100) return 'Oceania'
  // Africa
  if (lat <= 37 && lat >= -35 && lng >= -18 && lng <= 52) return 'Africa'
  // Europe (high latitude, west longitude range)
  if (lat >= 36 && lng >= -25 && lng <= 40) return 'Europe'
  // Russia / large former-USSR sprawl — treat as Europe by convention
  if (lat >= 50 && lng > 40 && lng < 180) return 'Europe'
  // Default: Asia
  return 'Asia'
}
