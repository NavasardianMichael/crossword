'use client'

import { useSyncExternalStore } from 'react'
import { PuzzleBoard } from './PuzzleBoard'

const ID_PATTERN = /^[0-9A-Za-z]{10}$/

// The id is read from the URL in the browser: the page is static, the same HTML for every puzzle.
const readId = (): string | null => {
  const id = new URLSearchParams(window.location.search).get('id')
  return id && ID_PATTERN.test(id) ? id : null
}

const noop = () => () => undefined

/** The play shell's board: the puzzle comes from the device only. */
export const OfflinePlay = () => {
  const id = useSyncExternalStore(noop, readId, () => null)
  return id ? <PuzzleBoard key={id} id={id} initial={null} /> : null
}
