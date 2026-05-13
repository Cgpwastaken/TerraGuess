import { useState } from 'react'

export default function WarningModal({ onClose, hint }) {
  const [showHint, setShowHint] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background:
          'radial-gradient(circle at center, rgba(245,158,11,0.5) 0%, rgba(0,0,0,0.85) 70%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="rounded-3xl px-8 py-9 text-center max-w-md w-full shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #f59e0b 0%, #d97706 55%, #b45309 100%)',
          border: '3px solid #fbbf24',
          boxShadow:
            '0 25px 80px -10px rgba(245,158,11,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <div className="text-7xl mb-4 select-none">⚠️</div>
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight"
            style={{ textShadow: '0 3px 10px rgba(0,0,0,0.35)' }}>
          ONLY 2 GUESSES LEFT!
        </h2>
        <p className="text-amber-50 mb-7">
          You've used 5 of your 7 guesses. Choose your next moves wisely.
        </p>

        {!showHint ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowHint(true)}
              className="w-full bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold py-3.5 rounded-xl border-2 border-white/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="text-xl">💡</span>
              Get a hint
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white text-amber-700 font-bold py-3.5 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
            >
              Continue without a hint
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-4 mb-5 border-2 border-white/30 text-left">
              <p className="text-amber-100 text-xs uppercase tracking-wider font-bold mb-2">
                💡 Hint
              </p>
              <p className="text-white font-semibold text-lg leading-snug">
                {hint}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-white text-amber-700 font-bold py-3.5 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
            >
              Got it — let's go!
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
