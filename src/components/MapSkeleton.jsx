// Placeholder shown while the (lazily-loaded) world map is being fetched.
// Uses the same rounded container and aspect so there is no layout shift once
// the real map renders.
export default function MapSkeleton() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden ring-1 ring-slate-700 flex items-center justify-center"
         style={{ background: '#1e293b', aspectRatio: '800 / 440' }}>
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <span className="inline-block w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-400 animate-spin" />
        <span className="text-sm font-medium">Loading map…</span>
      </div>
    </div>
  )
}
