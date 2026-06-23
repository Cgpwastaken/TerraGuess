import { describe, it, expect } from 'vitest'
import { bearing, compass } from './bearing'

// From the origin (0,0) to points in each of the eight compass directions.
// Tolerance is generous because great-circle bearings curve slightly.
describe('bearing — eight compass directions from (0,0)', () => {
  const near = (actual, expected, tol = 8) => {
    const diff = Math.abs(((actual - expected + 540) % 360) - 180)
    expect(diff).toBeLessThanOrEqual(tol)
  }

  it('N',  () => near(bearing(0, 0,  10,   0),   0))
  it('NE', () => near(bearing(0, 0,  10,  10),  45))
  it('E',  () => near(bearing(0, 0,   0,  10),  90))
  it('SE', () => near(bearing(0, 0, -10,  10), 135))
  it('S',  () => near(bearing(0, 0, -10,   0), 180))
  it('SW', () => near(bearing(0, 0, -10, -10), 225))
  it('W',  () => near(bearing(0, 0,   0, -10), 270))
  it('NW', () => near(bearing(0, 0,  10, -10), 315))
})

describe('compass', () => {
  it('labels cardinal bearings', () => {
    expect(compass(0)).toBe('N')
    expect(compass(90)).toBe('E')
    expect(compass(180)).toBe('S')
    expect(compass(270)).toBe('W')
  })
})
