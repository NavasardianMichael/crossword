import type { Direction, PuzzleView } from '@constants/puzzle'
import { isLetterCell, type PuzzleModel } from './model'

/**
 * Where typing goes: a letter cell and a direction. Pure functions of the puzzle, so the
 * keyboard rules are unit-tested rather than discovered by hand.
 */
export type Cursor = { cell: number; dir: Direction }

export type ArrowKey = 'up' | 'down' | 'left' | 'right'

const other = (dir: Direction): Direction => (dir === 'across' ? 'down' : 'across')

const wordIn = (model: PuzzleModel, cell: number, dir: Direction): number =>
  (dir === 'across' ? model.across : model.down)[cell] ?? -1

/** The word under the cursor; a cell with a word in only one direction answers that one. */
export const activeWord = (model: PuzzleModel, cursor: Cursor): number => {
  const word = wordIn(model, cursor.cell, cursor.dir)
  return word >= 0 ? word : wordIn(model, cursor.cell, other(cursor.dir))
}

/** The cursor's direction, corrected to one the cell actually has a word in. */
export const normalize = (model: PuzzleModel, cursor: Cursor): Cursor =>
  wordIn(model, cursor.cell, cursor.dir) >= 0 ? cursor : { ...cursor, dir: other(cursor.dir) }

export const startOfWord = (puzzle: PuzzleView, model: PuzzleModel, word: number): Cursor => ({
  cell: model.wordCells[word]![0]!,
  dir: puzzle.words[word]!.dir,
})

/** The first empty cell of a word, or its first cell when it is full. */
export const firstEmptyOfWord = (puzzle: PuzzleView, model: PuzzleModel, entries: readonly string[], word: number): Cursor => {
  const cells = model.wordCells[word]!
  return { cell: cells.find((cell) => !entries[cell]) ?? cells[0]!, dir: puzzle.words[word]!.dir }
}

export const initialCursor = (puzzle: PuzzleView, model: PuzzleModel): Cursor => startOfWord(puzzle, model, 0)

/** A tap on a cell: the same cell again flips direction (where it can); a new one keeps it if possible. */
export const selectCell = (model: PuzzleModel, cursor: Cursor, cell: number): Cursor => {
  if (cell === cursor.cell) {
    const flipped = other(cursor.dir)
    return wordIn(model, cell, flipped) >= 0 ? { cell, dir: flipped } : cursor
  }
  return normalize(model, { cell, dir: cursor.dir })
}

export const toggleDirection = (model: PuzzleModel, cursor: Cursor): Cursor => selectCell(model, cursor, cursor.cell)

/**
 * After a letter: the next cell of the word — the next *empty* one when `skipFilled` — and,
 * once the word is full, the first empty cell of the next unfinished word. At the very end
 * the cursor stays put.
 */
export const afterType = (
  puzzle: PuzzleView,
  model: PuzzleModel,
  entries: readonly string[],
  cursor: Cursor,
  skipFilled: boolean
): Cursor => {
  const word = activeWord(model, cursor)
  const cells = model.wordCells[word]!
  const index = cells.indexOf(cursor.cell)
  const rest = cells.slice(index + 1)
  const next = skipFilled ? (rest.find((cell) => !entries[cell]) ?? cells.find((cell) => !entries[cell])) : rest[0]
  if (next !== undefined) return { cell: next, dir: puzzle.words[word]!.dir }
  if (cells.some((cell) => !entries[cell])) return cursor
  return nextWord(puzzle, model, entries, cursor, false, true)
}

/** Backspace on an empty cell: one cell back within the word, staying at its start. */
export const previousInWord = (puzzle: PuzzleView, model: PuzzleModel, cursor: Cursor): Cursor => {
  const word = activeWord(model, cursor)
  const cells = model.wordCells[word]!
  const index = cells.indexOf(cursor.cell)
  return index > 0 ? { cell: cells[index - 1]!, dir: puzzle.words[word]!.dir } : cursor
}

export const edgeOfWord = (puzzle: PuzzleView, model: PuzzleModel, cursor: Cursor, end: boolean): Cursor => {
  const word = activeWord(model, cursor)
  const cells = model.wordCells[word]!
  return { cell: end ? cells[cells.length - 1]! : cells[0]!, dir: puzzle.words[word]!.dir }
}

/**
 * An arrow key. One across the current direction first turns the cursor (where the cell has a
 * word that way), as in most crossword apps; otherwise it moves to the next letter cell in
 * that direction, jumping over blocks and clue cells.
 */
export const moveCursor = (puzzle: PuzzleView, model: PuzzleModel, cursor: Cursor, key: ArrowKey): Cursor => {
  const dir: Direction = key === 'left' || key === 'right' ? 'across' : 'down'
  if (dir !== cursor.dir && wordIn(model, cursor.cell, dir) >= 0) return { ...cursor, dir }

  const [dr, dc] = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }[key]
  let row = Math.floor(cursor.cell / puzzle.width) + dr!
  let col = (cursor.cell % puzzle.width) + dc!
  while (row >= 0 && col >= 0 && row < puzzle.height && col < puzzle.width) {
    const cell = row * puzzle.width + col
    if (isLetterCell(puzzle, cell)) return normalize(model, { cell, dir })
    row += dr!
    col += dc!
  }
  return cursor
}

/**
 * Enter / Tab-style jump to the next (or previous) word in clue order, landing on its first
 * empty cell. `unfinishedOnly` skips words already full; with none left it stays.
 */
export const nextWord = (
  puzzle: PuzzleView,
  model: PuzzleModel,
  entries: readonly string[],
  cursor: Cursor,
  back = false,
  unfinishedOnly = false
): Cursor => {
  const count = puzzle.words.length
  const current = activeWord(model, cursor)
  for (let step = 1; step <= count; step++) {
    const word = (current + (back ? -step : step) + count * 2) % count
    const full = model.wordCells[word]!.every((cell) => entries[cell])
    if (!unfinishedOnly || !full) return firstEmptyOfWord(puzzle, model, entries, word)
  }
  return cursor
}
