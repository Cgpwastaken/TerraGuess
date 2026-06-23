import { STOPS } from '../utils/colors'

export default function InstructionsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="border-2 rounded-3xl p-10 max-w-2xl w-full shadow-2xl"
           style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        <div className="text-center mb-8">
          <div className="text-7xl mb-4 select-none">🌍</div>
          <h2 className="text-4xl font-black tracking-tight"
              style={{ background: 'linear-gradient(135deg,#4ade80,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            How to play TerraGuess
          </h2>
        </div>

        <ul className="space-y-4 mb-8">
          {[
            ['🔍', 'Guess any country in the world to start.'],
            ['🌡️', 'Each guess lights up on the map coloured by how close it is to the mystery country.'],
            ['📍', 'Use the distance shown under each guess to zero in on the answer.'],
            ['🌐', 'Toggle between flat map and globe view in the header. In globe mode, drag to rotate and scroll to zoom.'],
            ['🏳️', 'After 3 wrong guesses a "Give up" button appears if you want to reveal the answer.'],
            ['💡', 'After 5 wrong guesses you can claim a hint — but only if you choose to.'],
            ['✅', 'Guess correctly to win! You have 7 guesses total.'],
          ].map(([icon, text]) => (
            <li key={icon} className="flex gap-4 items-start">
              <span className="text-2xl leading-snug select-none flex-shrink-0">{icon}</span>
              <span className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{text}</span>
            </li>
          ))}
        </ul>

        {/* Colour guide — uses live STOPS data */}
        <div className="rounded-2xl px-5 py-4 mb-8 border"
             style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Colour guide (distance from answer)
          </p>
          <div className="flex gap-1.5">
            {STOPS.map(({ color, label }) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full h-5 rounded" style={{ backgroundColor: color }} />
                <span className="text-slate-400 text-center leading-tight"
                      style={{ fontSize: '10px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-black py-4 px-6 rounded-2xl transition-colors cursor-pointer text-lg shadow-lg"
        >
          Let's play!
        </button>
      </div>
    </div>
  )
}
