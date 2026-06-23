import { getEmoji } from './colors'

// Build the spoiler-free shareable result text. No country names are included —
// only the emoji squares (one per guess, coloured by distance bucket, ✅ for the
// correct guess). `dayNumber` is included only in Daily mode; in Practice mode it
// is null and the "#n" tag is omitted.
export function buildShareText({ guesses, won, dayNumber = null }) {
  const squares = guesses
    .map(g => (g.isCorrect ? '✅' : getEmoji(g.distance)))
    .join('')

  const tag = dayNumber != null ? `#${dayNumber} ` : ''
  const result = won ? `solved in ${guesses.length}/7` : `X/7`

  return `TerraGuess ${tag}— ${result} 🌍\n${squares}`
}

// Copy text to the clipboard with graceful fallbacks:
//  1) the async Clipboard API,
//  2) a hidden <textarea> + document.execCommand('copy'),
// returning true on success. Callers can fall back to a manual selectable
// field if this resolves false.
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
