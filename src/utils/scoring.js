// Curved scoring on top of the haversine distance display.
// A correct guess (0 km) earns the full MAX_SCORE; the reward decays
// exponentially with great-circle distance:  score = MAX_SCORE * e^(-km / TAU)
// TAU = 4300 is tuned so a guess ~1000 km away earns ~4000, ~5000 km earns
// ~1600–2000, and anything beyond 10,000 km earns fewer than 500.
export const MAX_SCORE = 5000
const TAU = 4300

export function scoreForDistance(km) {
  if (!Number.isFinite(km) || km <= 0) return MAX_SCORE
  return Math.round(MAX_SCORE * Math.exp(-km / TAU))
}

export function totalScore(guesses) {
  return guesses.reduce((sum, g) => sum + (g.score ?? 0), 0)
}
