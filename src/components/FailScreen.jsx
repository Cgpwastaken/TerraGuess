export default function FailScreen({ target, onPlayAgain }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
        <div className="text-6xl mb-4 select-none">😔</div>
        <h2 className="text-2xl font-bold text-white mb-2">Better luck next time!</h2>
        <p className="text-gray-300 mb-1">
          The answer was{' '}
          <span className="text-green-400 font-bold">{target.name}</span>
        </p>
        <p className="text-gray-500 text-sm mb-8">
          You used all 7 guesses without finding it.
        </p>
        <button
          onClick={onPlayAgain}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
