import { describe, it, expect } from 'vitest'
import { buildShareText } from './share'

const g = (distance, isCorrect = false) => ({ distance, isCorrect })

describe('buildShareText', () => {
  it('includes the day number in Daily mode and a ✅ for the winning guess', () => {
    const text = buildShareText({
      guesses: [g(8000), g(3000), g(0, true)],
      won: true,
      dayNumber: 42,
    })
    expect(text).toContain('TerraGuess #42')
    expect(text).toContain('solved in 3/7')
    expect(text).toContain('✅')
    expect(text).not.toContain('undefined')
  })

  it('omits the day number in Practice mode', () => {
    const text = buildShareText({ guesses: [g(5000)], won: false, dayNumber: null })
    expect(text).not.toContain('#')
    expect(text).toContain('X/7')
  })

  it('contains no country names', () => {
    const text = buildShareText({
      guesses: [{ distance: 1000, isCorrect: false, country: { name: 'France' } }],
      won: false,
      dayNumber: 1,
    })
    expect(text).not.toContain('France')
  })
})
