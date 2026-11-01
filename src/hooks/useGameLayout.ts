import { useSyncExternalStore } from 'react'

/** globals.css's `game` and `game-page` variants (which hide the site's header and footer) use the same query, on screen. */
const QUERY = '(width < 64rem), (pointer: coarse)'

// While printing, the page is measured as paper: the screen's answer is kept, so the board (and
// the print sheet it owns) is not rebuilt in the other layout mid-print.
let onScreen = false
const read = () => {
  if (!window.matchMedia('print').matches) onScreen = window.matchMedia(QUERY).matches
  return onScreen
}

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
