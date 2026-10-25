import type { Strategy } from './engine.js'
import { CLUE, type ClueSlot, EMPTY, type Grid } from './grid.js'
import type { Direction } from '../puzzle.js'

/**
 * The scanword (сканворд, սկանվորդ): a fixed rectangle in which clues are printed in grid
 * cells, each with an arrow to its answer. A clue sits either in line before the answer, or —
 * where that cell is taken or off the grid — in the bent position (above an across answer,
 * left of a down answer). A clue cell holds at most two clues: one pointing right, one down.
 *
 * This is the free-form variant: words still only go where they cross another, and the cells
 * nothing reaches become decorative tiles. Moves are scored for crossings and length, for
 * sharing a clue cell (two clues in one cell is what makes a scanword dense), and for clue
 * cells on the top row and left column, where print scanwords keep most of theirs.
 */

/** Clue positions for a word starting at (row, col), in-line first. */
const clueOptions = (grid: Grid, row: number, col: number, dir: Direction): ClueSlot[] => {
  const options: ClueSlot[] = []
  const add = (r: number, c: number, slot: 'R' | 'D', arrow: ClueSlot['arrow']) => {
    if (grid.inBounds(r, c) && grid.canHoldClue(grid.at(r, c), slot)) options.push({ cell: grid.at(r, c), slot, arrow })
  }
  if (dir === 'across') {
    add(row, col - 1, 'R', 'right')
    add(row - 1, col, 'D', 'downRight')
  } else {
    add(row - 1, col, 'D', 'down')
    add(row, col - 1, 'R', 'rightDown')
  }
  return options
}

const clueScore = (grid: Grid, clue: ClueSlot): number => {
  const row = Math.floor(clue.cell / grid.width)
  const col = clue.cell % grid.width
  const shared = grid.kind[clue.cell] === CLUE ? 6 : 0
  const onEdge = row === 0 || col === 0 ? 3 : 0
  const newInterior = grid.kind[clue.cell] === EMPTY && !onEdge ? 2 : 0
  const bent = clue.arrow === 'downRight' || clue.arrow === 'rightDown' ? 1 : 0
  return shared + onEdge - newInterior - bent
}

const bestClue = (grid: Grid, row: number, col: number, dir: Direction): { clue: ClueSlot; score: number } | null => {
  let best: { clue: ClueSlot; score: number } | null = null
  for (const clue of clueOptions(grid, row, col, dir)) {
    const score = clueScore(grid, clue)
    if (!best || score > best.score) best = { clue, score }
  }
  return best
}

export const scanwordStrategy: Strategy = {
  // The top-left corner, like print: the first answer starts at (1, 1) with its clue beside or above it.
  seed: (grid, words, order, random) => {
    const across = random() < 0.5
    const room = (across ? grid.width : grid.height) - 1
    const first = order.find((index) => {
      const length = words[index]!.cells.length
      return length >= 4 && length <= room
    })
    if (first === undefined) return -1

    const dir: Direction = across ? 'across' : 'down'
    const clue = bestClue(grid, 1, 1, dir)
    if (!clue) return -1
    grid.place(first, words[first]!.cells, 1, 1, dir, clue.clue)
    return first
  },

  evaluate: (grid, word, row, col, dir, crossings, random) => {
    const clue = bestClue(grid, row, col, dir)
    if (!clue) return null
    const length = word.cells.length
    return {
      score: 10 * crossings + 1.8 * length + (word.theme ? 8 : 0) + clue.score + 2 * random(),
      clue: clue.clue,
    }
  },

  score: (grid, words) => {
    const clueCells = grid.slots.size
    const area = grid.width * grid.height
    const themed = grid.placements.filter(({ word }) => words[word]!.theme).length
    return 50 * ((grid.letterCount + clueCells) / area) + 2 * grid.placements.length + 2 * grid.crossings + 2 * themed
  },
}
