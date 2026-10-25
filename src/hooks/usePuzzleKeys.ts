import { type KeyboardEvent, useCallback } from 'react'
import { usePlayStoreBase } from '@store/puzzle/play/store'
import { KEY_CODE_LETTERS } from '@constants/keyboards'
import type { ArrowKey } from '@helpers/puzzle/cursor'

const ARROWS: Record<string, ArrowKey> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }

/**
 * The grid's keyboard, attached to the focused cell:
 * - letters type (the key's own character first, then — for a player still on an English OS
 *   layout — the letter at that key's position on the puzzle language's layout);
 * - arrows move or turn, Space turns, Enter / Shift+Enter jump between words;
 * - Backspace steps back, Delete clears, Home / End jump within the word;
 * - Tab is left alone, so the grid is one tab stop and never a keyboard trap.
 * Shortcuts with Ctrl / ⌘ / Alt pass through (AltGr, which some layouts type letters with, does not).
 */
export const usePuzzleKeys = () =>
  useCallback((event: KeyboardEvent<HTMLElement>) => {
    const native = event.nativeEvent
    if (native.isComposing) return
    const altGraph = event.getModifierState?.('AltGraph')
    if (event.ctrlKey || event.metaKey || (event.altKey && !altGraph)) return

    const play = usePlayStoreBase.getState()
    const arrow = ARROWS[event.key]
    let handled = true

    if (arrow) play.move(arrow)
    else if (event.key === ' ') play.toggleDirection()
    else if (event.key === 'Enter') play.nextWord(event.shiftKey)
    else if (event.key === 'Backspace') play.erase()
    else if (event.key === 'Delete') play.deleteCell()
    else if (event.key === 'Home') play.jumpToEdge(false)
    else if (event.key === 'End') play.jumpToEdge(true)
    else if ([...event.key].length === 1) {
      const locale = play.puzzle?.locale
      const byPosition = locale ? KEY_CODE_LETTERS[locale]?.[event.code] : undefined
      handled = play.type(event.key) || (byPosition !== undefined && play.type(byPosition))
    } else handled = false

    if (handled) event.preventDefault()
  }, [])
