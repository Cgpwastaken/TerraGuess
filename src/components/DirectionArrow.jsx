import PropTypes from 'prop-types'

// Small arrow that points along a compass bearing (0 = up/north, clockwise).
// The base glyph points up; we rotate it by the bearing in degrees.
export default function DirectionArrow({ bearing, size = 18, color = '#cbd5e1', title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      style={{ transform: `rotate(${bearing}deg)`, transition: 'transform 0.3s ease', flexShrink: 0 }}
    >
      {title && <title>{title}</title>}
      <path
        d="M12 2 L18 20 L12 16 L6 20 Z"
        fill={color}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

DirectionArrow.propTypes = {
  bearing: PropTypes.number.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  title: PropTypes.string,
}
