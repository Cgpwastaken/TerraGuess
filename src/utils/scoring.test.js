import { describe, it, expect } from 'vitest'
import { scoreForDistance, totalScore, MAX_SCORE } from './scoring'

describe('scoreForDistance', () => {
  it('awards the maximum for a correct guess (0 km)', () => {
    expect(scoreForDistance(0)).toBe(MAX_SCORE)
  })

  it('drops off with distance following the documented curve', () => {
    expect(scoreForDistance(1000)).toBeGreaterThan(3600)   // ~4000
    expect(scoreForDistance(1000)).toBeLessThan(4300)
    expect(scoreForDistance(5000)).toBeGreaterThan(1200)    // ~2000-ish
    expect(scoreForDistance(5000)).toBeLessThan(2200)
    expect(scoreForDistance(12000)).toBeLessThan(500)       // beyond 10,000 km
  })

  it('is monotonically non-increasing with distance', () => {
    let prev = Infinity
    for (let km = 0; km <= 20000; km += 500) {
      const s = scoreForDistance(km)
      expect(s).toBeLessThanOrEqual(prev)
      prev = s
    }
  })
})

describe('totalScore', () => {
  it('sums per-guess scores', () => {
    expect(totalScore([{ score: 100 }, { score: 250 }, {}])).toBe(350)
  })
})
