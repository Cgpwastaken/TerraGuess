export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(Math.min(1, a)))
}

// Some countries span huge distances and their *centroid* is far from where
// they actually touch other countries (e.g. Russia centroid is in Siberia,
// but Russia and the US "border" via the Bering Strait). For those countries
// we attach multiple anchor points and use the minimum pairwise distance,
// so adjacencies through the back of the world map are respected.
export function countryDistance(a, b) {
  const aPts = a.anchors ?? [[a.lat, a.lng]]
  const bPts = b.anchors ?? [[b.lat, b.lng]]
  let min = Infinity
  for (const [la1, lo1] of aPts) {
    for (const [la2, lo2] of bPts) {
      const d = haversine(la1, lo1, la2, lo2)
      if (d < min) min = d
    }
  }
  return min
}
