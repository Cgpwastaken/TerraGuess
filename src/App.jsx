import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react'
import { countries } from './data/countries'
import { countryDistance } from './utils/distance'
import { getContinentForCountry } from './utils/continents'
import { scoreForDistance, totalScore } from './utils/scoring'
import { bearing } from './utils/bearing'
import { dailyCountry, utcDateString, dayNumber } from './utils/daily'
import { buildShareText } from './utils/share'
import { loadDailyResult, saveDailyResult } from './utils/storage'
import GuessInput from './components/GuessInput'
import GuessList from './components/GuessList'
import WinScreen from './components/WinScreen'
import FailScreen from './components/FailScreen'
import InstructionsModal from './components/InstructionsModal'
import WarningModal from './components/WarningModal'
import RoundSummary from './components/RoundSummary'
import ErrorBoundary from './components/ErrorBoundary'
import MapSkeleton from './components/MapSkeleton'
import './index.css'

// Lazy-load the map (and its world-atlas geometry) so the shell paints first
// and the heavy geography bundle is fetched on demand.
const WorldMap = lazy(() => import('./components/WorldMap'))

const MAX_GUESSES = 7
const WARNING_AT  = 5       // wrong-guess count that triggers "Only 2 left" popup
const GIVE_UP_AT  = 3       // wrong-guess count after which "Give up" appears

function pickRandom() {
  return countries[Math.floor(Math.random() * countries.length)]
}

// Daily mode → today's deterministic country; Practice mode → random.
function makeTarget(mode) {
  return mode === 'daily' ? dailyCountry(countries) : pickRandom()
}

function buildHint(target) {
  const continent = getContinentForCountry(target)
  const letter = target.name[0].toUpperCase()
  return `It's in ${continent} and starts with the letter "${letter}".`
}

