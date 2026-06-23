import PropTypes from 'prop-types'
import { getColor, getLabel } from '../utils/colors'
import { compass } from '../utils/bearing'
import { totalScore } from '../utils/scoring'
import DirectionArrow from './DirectionArrow'

function fmtDist(km) {
  if (km === 0)  return '0 km'
  if (km < 1000) return `${Math.round(km).toLocaleString()} km`
  return `${(km / 1000).toFixed(1)}k km`
}

// One guess rendered as a compact row: name, direction arrow, distance,
// colour bucket and the score earned that round.
function GuessRow({ g }) {
  const color = g.isCorrect ? '#22c55e' : getColor(g.distance)
  return (
    <div className="flex items-center gap-2.5 text-sm">
      {g.isCorrect
        ? <span className="text-green-400 text-base flex-shrink-0">🎯</span>
        : <DirectionArrow bearing={g.bearing ?? 0} size={16} color={color}
                          title={`Answer to the ${compass(g.bearing ?? 0)}`} />}
      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="flex-1 font-semibold truncate" style={{ color: 'var(--rs-name, #e2e8f0)' }}>
        {g.country.name}
      </span>
      <span className="tabular-nums font-medium" style={{ color: 'var(--rs-muted, #cbd5e1)' }}>
        {g.isCorrect ? 'Correct!' : fmtDist(g.distance)}
      </span>
      {!g.isCorrect && (
        <span className="text-xs px-1.5 py-0.5 rounded-md font-medium hidden sm:inline"
              style={{ backgroundColor: `${color}22`, color }}>
          {getLabel(g.distance)}
        </span>
      )}
      <span className="text-xs px-1.5 py-0.5 rounded-md font-bold tabular-nums flex-shrink-0"
            style={{ background: 'rgba(148,163,184,0.18)', color: 'var(--rs-muted, #cbd5e1)' }}>
        +{g.score ?? 0}
      </span>
    </div>
  )
}

GuessRow.propTypes = { g: PropTypes.object.isRequired }

export default function RoundSummary({ guesses, final = false }) {
  if (guesses.length === 0) return null

  // Final breakdown: every guess in play order, plus the cumulative total.
  if (final) {
    return (
      <div className="rounded-2xl px-4 py-3 border"
           style={{ background: 'rgba(15,23,42,0.55)', borderColor: 'rgba(148,163,184,0.25)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2.5"
           style={{ color: 'var(--rs-muted, #cbd5e1)' }}>
          Round breakdown
        </p>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-0.5">
          {guesses.map((g) => <GuessRow key={g.country.id} g={g} />)}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t"
             style={{ borderColor: 'rgba(148,163,184,0.25)' }}>
          <span className="font-bold uppercase tracking-wider text-sm"
                style={{ color: 'var(--rs-name, #e2e8f0)' }}>Total score</span>
          <span className="font-black text-xl tabular-nums"
                style={{ color: 'var(--rs-name, #e2e8f0)' }}>
            {totalScore(guesses).toLocaleString()}
          </span>
        </div>
      </div>
    )
  }

  // Per-guess summary: highlight the most recent guess. Themed to the app
  // surface (the --rs-* vars drive GuessRow's text colours).
  const latest = guesses[guesses.length - 1]
  return (
    <div className="rounded-2xl px-4 py-2.5 border"
         style={{
           background: 'var(--surface)',
           borderColor: 'var(--border)',
           '--rs-name': 'var(--text)',
           '--rs-muted': 'var(--text-muted)',
           animation: 'fadeSlideIn 0.25s ease both',
         }}>
      <GuessRow g={latest} />
    </div>
  )
}

RoundSummary.propTypes = {
  guesses: PropTypes.array.isRequired,
  final: PropTypes.bool,
}
