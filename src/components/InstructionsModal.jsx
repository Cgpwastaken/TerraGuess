export default function InstructionsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 select-none">🌍</div>
          <h2 className="text-2xl font-black text-white tracking-tight">How to play TerraGuess</h2>
        </div>

        <ul className="space-y-3 mb-6">
          {[
            ['🔍', 'Guess any country in the world to start.'],
            ['🌡️', 'Each guess is coloured by how close it is to the mystery country — darker red means closer, pale yellow means far away.'],
            ['📍', 'Use the distance and heat colour on each guess to zero in on the answer.'],
            ['✅', 'Guess the correct country to win!'],
            ['💀', 'You have 7 guesses. Use them wisely — miss all 7 and the answer is revealed.'],
          ].map(([icon, text]) => (
            <li key={icon} className="flex gap-3 items-start">
              <span className="text-lg leading-snug select-none">{icon}</span>
              <span className="text-gray-300 text-sm leading-snug">{text}</span>
            </li>
          ))}
        </ul>

        <div className="bg-gray-700/60 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Colour guide</p>
          <div className="flex justify-between text-xs text-gray-300">
            {[
              ['#7f1d1d', '< 500 km'],
              ['#dc2626', '< 1,500 km'],
              ['#f97316', '< 3,000 km'],
              ['#eab308', '< 5,000 km'],
              ['#fef08a', '5,000+ km'],
            ].map(([color, label]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: color }} />
                <span className="text-center leading-tight" style={{ fontSize: '10px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Let's play!
        </button>
      </div>
    </div>
  )
}
