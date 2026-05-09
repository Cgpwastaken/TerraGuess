import { useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { getColor } from '../utils/colors'
import geoData from 'world-atlas/countries-110m.json'

const LEGEND = [
  { label: '< 500 km',   color: '#7f1d1d' },
  { label: '< 1,500 km', color: '#dc2626' },
  { label: '< 3,000 km', color: '#f97316' },
  { label: '< 5,000 km', color: '#eab308' },
  { label: '5,000+ km',  color: '#fef08a' },
]

export default function WorldMap({ guesses, won, failed, target }) {
  // Stringify both sides — geo.id from topojson may be a string even though
  // our country ids are numbers.
  const guessMap = useMemo(
    () => new Map(guesses.map(g => [String(g.country.id), g])),
    [guesses]
  )

  const revealTarget = won || failed

  return (
    <div className="relative w-full bg-gray-800 rounded-xl overflow-hidden shadow-xl">
      <ComposableMap
        projectionConfig={{ scale: 155, center: [0, 10] }}
        width={800}
        height={430}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoId = String(geo.id)
              const guess = guessMap.get(geoId)
              const isTarget = revealTarget && String(target.id) === geoId
              const fill = isTarget
                ? '#22c55e'
                : guess
                  ? getColor(guess.distance)
                  : '#374151'

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#1f2937"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none', opacity: 0.85 },
                    pressed: { outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2 flex flex-col gap-1">
        <span className="text-xs text-gray-300 font-semibold mb-0.5">Distance</span>
        {LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-300">{label}</span>
          </div>
        ))}
        {revealTarget && (
          <div className="flex items-center gap-2 mt-0.5 border-t border-gray-600 pt-1">
            <div className="w-3 h-3 rounded-sm flex-shrink-0 bg-green-500" />
            <span className="text-xs text-green-400 font-semibold">Answer</span>
          </div>
        )}
      </div>
    </div>
  )
}
