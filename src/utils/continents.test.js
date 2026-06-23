import { describe, it, expect } from 'vitest'
import { getContinentForCountry } from './continents'
import { countries } from '../data/countries'

const byId = (id) => {
  const c = countries.find(c => c.id === id)
  if (!c) throw new Error(`country id ${id} not found in dataset`)
  return c
}

describe('getContinentForCountry — spec convention countries', () => {
  const cases = [
    [196, 'Europe'], // Cyprus
    [792, 'Asia'],   // Turkey
    [643, 'Europe'], // Russia
    [268, 'Asia'],   // Georgia
    [51,  'Asia'],   // Armenia
    [31,  'Asia'],   // Azerbaijan
    [398, 'Asia'],   // Kazakhstan
    [818, 'Africa'], // Egypt
  ]
  it.each(cases)('country %i → %s', (id, expected) => {
    expect(getContinentForCountry(byId(id))).toBe(expected)
  })
})

describe('getContinentForCountry — spread across continents', () => {
  const cases = [
    [840, 'North America'], // United States
    [124, 'North America'], // Canada
    [76,  'South America'], // Brazil
    [32,  'South America'], // Argentina
    [250, 'Europe'],        // France
    [566, 'Africa'],        // Nigeria
    [156, 'Asia'],          // China
    [392, 'Asia'],          // Japan
    [36,  'Oceania'],       // Australia
    [554, 'Oceania'],       // New Zealand
  ]
  it.each(cases)('country %i → %s', (id, expected) => {
    expect(getContinentForCountry(byId(id))).toBe(expected)
  })
})
