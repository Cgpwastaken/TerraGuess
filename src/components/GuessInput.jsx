import { useState, useRef, useMemo } from 'react'
import { countries } from '../data/countries'

export default function GuessInput({ onGuess, guesses }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef(null)

  const guessedIds = useMemo(() => new Set(guesses.map(g => g.country.id)), [guesses])

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase()
    if (!q) return []

    // Rank 0 = best: query exactly matches a known alias (e.g. "uk" → United Kingdom)
    // Rank 1: name starts with query
    // Rank 2: alias starts with query
    // Rank 3: name contains query
    const rank = (c) => {
      if (c.aliases?.some(a => a.toLowerCase() === q)) return 0
      if (c.name.toLowerCase() === q)                  return 0
      if (c.name.toLowerCase().startsWith(q))          return 1
      if (c.aliases?.some(a => a.toLowerCase().startsWith(q))) return 2
      return 3
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
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setOpen(true)
            setActiveIdx(0)
          }}
          onFocus={() => input && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Type a country name…"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-gray-800 text-white placeholder-gray-500 px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-base"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl overflow-hidden shadow-2xl">
          {suggestions.map((country, i) => (
            <li
              key={country.id}
              onMouseDown={() => handleSelect(country)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                i === activeIdx ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-700'
              }`}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
