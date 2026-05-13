import { useState, useRef, useMemo } from 'react'
import { countries } from '../data/countries'

export default function GuessInput({ onGuess, guesses, disabled }) {
  const [input, setInput]     = useState('')
  const [open, setOpen]       = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef(null)

  const guessedIds = useMemo(() => new Set(guesses.map(g => g.country.id)), [guesses])

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase()
    if (!q) return []

    const rank = (c) => {
      if (c.aliases?.some(a => a.toLowerCase() === q)) return 0  // exact alias (e.g. "uk")
      if (c.name.toLowerCase() === q)                  return 0  // exact name
      if (c.name.toLowerCase().startsWith(q))          return 1  // name prefix
      if (c.aliases?.some(a => a.toLowerCase().startsWith(q))) return 2  // alias prefix
      return 3                                                     // substring
    }

    return countries
      .filter(c => {
        if (guessedIds.has(c.id)) return false
        if (c.name.toLowerCase().includes(q)) return true
        if (c.aliases?.some(a => a.toLowerCase().includes(q))) return true
        return false
      })
      .sort((a, b) => rank(a) - rank(b))
      .slice(0, 7)
  }, [input, guessedIds])

  const handleSelect = (country) => {
    if (!country) return
    onGuess(country)
    setInput('')
    setOpen(false)
    setActiveIdx(0)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(suggestions[activeIdx] ?? suggestions[0])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          disabled={disabled}
          onChange={e => { setInput(e.target.value); setOpen(true); setActiveIdx(0) }}
          onFocus={() => input && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Type a country name…"
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-slate-800 text-white placeholder-slate-500 pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-base font-medium disabled:opacity-50"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-2 bg-slate-800 border border-slate-600 rounded-2xl overflow-hidden shadow-2xl">
          {suggestions.map((country, i) => (
            <li
              key={country.id}
              onMouseDown={() => handleSelect(country)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors flex items-center gap-3 ${
                i === activeIdx
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span className="text-slate-400 text-xs w-4">{i + 1}</span>
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
