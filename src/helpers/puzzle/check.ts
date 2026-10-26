import type { PuzzleView } from '@constants/puzzle'

/**
 * Per-cell marks, as bit flags so a cell can be both revealed and checked. The solution is on
 * the device (a casual game), so checking is instant and works offline.
 */
export const MARK_WRONG = 1
export const MARK_REVEALED = 2
/** Checked and right: locked, typing skips over it. */
export const MARK_LOCKED = 4

export const hasMark = (marks: readonly number[], cell: number, mark: number): boolean => ((marks[cell] ?? 0) & mark) !== 0

export const isSolved = (puzzle: PuzzleView, entries: readonly string[]): boolean =>
  puzzle.solution.every((token, cell) => !token || entries[cell] === token)

export const isWordFull = (entries: readonly string[], cells: readonly number[]): boolean => cells.every((cell) => entries[cell])

export const isWordCorrect = (puzzle: PuzzleView, entries: readonly string[], cells: readonly number[]): boolean =>
  cells.every((cell) => entries[cell] === puzzle.solution[cell])

/** Marks the filled cells among `cells`: wrong ones flagged, right ones locked. Returns how many were wrong. */
export const checkCells = (puzzle: PuzzleView, entries: readonly string[], marks: number[], cells: readonly number[]): number => {
  let wrong = 0
  for (const cell of cells) {
    if (!entries[cell]) continue
    if (entries[cell] === puzzle.solution[cell]) {
      marks[cell] = ((marks[cell] ?? 0) & ~MARK_WRONG) | MARK_LOCKED
    } else {
      marks[cell] = (marks[cell] ?? 0) | MARK_WRONG
      wrong++
    }
  }
  return wrong
}

/** Fills `cells` with the solution, flagged as revealed and locked. Returns how many changed. */
export const revealCells = (puzzle: PuzzleView, entries: string[], marks: number[], cells: readonly number[]): number => {
  let revealed = 0
  for (const cell of cells) {
    if (entries[cell] === puzzle.solution[cell] && hasMark(marks, cell, MARK_LOCKED)) continue
    if (entries[cell] !== puzzle.solution[cell]) revealed++
    entries[cell] = puzzle.solution[cell]!
    marks[cell] = MARK_REVEALED | MARK_LOCKED
  }
  return revealed
}

/** Every letter cell, for whole-puzzle checks. */
export const letterCells = (puzzle: PuzzleView): number[] =>
  puzzle.solution.flatMap((token, cell) => (token ? [cell] : []))
