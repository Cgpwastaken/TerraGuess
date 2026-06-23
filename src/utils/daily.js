// Daily Challenge seeding. The mystery country is derived deterministically
// from the UTC calendar date, so every player worldwide gets the same country
// on the same day.
//
// DAILY_EPOCH is the fixed anchor date for day numbering: day 0 is 2024-01-01
// (UTC). The share text reports "#<dayNumber>" = days elapsed since this epoch.
export const DAILY_EPOCH_MS = Date.UTC(2024, 0, 1)

// STRIDE scrambles the day→index mapping so consecutive days don't pick
// adjacent countries. It must stay coprime to the dataset length so that any
// run of consecutive days maps to distinct indices (no repeats within a cycle).
const STRIDE = 73

// "YYYY-MM-DD" in UTC for a given Date (defaults to now).
export function utcDateString(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

// Whole days between DAILY_EPOCH and the given "YYYY-MM-DD" UTC date string.
export function dayNumber(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const t = Date.UTC(y, m - 1, d)
  return Math.floor((t - DAILY_EPOCH_MS) / 86400000)
}

// Deterministic country index for a UTC date string.
export function dailyIndex(dateStr, len) {
  const n = dayNumber(dateStr)
  return (((n * STRIDE) % len) + len) % len
}

export function dailyCountry(countries, dateStr = utcDateString()) {
  return countries[dailyIndex(dateStr, countries.length)]
}
