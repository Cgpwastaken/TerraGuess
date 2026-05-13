import { getColor, getLabel } from '../utils/colors'

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
            className="relative bg-slate-800 rounded-xl px-4 py-3 overflow-hidden border border-slate-700/50"
            style={{ animation: 'fadeSlideIn 0.25s ease both', animationDelay: `${i * 0.02}s` }}
          >
            {/* Background distance bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-xl opacity-15 transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />

            <div className="relative flex items-center gap-3">
              {/* Guess number */}
              <span className="text-slate-500 text-xs font-mono w-5 text-right flex-shrink-0">
                {i + 1}
              </span>

              {/* Heat dot */}
              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-2 ring-black/20"
                   style={{ backgroundColor: color }} />

              {/* Country name */}
              <span className="flex-1 font-semibold text-slate-100 text-sm">{g.country.name}</span>

              {/* Distance + label */}
              {g.isCorrect ? (
                <span className="text-green-400 font-bold text-sm">Correct!</span>
              ) : (
                <div className="text-right flex-shrink-0">
                  <span className="text-slate-200 text-sm font-semibold tabular-nums">{fmt(g.distance)}</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md font-medium"
                        style={{ backgroundColor: `${color}22`, color }}>
                    {getLabel(g.distance)}
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
