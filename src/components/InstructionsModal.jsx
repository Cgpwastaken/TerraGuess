import { STOPS } from '../utils/colors'

export default function InstructionsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 max-w-md w-full shadow-2xl">

        <div className="text-center mb-6">
          <div className="text-5xl mb-3 select-none">🌍</div>
          <h2 className="text-2xl font-black text-white tracking-tight">How to play TerraGuess</h2>
        </div>

        <ul className="space-y-3 mb-6">
          {[
            ['🔍', 'Guess any country in the world to start.'],
            ['🌡️', 'Each guess lights up on the map coloured by how close it is to the mystery country.'],
            ['📍', 'Use the distance shown under each guess to zero in on the answer.'],
            ['🌐', 'Toggle between flat map and globe view with the button in the header.'],
            ['✅', 'Guess correctly to win — no wrong-guess penalty on timing, only 7 tries total!'],
            ['💀', 'Use all 7 guesses without finding it and the answer is revealed.'],
          ].map(([icon, text]) => (
            <li key={icon} className="flex gap-3 items-start">
              <span className="text-lg leading-snug select-none flex-shrink-0">{icon}</span>
              <span className="text-slate-300 text-sm leading-snug">{text}</span>
            </li>
          ))}
        </ul>

        {/* Colour guide — uses live STOPS data */}
        <div className="bg-slate-700/50 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
            Colour guide (distance from answer)
          </p>
          <div className="flex gap-1">
            {STOPS.map(({ color, label }) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full h-4 rounded" style={{ backgroundColor: color }} />
                <span className="text-slate-400 text-center leading-tight"
                      style={{ fontSize: '9px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors cursor-pointer text-base"
        >
          Let's play!
        </button>
      </div>
    </div>
  )
}
