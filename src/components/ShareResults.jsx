import { useState } from 'react'
import PropTypes from 'prop-types'
import { copyToClipboard } from '../utils/share'

// Share button for the win/lose screens. Copies the spoiler-free result text
// to the clipboard, shows a transient "Copied!" confirmation, and falls back
// to a selectable field if the clipboard is unavailable.
export default function ShareResults({ shareText, accent = '#16a34a' }) {
  const [copied, setCopied] = useState(false)
  const [manual, setManual] = useState(false)

  const handleShare = async () => {
    const ok = await copyToClipboard(shareText)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      setManual(true)
    }
  }

  return (
    <div className="mb-3">
      <button
        onClick={handleShare}
        className="w-full bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold py-3.5 rounded-2xl border-2 border-white/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        {copied ? <>✅ Copied!</> : <>🔗 Share Results</>}
      </button>

      {manual && (
        <div className="mt-2">
          <p className="text-xs text-white/80 mb-1">Copy your result manually:</p>
          <input
            readOnly
            value={shareText.replace(/\n/g, ' ')}
            onFocus={(e) => e.target.select()}
            className="w-full text-sm rounded-xl px-3 py-2 bg-white/90 text-slate-800 font-medium"
            style={{ outlineColor: accent }}
          />
        </div>
      )}
    </div>
  )
}

ShareResults.propTypes = {
  shareText: PropTypes.string.isRequired,
  accent: PropTypes.string,
}
