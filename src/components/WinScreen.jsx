import RoundSummary from './RoundSummary'
import ShareResults from './ShareResults'

export default function WinScreen({ guesses, target, onPlayAgain, shareText }) {
  const count = guesses.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background:
          'radial-gradient(circle at center, rgba(34,197,94,0.55) 0%, rgba(0,0,0,0.88) 70%)',
        backdropFilter: 'blur(10px)',
        animation: 'modalFadeIn 0.45s ease both',
      }}
    >
      <div
        className="rounded-3xl px-8 py-10 text-center max-w-lg w-full shadow-2xl max-h-[92vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(160deg, #16a34a 0%, #15803d 55%, #14532d 100%)',
          border: '3px solid #4ade80',
          boxShadow:
            '0 25px 80px -10px rgba(34,197,94,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <div className="text-8xl mb-5 select-none" style={{ animation: 'fadeSlideIn 0.5s ease both' }}>🎉</div>

        <h2 className="text-5xl font-black text-white tracking-tight mb-3"
            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          YOU WIN!
        </h2>

        <p className="text-xl text-green-50 mb-2">
          The answer was
        </p>
        <p className="text-3xl font-black text-white mb-6 select-text"
           style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          {target?.name ?? '—'}
        </p>

        <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-4 mb-5 border border-white/20">
          <p className="text-green-100 text-sm uppercase tracking-wider font-semibold mb-1">
            Solved in
          </p>
          <p className="text-white text-4xl font-black">
            {count} <span className="text-xl font-bold text-green-100">
              {count === 1 ? 'guess' : 'guesses'}
            </span>
          </p>
        </div>

        {/* Full round breakdown with per-guess scores + cumulative total */}
        <div className="text-left mb-5">
          <RoundSummary guesses={guesses} final />
        </div>

        {shareText && <ShareResults shareText={shareText} accent="#16a34a" />}

        <button
          onClick={onPlayAgain}
          className="w-full bg-white text-green-700 font-black text-xl py-4 rounded-2xl hover:bg-green-50 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
