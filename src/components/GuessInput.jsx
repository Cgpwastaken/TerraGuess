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
    // When the autocomplete dropdown is open, arrow keys navigate it.
    if (open && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx(i => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect(suggestions[activeIdx] ?? suggestions[0])
        return
      }
      if (e.key === 'Escape') {
        setOpen(false)
        e.target.blur()
        return
      }
    }
    // Dropdown closed / empty input → let arrow keys scroll the page so the
    // user can reach the guess list below without having to click out first.
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      window.scrollBy({ top: 120, behavior: 'smooth' })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      window.scrollBy({ top: -120, behavior: 'smooth' })
    } else if (e.key === 'Escape') {
      e.target.blur()
    }
  }

  return (
    <div className="relative">
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
        style={{ background: 'var(--surface)', color: 'var(--text)' }}
        className="w-full placeholder-slate-500 px-5 py-4 rounded-2xl border-2 border-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-base font-medium disabled:opacity-50"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-2 rounded-2xl overflow-hidden shadow-2xl border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {suggestions.map((country, i) => (
            <li
              key={country.id}
              // onMouseDown (not onClick) so selection registers before the
              // input's onBlur fires and closes the dropdown.
              onMouseDown={() => handleSelect(country)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`w-full min-h-[44px] px-4 py-3 cursor-pointer text-sm font-medium transition-colors flex items-center gap-3 active:bg-blue-700 ${
                i === activeIdx ? 'bg-blue-600 text-white' : 'hover:bg-blue-600/20'
              }`}
              style={i === activeIdx ? undefined : { color: 'var(--text)' }}
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
