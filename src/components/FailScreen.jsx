export default function FailScreen({ target, onPlayAgain, gaveUp }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background:
          'radial-gradient(circle at center, rgba(220,38,38,0.55) 0%, rgba(0,0,0,0.88) 70%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="rounded-3xl px-10 py-12 text-center max-w-lg w-full shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #b91c1c 0%, #991b1b 55%, #7f1d1d 100%)',
          border: '3px solid #ef4444',
          boxShadow:
            '0 25px 80px -10px rgba(220,38,38,0.55), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <div className="text-8xl mb-5 select-none">{gaveUp ? '🏳️' : '💀'}</div>

        <h2 className="text-5xl font-black text-white tracking-tight mb-3"
            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
          {gaveUp ? 'YOU GAVE UP' : 'YOU LOST'}
        </h2>

        <p className="text-xl text-red-100 mb-2">
          {gaveUp ? 'No worries — try another!' : 'You used all 7 guesses.'}
        </p>

        <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 my-8 border border-white/20">
          <p className="text-red-100 text-sm uppercase tracking-wider font-semibold mb-2">
            The answer was
          </p>
          <p className="text-white text-4xl font-black select-text"
             style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            {target.name}
          </p>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full bg-white text-red-700 font-black text-xl py-4 rounded-2xl hover:bg-red-50 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
