import type { PuzzleView } from '@constants/puzzle'
import type { Progress } from '@helpers/offline/db'
import type { ArrowKey, Cursor } from '@helpers/puzzle/cursor'
import type { PuzzleModel } from '@helpers/puzzle/model'

export type PlaySettings = {
  /** Mark a wrong letter as soon as it is typed. */
  autoCheck: boolean
  /** Typing jumps over cells that already hold a letter. */
  skipFilled: boolean
}

export type Scope = 'cell' | 'word' | 'puzzle'

/** What the live region says next; the component translates `key` under `Play.announce`. */
export type Announcement = { id: number; key: 'checked' | 'allCorrect' | 'revealed' | 'solved'; values?: Record<string, number | string> }

export type PlayState = {
  puzzle: PuzzleView | null
  model: PuzzleModel | null
  status: 'idle' | 'playing' | 'solved'
  /** Per cell: the typed token, '' when empty. */
  entries: string[]
  /** Per cell: `MARK_*` bit flags from `helpers/puzzle/check.ts`. */
  marks: number[]
  cursor: Cursor
  /** The cell the last letter went into, so Armenian `ւ` can complete the `ո` there. */
  lastTyped: number | null
  /** Play time banked so far; `resumedAt` is when the running stretch started (null while paused). */
  elapsedMs: number
  resumedAt: number | null
  checks: number
  reveals: number
  revealedWordIds: number[]
  /** The word just completed, for its little celebration; cleared on the next action. */
  completedWord: number | null
  announcement: Announcement | null
  settings: PlaySettings
}

export type PlayActions = {
  start: (puzzle: PuzzleView, progress?: Progress) => void
  /** A keystroke or on-screen key. Returns whether it was a letter of the puzzle's language. */
  type: (key: string) => boolean
  erase: () => void
  deleteCell: () => void
  move: (key: ArrowKey) => void
  select: (cell: number) => void
  selectWord: (wordId: number) => void
  toggleDirection: () => void
  nextWord: (back?: boolean) => void
  jumpToEdge: (end: boolean) => void
  check: (scope: Scope) => void
  reveal: (scope: Scope) => void
  clearWrong: () => void
  pause: () => void
  resume: () => void
  setSetting: <K extends keyof PlaySettings>(key: K, value: PlaySettings[K]) => void
  hydrateSettings: () => void
  /** Writes the progress now instead of after the debounce — on hide and unload. */
  flush: () => void
}