export default function App() {
  const [today]     = useState(utcDateString)
  // Restore today's completed Daily result up front (lazy initial state) so a
  // revisit shows the finished result instead of allowing a replay.
  const [savedDaily] = useState(() => loadDailyResult(today))
  const [mode,      setMode]      = useState('daily')   // 'daily' | 'practice'
  const [target,    setTarget]    = useState(() => makeTarget('daily'))
  const [guesses,   setGuesses]   = useState(() => savedDaily?.guesses ?? [])
  const [isGlobe,   setIsGlobe]   = useState(false)
  const [gaveUp,    setGaveUp]    = useState(() => !!savedDaily?.gaveUp)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [warningSeen, setWarningSeen] = useState(false)
  const [showWinScreen, setShowWinScreen] = useState(false)
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))

  const wrongCount = useMemo(() => guesses.filter(g => !g.isCorrect).length, [guesses])
  const won        = useMemo(() => guesses.some(g => g.isCorrect), [guesses])
  const failed     = useMemo(
    () => !won && (gaveUp || wrongCount >= MAX_GUESSES),
    [won, gaveUp, wrongCount]
  )
  const gameOver = won || failed
  // A restored Daily result is always a finished game, so "done today" is simply
  // a completed game while in Daily mode.
  const dailyDone = mode === 'daily' && gameOver

  // Show the "Only 2 left" warning exactly once, right after the 5th wrong guess.
  // Mark it seen immediately, but delay the modal 600ms so the 5th guess result
  // (distance, colour, sorted position) fully renders before anything covers it.
  useEffect(() => {
    if (wrongCount === WARNING_AT && !warningSeen && !gameOver) {
      setWarningSeen(true)
      const t = setTimeout(() => setShowWarning(true), 600)
      return () => clearTimeout(t)
    }
  }, [wrongCount, warningSeen, gameOver])

  // On a correct guess, let the answer country pulse green on the map for 1000ms
  // before the win modal fades in, so the player sees where the answer was.
  // (Resetting back to hidden is handled by resetRound / switchMode.)
  useEffect(() => {
    if (!won) return
    const t = setTimeout(() => setShowWinScreen(true), 1000)
    return () => clearTimeout(t)
  }, [won])

  // Persist the Daily result to localStorage once the game ends, keyed by
  // today's UTC date. (Practice never persists.)
  useEffect(() => {
    if (mode === 'daily' && gameOver) {
      saveDailyResult(today, { guesses, gaveUp, won })
    }
  }, [mode, gameOver, guesses, gaveUp, won, today])

  // Track network connectivity to show a non-blocking offline banner.
  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Warmer/colder signal: is the latest guess closer than the previous best?
  // Pure-derived (never on the first guess, never on the winning guess) so it
  // needs no timer — a keyed CSS animation handles the 1.5s show-then-fade.
  const feedback = useMemo(() => {
    if (guesses.length < 2) return null
    const last = guesses[guesses.length - 1]
    if (last.isCorrect) return null
    const bestPrev = Math.min(...guesses.slice(0, -1).map(g => g.distance))
    return last.distance < bestPrev ? 'warmer' : 'colder'
  }, [guesses])

  const handleGuess = useCallback((country) => {
    if (!country) return
    setGuesses(prev => {
      if (prev.some(g => g.country.id === country.id)) return prev
      const isCorrect = country.id === target.id
      const distance  = isCorrect ? 0 : countryDistance(target, country)
      const score     = scoreForDistance(distance)
      const heading   = isCorrect ? null : bearing(country.lat, country.lng, target.lat, target.lng)
      return [...prev, { country, distance, isCorrect, score, bearing: heading }]
    })
  }, [target])

  const resetRound = (nextTarget) => {
    setTarget(nextTarget)
    setGuesses([])
    setGaveUp(false)
    setWarningSeen(false)
    setShowWarning(false)
    setShowWinScreen(false)
  }

  // Switch between Daily and Practice. Daily restores any completed result for
  // today (locked); Practice always starts a fresh random round.
  const switchMode = (next) => {
    if (next === mode) return
    setMode(next)
    if (next === 'daily') {
      const saved = loadDailyResult(today)
      if (saved) {
        // Restore the locked, finished result for today.
        setTarget(dailyCountry(countries))
        setGuesses(saved.guesses ?? [])
        setGaveUp(!!saved.gaveUp)
        setWarningSeen(true)
        setShowWarning(false)
      } else {
        resetRound(dailyCountry(countries))
      }
    } else {
      resetRound(pickRandom())
    }
  }

  // Daily is one country per day, so "Play Again" moves to Practice instead of
  // re-rolling the daily; Practice just starts a new random round.
  const handlePlayAgain = () => {
    if (mode === 'daily') { switchMode('practice'); return }
    resetRound(pickRandom())
  }

  const handleGiveUp = useCallback(() => {
    setGaveUp(true)
  }, [])

  const guessesLeft = MAX_GUESSES - wrongCount
  const canGiveUp   = !gameOver && wrongCount >= GIVE_UP_AT
  const score       = useMemo(() => totalScore(guesses), [guesses])
  const shareText   = useMemo(
    () => buildShareText({ guesses, won, dayNumber: mode === 'daily' ? dayNumber(today) : null }),
    [guesses, won, mode, today]
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Non-blocking offline banner */}
      {!online && (
        <div className="w-full text-center text-sm font-semibold py-2 px-4 bg-amber-500 text-amber-950">
          ⚠️ You're offline — the game still works, but your connection dropped.
        </div>
      )}

      {/* Content is full-width but capped at 1920px and centred on huge screens */}
      <div className="w-full max-w-[1920px] mx-auto flex flex-col flex-1">

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-4xl font-black tracking-tight"
            style={{ background: 'linear-gradient(135deg,#4ade80,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TerraGuess
        </h1>

        <div className="flex items-center gap-2">
          {/* Cumulative score */}
          <div className="flex flex-col items-end leading-none mr-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Score</span>
            <span className="text-lg font-black tabular-nums text-emerald-500">{score.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setIsGlobe(g => !g)}
            title={isGlobe ? 'Switch to flat map' : 'Switch to globe'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: isGlobe ? '#1d4ed8' : 'var(--surface)',
              color: isGlobe ? '#bfdbfe' : 'var(--text-muted)',
              border: `1px solid ${isGlobe ? '#3b82f6' : 'var(--border)'}`,
            }}
          >
            <span className="text-base">{isGlobe ? '🗺️' : '🌐'}</span>
            <span className="hidden sm:inline">{isGlobe ? 'Flat' : 'Globe'}</span>
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            title="How to play"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            ?
          </button>
        </div>
      </header>

      {/* Mode toggle: Daily vs Practice */}
      <div className="px-4 pb-3 w-full">
        <div className="inline-flex rounded-xl p-1 text-sm font-semibold"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {['daily', 'practice'].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="px-4 py-1.5 rounded-lg transition-colors cursor-pointer capitalize"
              style={{
                background: mode === m ? '#1d4ed8' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-muted)',
              }}
            >
              {m === 'daily' ? '🗓️ Daily' : '♾️ Practice'}
            </button>
          ))}
        </div>
        {mode === 'daily' && dailyDone && (
          <span className="ml-3 text-xs text-slate-500">Today's challenge is complete — switch to Practice to keep playing.</span>
        )}
      </div>

      {/* Main play area — fills the full width, two columns on desktop. On mobile
          the map sits on top and the controls/results stack below it (order). */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 px-4 pb-4 items-start w-full">

        {/* Map pane */}
        <div className="w-full lg:flex-1 lg:min-w-0 order-1">
          <ErrorBoundary onRetry={() => setIsGlobe(g => g)}>
            <Suspense fallback={<MapSkeleton />}>
              <WorldMap guesses={guesses} won={won} failed={failed} target={target} isGlobe={isGlobe} winPulse={won} />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Controls + results pane */}
        <div className="w-full lg:w-[400px] lg:flex-shrink-0 order-2 flex flex-col gap-3 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">

          {/* Search bar */}
          <div>
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

                {/* Warmer/colder micro-feedback — keyed so the CSS animation
                    replays on each new guess, then fades out on its own. */}
                {feedback && (
                  <div
                    key={guesses.length}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold pointer-events-none"
                    style={{
                      animation: 'warmerColder 1.5s ease forwards',
                      background: feedback === 'warmer' ? 'rgba(249,115,22,0.18)' : 'rgba(56,189,248,0.18)',
                      color: feedback === 'warmer' ? '#fb923c' : '#38bdf8',
                    }}
                  >
                    {feedback === 'warmer' ? 'Closer! 🔥' : 'Colder ❄️'}
                  </div>
                )}

                {/* Per-guess round summary (latest guess) */}
                {guesses.length > 0 && (
                  <div className="mt-2">
                    <RoundSummary guesses={guesses} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-slate-500 text-sm py-2">
                {won ? '🎉 You found it!' : gaveUp ? '🏳️ You gave up.' : '😔 Better luck next time!'}
              </div>
            )}
          </div>

          {/* Guess list */}
          {guesses.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Guesses (closest first)
              </p>
              <GuessList guesses={guesses} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-5 mt-auto" style={{ color: 'var(--text-muted)' }}>
        Made by <span className="font-medium" style={{ color: 'var(--text)' }}>Veer Aditya Mirza</span>
      </footer>

      </div>{/* /max-w wrapper */}

      {/* Modals */}
      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      {showWarning && (
        <WarningModal
          hint={buildHint(target)}
          onClose={() => setShowWarning(false)}
        />
      )}
      {won && showWinScreen && <WinScreen  guesses={guesses} target={target} onPlayAgain={handlePlayAgain} shareText={shareText} />}
      {failed && <FailScreen target={target} guesses={guesses} onPlayAgain={handlePlayAgain} gaveUp={gaveUp} shareText={shareText} />}
    </div>
  )
}
