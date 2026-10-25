import type { PuzzleView, WordView } from '@constants/puzzle'

/**
 * Lookups the board needs on every keystroke, built once per puzzle: which words run through
 * a cell, and which cells a word covers.
 */
export type PuzzleModel = {
  /** Per cell: the id of the word running across / down through it, -1 when none. */
  across: number[]
  down: number[]
  /** Per word id: its cells, first letter first. */
  wordCells: number[][]
}

export const cellsOfWord = (word: WordView, width: number): number[] =>
  Array.from({ length: word.length }, (_, k) =>
    word.dir === 'across' ? word.row * width + word.col + k : (word.row + k) * width + word.col
  )

export const buildModel = (puzzle: PuzzleView): PuzzleModel => {
  const size = puzzle.width * puzzle.height
  const across = new Array<number>(size).fill(-1)
  const down = new Array<number>(size).fill(-1)
  const wordCells = puzzle.words.map((word) => cellsOfWord(word, puzzle.width))

  puzzle.words.forEach((word, id) => {
    for (const cell of wordCells[id]!) (word.dir === 'across' ? across : down)[cell] = id
  })
  return { across, down, wordCells }
}

export const isLetterCell = (puzzle: PuzzleView, cell: number): boolean => puzzle.cells[cell]?.k === 'L'

/** Rows and columns are 1-based in everything a person reads. */
export const cellPosition = (cell: number, width: number) => ({ row: Math.floor(cell / width) + 1, col: (cell % width) + 1 })
