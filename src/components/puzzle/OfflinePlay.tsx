'use client'

import { useSyncExternalStore } from 'react'
import { MissingPuzzle } from './MissingPuzzle'
import { PuzzleBoard } from './PuzzleBoard'

const ID_PATTERN = /^[0-9A-Za-z]{10}$/

// The id is read from the URL in the browser: the page is static, the same HTML for every puzzle.
const readId = (): string | null => {
  const id = new URLSearchParams(window.location.search).get('id')
  return id && ID_PATTERN.test(id) ? id : null
}

const noop = () => () => undefined

const noId = () => false
const hasNoId = () => readId() === null

/** The play shell's board: the puzzle comes from the device only. No usable `?id=`: the ways on. */
export const OfflinePlay = () => {
  const id = useSyncExternalStore(noop, readId, () => null)
  // Read apart from the id, so the server render (no id yet) shows nothing rather than "missing".
  const missing = useSyncExternalStore(noop, hasNoId, noId)
  if (id) return <PuzzleBoard key={id} id={id} initial={null} />
  return missing ? <MissingPuzzle /> : null
}
