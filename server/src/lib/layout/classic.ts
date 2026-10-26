import type { Strategy } from './engine.js'
import { randomInt } from './rng.js'

/**
 * The classic free-form crossword: words cross like a newspaper puzzle, but the grid is not
 * filled edge to edge — it grows from a word in the middle and is cropped to what was placed.
 * Moves are scored for crossings (a well-knit grid), length, the topic, and staying central
 * (a compact, roughly square grid reads well on a phone).
 */
export const classicStrategy: Strategy = {
  seed: (grid, words, order, random) => {
    const fits = (min: number) =>
      order.find((index) => {
        const length = words[index]!.cells.length
        return length >= min && length <= grid.width
      }) ?? -1
    const first = fits(5) >= 0 ? fits(5) : fits(1)
    if (first < 0) return -1

    const { cells } = words[first]!
    const row = Math.min(grid.height - 1, Math.max(0, Math.floor(grid.height / 2) + randomInt(random, 3) - 1))
    const slack = grid.width - cells.length
    const col = Math.floor(slack / 2) + (slack > 1 ? randomInt(random, 3) - 1 : 0)
    grid.place(first, cells, row, Math.min(Math.max(col, 0), slack), 'across')
    return first
  },

  evaluate: (grid, word, row, col, dir, crossings, random) => {
    const length = word.cells.length
    const midRow = dir === 'across' ? row : row + (length - 1) / 2
    const midCol = dir === 'across' ? col + (length - 1) / 2 : col
    const distance = Math.hypot(midRow - (grid.height - 1) / 2, midCol - (grid.width - 1) / 2)
    return { score: 10 * crossings + 1.5 * length + (word.theme ? 8 : 0) - 0.3 * distance + 2 * random() }
  },

  score: (grid, words) => {
    let minRow = grid.height
    let maxRow = 0
    let minCol = grid.width
    let maxCol = 0
    for (const { row, col, dir, length } of grid.placements) {
      minRow = Math.min(minRow, row)
      minCol = Math.min(minCol, col)
      maxRow = Math.max(maxRow, dir === 'down' ? row + length - 1 : row)
      maxCol = Math.max(maxCol, dir === 'across' ? col + length - 1 : col)
    }
    const area = (maxRow - minRow + 1) * (maxCol - minCol + 1)
    const themed = grid.placements.filter(({ word }) => words[word]!.theme).length
    return 4 * grid.placements.length + 3 * grid.crossings + 40 * (grid.letterCount / area) + 3 * themed
  },
}
