export default function WinScreen({ guesses, onPlayAgain }) {
  const target = guesses.find(g => g.isCorrect)?.country
  const count = guesses.length

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
        <div className="text-6xl mb-4 select-none">🌍</div>
        <h2 className="text-2xl font-bold text-white mb-2">You got it!</h2>
        <p className="text-gray-300 mb-1">
          The answer was{' '}
          <span className="text-green-400 font-bold">{target?.name}</span>
        </p>
        <p className="text-gray-400 mb-8">
          Solved in{' '}
          <span className="text-white font-bold">
            {count} {count === 1 ? 'guess' : 'guesses'}
          </span>
        </p>
        <button
          onClick={onPlayAgain}
          className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
