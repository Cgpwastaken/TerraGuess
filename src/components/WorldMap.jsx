import { useMemo, useState, useRef, useEffect } from 'react'
import {
  ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup,
} from 'react-simple-maps'
import { getColor, STOPS } from '../utils/colors'
import geoData from 'world-atlas/countries-110m.json'

function fmtDist(km) {
  if (km < 1000) return `${Math.round(km).toLocaleString()} km`
  return `${(km / 1000).toFixed(1)}k km`
}

const DEFAULT_ROTATION = [-15, -25, 0]
const DEFAULT_GLOBE_SCALE = 230

export default function WorldMap({ guesses, won, failed, target, isGlobe }) {
  const [tooltip, setTooltip] = useState(null)
  const [rotation, setRotation] = useState(DEFAULT_ROTATION)
  const [globeScale, setGlobeScale] = useState(DEFAULT_GLOBE_SCALE)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(null)
  const containerRef = useRef(null)

  const guessMap = useMemo(
    () => new Map(guesses.map(g => [Number(g.country.id), g])),
    [guesses]
  )
  const revealTarget = won || failed

  // ─────────────────────────────────────────────────────────
  // Globe interactivity: drag to rotate, wheel + buttons to zoom
  // ─────────────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    if (!isGlobe) return
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRotation: rotation,
      moved: false,
    }
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) + Math.abs(dy) > 2) dragRef.current.moved = true
    // sensitivity drops as we zoom in so the drag feels right
    const sens = 60 / globeScale
    setRotation([
      dragRef.current.startRotation[0] + dx * sens,
      Math.max(-90, Math.min(90, dragRef.current.startRotation[1] - dy * sens)),
      0,
    ])
  }

  const endDrag = () => {
    dragRef.current = null
    setIsDragging(false)
  }

  // Wheel listener (must be non-passive to call preventDefault)
  useEffect(() => {
    if (!isGlobe) return
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      setGlobeScale(s => Math.max(140, Math.min(900, s - e.deltaY * 0.6)))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [isGlobe])

  const resetGlobe = () => {
    setRotation(DEFAULT_ROTATION)
    setGlobeScale(DEFAULT_GLOBE_SCALE)
  }

  // ─────────────────────────────────────────────────────────
  // Geography rendering — extracted so we use it in both modes
  // ─────────────────────────────────────────────────────────
  const renderGeographies = () => (
    <Geographies geography={geoData}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const geoId    = Number(geo.id)
          const guess    = guessMap.get(geoId)
          const isTgt    = revealTarget && Number(target.id) === geoId
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
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-700 select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      style={{
        background: isGlobe ? '#0f172a' : '#1e293b',
        cursor: isGlobe ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
    >
      <ComposableMap
        projection={isGlobe ? 'geoOrthographic' : 'geoNaturalEarth1'}
        projectionConfig={
          isGlobe
            ? { scale: globeScale, rotate: rotation }
            : { scale: 158, center: [0, 10] }
        }
        width={800}
        height={isGlobe ? 520 : 440}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {isGlobe ? (
          <>
            <Sphere id="rsm-sphere" fill="#0c1a2e" stroke="#1e3a5f" strokeWidth={1.5} />
            <Graticule stroke="#1e3a5f" strokeWidth={0.4} />
            {renderGeographies()}
          </>
        ) : (
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={5}>
            {renderGeographies()}
          </ZoomableGroup>
        )}
      </ComposableMap>

      {/* Globe-only zoom controls */}
      {isGlobe && (
        <div className="absolute top-3 left-3 flex flex-col gap-1 bg-slate-900/90 backdrop-blur rounded-xl p-1 border border-slate-700 shadow-lg">
          <button onClick={() => setGlobeScale(s => Math.min(900, s + 70))}
                  className="w-9 h-9 rounded-lg hover:bg-slate-700 text-white font-bold text-xl flex items-center justify-center transition-colors"
                  title="Zoom in">+</button>
          <button onClick={() => setGlobeScale(s => Math.max(140, s - 70))}
                  className="w-9 h-9 rounded-lg hover:bg-slate-700 text-white font-bold text-xl flex items-center justify-center transition-colors"
                  title="Zoom out">−</button>
          <button onClick={resetGlobe}
                  className="w-9 h-9 rounded-lg hover:bg-slate-700 text-white text-sm flex items-center justify-center transition-colors"
                  title="Reset view">⟲</button>
        </div>
      )}

      {/* Hover tooltip — fixed top-right */}
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

      {/* Colour-scale legend */}
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
