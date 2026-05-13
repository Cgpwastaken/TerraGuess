// 8 distinct stops so the full 0–20,000 km range is clearly differentiated
export const STOPS = [
  { max: 500,      color: '#991b1b', label: '< 500 km',    heat: 'Scorching' },
  { max: 1000,     color: '#dc2626', label: '< 1,000 km',  heat: 'Burning'   },
  { max: 2000,     color: '#ea580c', label: '< 2,000 km',  heat: 'Hot'       },
  { max: 3500,     color: '#f97316', label: '< 3,500 km',  heat: 'Warm'      },
  { max: 5000,     color: '#eab308', label: '< 5,000 km',  heat: 'Lukewarm'  },
  { max: 7500,     color: '#84cc16', label: '< 7,500 km',  heat: 'Cool'      },
  { max: 10000,    color: '#22d3ee', label: '< 10,000 km', heat: 'Cold'      },
  { max: Infinity, color: '#818cf8', label: '10,000+ km',  heat: 'Freezing'  },
]

export function getColor(km) {
  return STOPS.find(s => km < s.max)?.color ?? STOPS.at(-1).color
}

export function getLabel(km) {
  return STOPS.find(s => km < s.max)?.heat ?? STOPS.at(-1).heat
}
