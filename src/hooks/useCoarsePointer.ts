import { useSyncExternalStore } from 'react'

const QUERY = '(pointer: coarse)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/**
 * Whether the main pointer is a finger: phones and tablets get the on-screen keyboard, which
 * never pops the OS keyboard over the grid. `false` on the server, so the first paint matches.
 */
export const useCoarsePointer = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
