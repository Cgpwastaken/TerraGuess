import { getColor, getLabel } from '../utils/colors'
import { compass } from '../utils/bearing'
import DirectionArrow from './DirectionArrow'

function fmt(km) {
  if (km === 0)   return '0 km'
  if (km < 1000)  return `${Math.round(km).toLocaleString()} km`
  return `${(km / 1000).toFixed(1)}k km`
}

const MAX_DIST = 20000

export default function GuessList({ guesses }) {
  if (guesses.length === 0) return null

  // Sort by distance — closest at top. Correct guess (distance 0) sits first.
  const sorted = [...guesses].sort((a, b) => a.distance - b.distance)

  return (
    <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-y-auto pr-0.5"
         style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
      {sorted.map((g, i) => {
        const pct = g.isCorrect ? 100 : Math.max(4, Math.round((1 - g.distance / MAX_DIST) * 100))
        const color = g.isCorrect ? '#22c55e' : getColor(g.distance)

        return (
          <div
            key={g.country.id}
            className="relative rounded-xl px-4 py-3 overflow-hidden border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', animation: 'fadeSlideIn 0.25s ease both', animationDelay: `${i * 0.02}s` }}
          >
            {/* Background distance bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-xl opacity-15 transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />

            <div className="relative flex items-center gap-3">
              {/* Guess number */}
              <span className="text-xs font-mono w-5 text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                {i + 1}
              </span>

              {/* Heat dot */}
              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-2 ring-black/20"
                   style={{ backgroundColor: color }} />

              {/* Direction arrow toward the answer (omitted for the correct guess) */}
              {!g.isCorrect && typeof g.bearing === 'number' && (
                <DirectionArrow
                  bearing={g.bearing}
                  color={color}
                  title={`Answer lies to the ${compass(g.bearing)}`}
                />
              )}

              {/* Country name */}
              <span className="flex-1 font-semibold text-sm" style={{ color: 'var(--text)' }}>{g.country.name}</span>

              {/* Distance + label */}
              {g.isCorrect ? (
                <div className="text-right flex-shrink-0">
                  <span className="text-green-400 font-bold text-sm">Correct!</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md font-bold bg-green-500/20 text-green-300 tabular-nums">
                    +{g.score ?? 0}
                  </span>
                </div>
              ) : (
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text)' }}>{fmt(g.distance)}</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md font-medium"
                        style={{ backgroundColor: `${color}22`, color }}>
                    {getLabel(g.distance)}
                  </span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md font-bold bg-slate-700 text-slate-300 tabular-nums">
                    +{g.score ?? 0}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
