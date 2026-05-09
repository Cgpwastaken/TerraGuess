import { getColor, getLabel } from '../utils/colors'

function fmt(km) {
  if (km === 0) return '0 km'
  if (km < 1000) return `${Math.round(km).toLocaleString()} km`
  return `${(km / 1000).toFixed(1)}k km`
}

export default function GuessList({ guesses }) {
  if (guesses.length === 0) return null

  return (
    <div className="mt-4 flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
      {guesses.map((g, i) => (
        <div
          key={g.country.id}
          className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-2.5 text-sm"
        >
          <div
            className="w-4 h-4 rounded flex-shrink-0"
            style={{ backgroundColor: g.isCorrect ? '#22c55e' : getColor(g.distance) }}
          />
          <span className="flex-1 font-medium text-gray-100">{g.country.name}</span>
          {g.isCorrect ? (
            <span className="text-green-400 font-semibold">Correct!</span>
          ) : (
            <span className="text-gray-400 tabular-nums">
              {fmt(g.distance)}
              <span className="ml-2 text-gray-500">{getLabel(g.distance)}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
