// Distance bins in km → heat colors (hot = close, cold = far)
export function getColor(distanceKm) {
  if (distanceKm < 500)  return '#7f1d1d' // very close  – darkest red
  if (distanceKm < 1500) return '#dc2626' // close        – red
  if (distanceKm < 3000) return '#f97316' // medium       – orange
  if (distanceKm < 5000) return '#eab308' // far          – yellow
  return '#fef08a'                         // very far     – pale yellow
}

export function getLabel(distanceKm) {
  if (distanceKm < 500)  return 'Boiling'
  if (distanceKm < 1500) return 'Hot'
  if (distanceKm < 3000) return 'Warm'
  if (distanceKm < 5000) return 'Cold'
  return 'Freezing'
}
