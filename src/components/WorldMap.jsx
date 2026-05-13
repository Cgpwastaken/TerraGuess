import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps'
import { getColor, STOPS } from '../utils/colors'
import geoData from 'world-atlas/countries-110m.json'

function fmtDist(km) {
  if (km < 1000) return `${Math.round(km).toLocaleString()} km`
  return `${(km / 1000).toFixed(1)}k km`
}

export default function WorldMap({ guesses, won, failed, target, isGlobe }) {
  const [tooltip, setTooltip] = useState(null)

  // Number() normalises whether geo.id arrives as a number, "76", or "076"
  const guessMap = useMemo(
    () => new Map(guesses.map(g => [Number(g.country.id), g])),
    [guesses]
  )

  const revealTarget = won || failed

  const projCfg = isGlobe
    ? { scale: 220, rotate: [-15, -25, 0] }
    : { scale: 158, center: [0, 10] }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-700"
         style={{ background: isGlobe ? '#0f172a' : '#1e293b' }}>

      <ComposableMap
        projection={isGlobe ? 'geoOrthographic' : 'geoNaturalEarth1'}
        projectionConfig={projCfg}
        width={800}
        height={isGlobe ? 520 : 440}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {isGlobe && (
          <>
            <Sphere id="rsm-sphere" fill="#0c1a2e" stroke="#1e3a5f" strokeWidth={1.5} />
            <Graticule stroke="#1e3a5f" strokeWidth={0.4} />
          </>
        )}

        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoId   = Number(geo.id)
              const guess   = guessMap.get(geoId)
              const isTgt   = revealTarget && Number(target.id) === geoId
              const baseFill = isTgt ? '#22c55e' : guess ? getColor(guess.distance) : '#334155'
              const hoverFill = isTgt ? '#4ade80' : guess ? baseFill : '#475569'

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={baseFill}
                  stroke="#1e293b"
                  strokeWidth={0.35}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none', fill: hoverFill, cursor: 'default' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={() => {
                    if (isTgt) {
                      setTooltip({ name: target.name, distance: 0, color: '#22c55e', isTarget: true })
                    } else if (guess) {
                      setTooltip({ name: guess.country.name, distance: guess.distance, color: getColor(guess.distance), isTarget: false })
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Hover tooltip — fixed top-right so it never clips the map edge */}
      {tooltip && (
        <div className="absolute top-3 right-3 bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-xl px-4 py-3 shadow-xl pointer-events-none min-w-32">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tooltip.color }} />
            <p className="font-bold text-white text-sm">{tooltip.name}</p>
          </div>
          {tooltip.isTarget ? (
            <p className="text-green-400 text-xs pl-5">The answer!</p>
          ) : (
            <p className="text-slate-400 text-xs pl-5">{fmtDist(tooltip.distance)} away</p>
          )}
        </div>
      )}

      {/* Colour-scale legend bar along the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/85 backdrop-blur-sm border-t border-slate-700/60 px-4 py-2.5">
        <div className="flex gap-1 items-end">
          {STOPS.map(({ color, label }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-3 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-slate-400 text-center leading-tight hidden sm:block"
                    style={{ fontSize: '9px' }}>{label}</span>
            </div>
          ))}
          {revealTarget && (
            <>
              <div className="w-px h-8 bg-slate-600 mx-0.5 self-center" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-3 rounded-sm bg-green-500" />
                <span className="text-green-400 hidden sm:block" style={{ fontSize: '9px' }}>Answer</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
