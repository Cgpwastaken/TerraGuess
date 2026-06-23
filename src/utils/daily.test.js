import { describe, it, expect } from 'vitest'
import { dailyIndex, dailyCountry, dayNumber, utcDateString } from './daily'
import { countries } from '../data/countries'

const LEN = countries.length

describe('daily seed determinism', () => {
  it('returns the same index for the same date string', () => {
    const a = dailyIndex('2026-06-23', LEN)
    const b = dailyIndex('2026-06-23', LEN)
    expect(a).toBe(b)
    expect(dailyCountry(countries, '2026-06-23').id)
      .toBe(dailyCountry(countries, '2026-06-23').id)
  })

  it('day numbering is anchored at the epoch', () => {
    expect(dayNumber('2024-01-01')).toBe(0)
    expect(dayNumber('2024-01-02')).toBe(1)
  })

  it('different dates yield different indices across 30 consecutive days', () => {
    const indices = []
    for (let n = 0; n < 30; n++) {
      const date = new Date(Date.UTC(2024, 0, 1 + n))
      indices.push(dailyIndex(utcDateString(date), LEN))
    }
    // STRIDE is coprime to the dataset length, so a 30-day run has no repeats.
    expect(new Set(indices).size).toBe(30)
  })

  it('produces a valid in-range index', () => {
    const i = dailyIndex('2025-12-31', LEN)
    expect(i).toBeGreaterThanOrEqual(0)
    expect(i).toBeLessThan(LEN)
  })
})
