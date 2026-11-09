import { useSyncExternalStore } from 'react'

/** globals.css's `game` and `game-page` variants (which hide the site's header and footer) use the same query, on screen. */
const QUERY = '(width < 64rem), (pointer: coarse)'

const read = () => window.matchMedia(QUERY).matches

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/**
 * Whether the board is played as a full-screen game — phones, tablets and narrow windows —
 * rather than as a desktop page. `false` on the server; the board only renders after mount.
 */
export const useGameLayout = (): boolean => useSyncExternalStore(subscribe, read, () => false)
