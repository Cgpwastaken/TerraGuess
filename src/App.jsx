import { useState, useCallback, useMemo, useEffect } from 'react'
import { countries } from './data/countries'
import { countryDistance } from './utils/distance'
import { getContinent } from './utils/continents'
import WorldMap from './components/WorldMap'
import GuessInput from './components/GuessInput'
import GuessList from './components/GuessList'
import WinScreen from './components/WinScreen'
import FailScreen from './components/FailScreen'
import InstructionsModal from './components/InstructionsModal'
import WarningModal from './components/WarningModal'
import './index.css'

const MAX_GUESSES = 7
const WARNING_AT  = 5       // wrong-guess count that triggers "Only 2 left" popup
const GIVE_UP_AT  = 3       // wrong-guess count after which "Give up" appears

function pickRandom() {
  return countries[Math.floor(Math.random() * countries.length)]
}

function buildHint(target) {
  const continent = getContinent(target.lat, target.lng)
  const letter = target.name[0].toUpperCase()
  return `It's in ${continent} and starts with the letter "${letter}".`
}

export default function App() {
  const [target,    setTarget]    = useState(pickRandom)
  const [guesses,   setGuesses]   = useState([])
  const [isGlobe,   setIsGlobe]   = useState(false)
  const [gaveUp,    setGaveUp]    = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [warningSeen, setWarningSeen] = useState(false)

  const wrongCount = useMemo(() => guesses.filter(g => !g.isCorrect).length, [guesses])
  const won        = useMemo(() => guesses.some(g => g.isCorrect), [guesses])
  const failed     = useMemo(
    () => !won && (gaveUp || wrongCount >= MAX_GUESSES),
    [won, gaveUp, wrongCount]
  )
  const gameOver = won || failed

  // Show the "Only 2 left" warning exactly once, right after the 5th wrong guess
  useEffect(() => {
    if (wrongCount === WARNING_AT && !warningSeen && !gameOver) {
      setShowWarning(true)
      setWarningSeen(true)
    }
  }, [wrongCount, warningSeen, gameOver])

  const handleGuess = useCallback((country) => {
    if (!country) return
    setGuesses(prev => {
      if (prev.some(g => g.country.id === country.id)) return prev
      const isCorrect = country.id === target.id
      const distance  = isCorrect ? 0 : countryDistance(target, country)
      return [...prev, { country, distance, isCorrect }]
    })
  }, [target])

  const handlePlayAgain = useCallback(() => {
    setTarget(pickRandom())
    setGuesses([])
    setGaveUp(false)
    setWarningSeen(false)
    setShowWarning(false)
  }, [])

  const handleGiveUp = useCallback(() => {
    setGaveUp(true)
  }, [])

  const guessesLeft = MAX_GUESSES - wrongCount
  const canGiveUp   = !gameOver && wrongCount >= GIVE_UP_AT

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f172a', color: '#f1f5f9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-4xl font-black tracking-tight"
            style={{ background: 'linear-gradient(135deg,#4ade80,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TerraGuess
        </h1>

        <div className="flex items-center gap-2">
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

      {/* Search bar */}
      <div className="px-4 pb-3 max-w-2xl mx-auto w-full">
        {!gameOver ? (
          <>
            <GuessInput onGuess={handleGuess} guesses={guesses} />

            {/* Counter row + give-up button */}
            <div className="mt-2 flex items-center justify-between text-sm gap-3 px-1">
              <span className={guessesLeft <= 2 ? 'text-red-400 font-semibold' : 'text-slate-500'}>
                {guesses.length === 0
                  ? 'Type a country name to start guessing'
                  : (
                    <>
                      {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'} used
                      <span className="text-slate-600 mx-1.5">·</span>
                      <span className={guessesLeft <= 2 ? 'text-red-400 font-bold' : ''}>
                        {guessesLeft} remaining
                      </span>
                    </>
                  )}
              </span>

              {canGiveUp && (
                <button
                  onClick={handleGiveUp}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-700 border border-red-800 hover:border-red-500 transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                  title="Reveal the answer"
                >
                  🏳️ Give up
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-slate-500 text-sm py-2">
            {won ? '🎉 You found it!' : gaveUp ? '🏳️ You gave up.' : '😔 Better luck next time!'}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="px-4 pb-4 flex-1">
        <WorldMap guesses={guesses} won={won} failed={failed} target={target} isGlobe={isGlobe} />
      </div>

      {/* Guess list */}
      {guesses.length > 0 && (
        <div className="px-4 pb-4 max-w-2xl mx-auto w-full">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Guesses (closest first)
          </p>
          <GuessList guesses={guesses} />
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-slate-600 text-sm py-5 mt-auto">
        Made by <span className="text-slate-400 font-medium">Veer Aditya Mirza</span>
      </footer>

      {/* Modals */}
      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      {showWarning && (
        <WarningModal
          hint={buildHint(target)}
          onClose={() => setShowWarning(false)}
        />
      )}
      {won    && <WinScreen  guesses={guesses} target={target} onPlayAgain={handlePlayAgain} />}
      {failed && <FailScreen target={target}   onPlayAgain={handlePlayAgain} gaveUp={gaveUp} />}
    </div>
  )
}
