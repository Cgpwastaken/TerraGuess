import { useState, useCallback, useMemo } from 'react'
import { countries } from './data/countries'
import { haversine } from './utils/distance'
import WorldMap from './components/WorldMap'
import GuessInput from './components/GuessInput'
import GuessList from './components/GuessList'
import WinScreen from './components/WinScreen'
import FailScreen from './components/FailScreen'
import InstructionsModal from './components/InstructionsModal'
import './index.css'

const MAX_GUESSES = 7

function pickRandom() {
  return countries[Math.floor(Math.random() * countries.length)]
}

export default function App() {
  const [target, setTarget]           = useState(pickRandom)
  const [guesses, setGuesses]         = useState([])
  const [isGlobe, setIsGlobe]         = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const won    = useMemo(() => guesses.some(g => g.isCorrect), [guesses])
  const failed = useMemo(
    () => !won && guesses.filter(g => !g.isCorrect).length >= MAX_GUESSES,
    [won, guesses]
  )
  const gameOver = won || failed

  const handleGuess = useCallback((country) => {
    if (!country) return
    setGuesses(prev => {
      if (prev.some(g => g.country.id === country.id)) return prev
      const isCorrect = country.id === target.id
      const distance  = isCorrect
        ? 0
        : haversine(target.lat, target.lng, country.lat, country.lng)
      return [...prev, { country, distance, isCorrect }]
    })
  }, [target])

  const handlePlayAgain = useCallback(() => {
    setTarget(pickRandom())
    setGuesses([])
  }, [])

  const wrongCount  = guesses.filter(g => !g.isCorrect).length
  const guessesLeft = MAX_GUESSES - wrongCount

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f172a', color: '#f1f5f9' }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black tracking-tight"
              style={{ background: 'linear-gradient(135deg,#4ade80,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TerraGuess
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Globe / Flat toggle */}
          <button
            onClick={() => setIsGlobe(g => !g)}
            title={isGlobe ? 'Switch to flat map' : 'Switch to globe'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: isGlobe ? '#1d4ed8' : '#1e293b',
              color: isGlobe ? '#bfdbfe' : '#94a3b8',
              border: `1px solid ${isGlobe ? '#3b82f6' : '#334155'}`,
            }}
          >
            <span className="text-base">{isGlobe ? '🗺️' : '🌐'}</span>
            <span className="hidden sm:inline">{isGlobe ? 'Flat' : 'Globe'}</span>
          </button>

          {/* How to play */}
          <button
            onClick={() => setShowInstructions(true)}
            title="How to play"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
          >
            ?
          </button>
        </div>
      </header>

      {/* ── Search bar (above the map) ── */}
      <div className="px-4 pb-3 max-w-2xl mx-auto w-full">
        {!gameOver ? (
          <>
            <GuessInput onGuess={handleGuess} guesses={guesses} />
            <div className="mt-2 text-center text-sm">
              {guesses.length === 0 ? (
                <span className="text-slate-500">Type a country name to start guessing</span>
              ) : (
                <span className={guessesLeft <= 2 ? 'text-red-400 font-semibold' : 'text-slate-500'}>
                  {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'} used
                  {' · '}
                  <span className={guessesLeft <= 2 ? 'text-red-400 font-bold' : ''}>
                    {guessesLeft} remaining
                  </span>
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-slate-500 text-sm py-2">
            {won ? '🎉 You found it!' : '😔 Better luck next time!'}
          </div>
        )}
      </div>

      {/* ── Map ── */}
      <div className="px-4 pb-4 flex-1">
        <WorldMap guesses={guesses} won={won} failed={failed} target={target} isGlobe={isGlobe} />
      </div>

      {/* ── Guess history ── */}
      {guesses.length > 0 && (
        <div className="px-4 pb-4 max-w-2xl mx-auto w-full">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Guesses
          </p>
          <GuessList guesses={guesses} />
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="text-center text-slate-600 text-sm py-5 mt-auto">
        Made by <span className="text-slate-400 font-medium">Veer Aditya Mirza</span>
      </footer>

      {/* ── Modals ── */}
      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      {won    && <WinScreen  guesses={guesses} onPlayAgain={handlePlayAgain} />}
      {failed && <FailScreen target={target}   onPlayAgain={handlePlayAgain} />}
    </div>
  )
}
