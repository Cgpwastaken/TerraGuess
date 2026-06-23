import { Component } from 'react'
import PropTypes from 'prop-types'

// Catches render/runtime errors in its subtree (e.g. map initialisation) and
// shows a friendly message with a Retry button instead of a blank screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    // Surface for debugging without crashing the app.
    console.error('TerraGuess caught an error:', error)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 p-8 text-center"
               style={{ minHeight: 320 }}>
            <div className="text-5xl mb-3 select-none">🗺️💥</div>
            <p className="text-slate-200 font-semibold mb-1">The map failed to load.</p>
            <p className="text-slate-400 text-sm mb-5">Something went wrong rendering the world map.</p>
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
  onRetry: PropTypes.func,
}
