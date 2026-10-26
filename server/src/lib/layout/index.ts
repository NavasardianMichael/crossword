import { classicStrategy } from './classic.js'
import { type LayoutOptions, runLayout } from './engine.js'
import { CLUE, type Grid, type LayoutWord,LETTER } from './grid.js'
import { scanwordStrategy } from './scanword.js'
import type { Arrow, CellView, Direction, GridSpec, PuzzleFormat } from '../puzzle.js'

export type { LayoutWord } from './grid.js'

/** Bump when a change would lay the same candidates out differently; stored on every puzzle. */
export const LAYOUT_VERSION = 1

/** Decorative tiles a scanword's empty cells cycle through (rendered by the web app). */
export const STICKER_COUNT = 6

export type LaidOutWord = {
  /** Index into the candidate list. */
  word: number
  dir: Direction
  row: number
  col: number
  length: number
  number?: number
  clueCell?: number
  arrow?: Arrow
}

/** A finished grid without clue texts: word `i` of `words` is the word with id `i`. */
export type Layout = {
  width: number
  height: number
  cells: CellView[]
  words: LaidOutWord[]
  solution: string[]
}

const finalizeClassic = (grid: Grid): Layout => {
  let minRow = grid.height
  let minCol = grid.width
  let maxRow = 0
  let maxCol = 0
  for (const { row, col, dir, length } of grid.placements) {
    minRow = Math.min(minRow, row)
    minCol = Math.min(minCol, col)
    maxRow = Math.max(maxRow, dir === 'down' ? row + length - 1 : row)
    maxCol = Math.max(maxCol, dir === 'across' ? col + length - 1 : col)
  }
  const width = maxCol - minCol + 1
  const height = maxRow - minRow + 1

  // Numbered in reading order; an across and a down word starting in one cell share a number.
  const placements = grid.placements
    .map((placement) => ({ ...placement, row: placement.row - minRow, col: placement.col - minCol }))
    .sort((a, b) => a.row * width + a.col - (b.row * width + b.col) || (a.dir === 'across' ? -1 : 1))
  const numbers = new Map<number, number>()
  for (const { row, col } of placements) {
    const cell = row * width + col
    if (!numbers.has(cell)) numbers.set(cell, numbers.size + 1)
  }

  const cells: CellView[] = []
  const solution: string[] = []
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const source = (row + minRow) * grid.width + col + minCol
      const isLetter = grid.kind[source] === LETTER
      const number = numbers.get(row * width + col)
      cells.push(isLetter ? (number ? { k: 'L', n: number } : { k: 'L' }) : { k: 'B' })
      solution.push(isLetter ? grid.letters[source]! : '')
    }
  }

  return {
    width,
    height,
    cells,
    solution,
    words: placements.map(({ word, dir, row, col, length }) => ({
      word,
      dir,
      row,
      col,
      length,
      number: numbers.get(row * width + col)!,
    })),
  }
}

const finalizeScanword = (grid: Grid, seed: number): Layout => {
  // Words in reading order of their clue cells, the right-pointing clue of a cell first.
  const order = grid.placements
    .map((placement, index) => ({ placement, index }))
    .sort(
      (a, b) =>
        a.placement.clue!.cell - b.placement.clue!.cell ||
        (a.placement.clue!.slot === 'R' ? -1 : 1) - (b.placement.clue!.slot === 'R' ? -1 : 1)
    )
  const idOf = new Map(order.map(({ index }, id) => [index, id]))

  const cells: CellView[] = []
  const solution: string[] = []
  for (let cell = 0; cell < grid.width * grid.height; cell++) {
    const kind = grid.kind[cell]
    if (kind === LETTER) {
      cells.push({ k: 'L' })
      solution.push(grid.letters[cell]!)
      continue
    }
    solution.push('')
    if (kind === CLUE) {
      const slots = grid.slots.get(cell)!
      const clues = [slots.R, slots.D].filter((slot): slot is number => slot !== undefined).map((slot) => idOf.get(slot)!)
      cells.push({ k: 'C', clues })
    } else {
      cells.push({ k: 'B', d: (cell * 7 + seed) % STICKER_COUNT })
    }
  }

  return {
    width: grid.width,
    height: grid.height,
    cells,
    solution,
    words: order.map(({ placement: { word, dir, row, col, length, clue } }) => ({
      word,
      dir,
      row,
      col,
      length,
      clueCell: clue!.cell,
      arrow: clue!.arrow,
    })),
  }
}

/** Lays the candidates out, or returns `null` when fewer than `spec.minWords` could be placed. */
export const layoutPuzzle = (
  format: PuzzleFormat,
  words: readonly LayoutWord[],
  spec: GridSpec,
  options: LayoutOptions
): Layout | null => {
  const grid = runLayout(words, spec, format === 'classic' ? classicStrategy : scanwordStrategy, options)
  if (!grid) return null
  return format === 'classic' ? finalizeClassic(grid) : finalizeScanword(grid, options.seed)
}
