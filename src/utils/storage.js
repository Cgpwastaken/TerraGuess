// Safe localStorage access for the Daily Challenge result. Every call is
// wrapped so that private-browsing / disabled-storage environments degrade
// gracefully (no throw) — Daily mode simply doesn't persist in that case.
const keyFor = (date) => `terraguess-daily-${date}`

export function loadDailyResult(date) {
  try {
    const raw = window.localStorage.getItem(keyFor(date))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDailyResult(date, data) {
  try {
    window.localStorage.setItem(keyFor(date), JSON.stringify(data))
    return true
  } catch {
    return false
  }
}
