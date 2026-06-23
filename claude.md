# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo

There is no test suite. `.npmrc` sets `legacy-peer-deps=true`, so install with `npm install` as-is (React 19 + react-simple-maps 3 have peer-dep conflicts that this resolves).

## What this is

**TerraGuess** — a single-page, client-only geography guessing game (a Worldle-style "guess the country" game). React 19 + Vite + Tailwind v4 (via `@tailwindcss/vite`). No backend, no router, no persistence; all state lives in `App.jsx` for the duration of a session.

## Architecture

`src/App.jsx` is the single source of game state and rules. Everything else is a presentational component or a pure helper. The game flow:

1. `pickRandom()` selects a target country at mount and on "Play Again".
2. Each guess is stored as `{ country, distance, isCorrect }`. Derived state (`won`, `failed`, `wrongCount`, `gameOver`) is computed with `useMemo` from the `guesses` array — never stored directly.
3. Game-rule constants live at the top of `App.jsx`: `MAX_GUESSES` (7), `WARNING_AT` (the "only 2 left" popup fires once at 5 wrong guesses), `GIVE_UP_AT` (give-up button appears after 3 wrong guesses).

### Distance + map linkage (the core mechanic)
The map and the guess list are colored by distance from the target. Countries are keyed by **ISO 3166-1 numeric code** (`id`), which intentionally matches `geo.id` in `world-atlas/countries-110m.json` — that shared key is how a guessed country in `src/data/countries.js` gets matched to its polygon in `WorldMap.jsx`. When adding/editing countries, keep `id` consistent with world-atlas.

- `src/utils/distance.js` — `countryDistance` uses haversine over centroids, but supports an optional `anchors` array on a country (multiple lat/lng points) and takes the **minimum** pairwise distance. This exists so countries that border across the map edge / poles (e.g. Russia–US via the Bering Strait) register as close. Add `anchors` to a country only when its centroid misrepresents real-world adjacency.
- `src/utils/colors.js` — `STOPS` defines the 8-band distance→color heat scale used by both the map fill and the legend. Edit `STOPS` to change either; they read from the same source.
- `src/utils/continents.js` — rough centroid→continent lookup, used **only** to build the hint text in the warning modal. Approximate by design (note: Russia is bucketed as Europe).

### Rendering
`src/components/WorldMap.jsx` renders both views from one `react-simple-maps` `ComposableMap`, switched by the `isGlobe` prop: `geoOrthographic` (draggable/zoomable globe with custom mouse + wheel handlers) vs `geoNaturalEarth1` (flat map using `ZoomableGroup`). Globe rotation/zoom is local component state. Wheel zoom only triggers with Ctrl/Cmd held, so normal scrolling still scrolls the page past the map.

Other components (`GuessInput`, `GuessList`, `WinScreen`, `FailScreen`, `InstructionsModal`, `WarningModal`) are presentational and driven entirely by props from `App.jsx`.

## Conventions

- Styling is Tailwind utility classes plus inline `style={{}}` for the dark slate theme colors and gradients; there is no design-token file — colors are inline hex literals.
- Components use `prop-types`, not TypeScript (despite `@types/react` being installed).
