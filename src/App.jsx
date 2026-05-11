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
  const [target, setTarget] = useState(pickRandom)
  const [guesses, setGuesses] = useState([])
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
      const distance = isCorrect
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="text-center pt-6 pb-3 px-4 flex items-center justify-center gap-3">
        <h1 className="text-4xl font-black tracking-tight text-white">TerraGuess</h1>
        <button
          onClick={() => setShowInstructions(true)}
          title="How to play"
          className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm font-bold transition-colors flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          ?
        </button>
      </header>

      <p className="text-gray-400 text-sm text-center pb-3">
        Guess the mystery country — hotter colours mean closer
      </p>

      {/* Map */}
      <div className="flex-1 px-4 pb-2">
        <WorldMap guesses={guesses} won={won} failed={failed} target={target} />
      </div>

      {/* Guess counter */}
      <div className="text-center text-xs pb-1">
        {guesses.length === 0 ? (
          <span className="text-gray-500">No guesses yet — type a country to start</span>
        ) : gameOver ? null : (
          <span className={guessesLeft <= 2 ? 'text-red-400 font-semibold' : 'text-gray-500'}>
            {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'} —{' '}
            {guessesLeft} remaining
          </span>
        )}
      </div>

      {/* Input + guess list */}
      <div className="px-4 max-w-xl mx-auto w-full">
        {!gameOver && <GuessInput onGuess={handleGuess} guesses={guesses} />}
        <GuessList guesses={guesses} />
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs py-4 mt-auto">
        Made by Veer Aditya Mirza
      </footer>

      {/* Modals */}
      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      {won    && <WinScreen  guesses={guesses} onPlayAgain={handlePlayAgain} />}
      {failed && <FailScreen target={target}   onPlayAgain={handlePlayAgain} />}
    </div>
  )
}
