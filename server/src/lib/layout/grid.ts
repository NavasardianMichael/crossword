import type { Arrow, Direction } from '../puzzle.js'

/**
 * The working grid both layouts place words into.
 *
 * The one rule everything else rests on: **every run of two or more letters is exactly one
 * placed word.** `check` enforces it — a new word may only touch the grid where it crosses
 * another word, and never extends, overlaps or sits flush alongside one — so the finished grid
 * never contains an accidental word nobody wrote a clue for.
 */
export const EMPTY = 0
export const LETTER = 1
/** A scanword clue cell, holding up to two clues. */
export const CLUE = 2
export const BLOCK = 3

/** A candidate word, as tokens (`toCells`). `theme` words are from the requested topic. */
export type LayoutWord = { cells: readonly string[]; theme: boolean }

/**
 * Where a scanword word's clue sits: `R` slots point at the cell to the right of the clue
 * cell, `D` slots at the cell below. A clue cell holds at most one of each.
 */
export type ClueSlot = { cell: number; slot: 'R' | 'D'; arrow: Arrow }

export type Placement = {
  /** Index into the candidate list. */
  word: number
  row: number
  col: number
  dir: Direction
  length: number
  clue?: ClueSlot
}

export const step = (dir: Direction): [number, number] => (dir === 'across' ? [0, 1] : [1, 0])

export class Grid {
  readonly kind: Uint8Array
  readonly letters: (string | null)[]
  /** Placement index running across / down through each cell, -1 when none. */
  readonly across: Int32Array
  readonly down: Int32Array
  readonly slots = new Map<number, { R?: number; D?: number }>()
  /** Letter cells per token, for finding crossings. Append-only: letters are never removed. */
  readonly byLetter = new Map<string, number[]>()
  readonly placements: Placement[] = []
  crossings = 0
  letterCount = 0

  constructor(
    readonly width: number,
    readonly height: number
  ) {
    const size = width * height
    this.kind = new Uint8Array(size)
    this.letters = new Array<string | null>(size).fill(null)
    this.across = new Int32Array(size).fill(-1)
    this.down = new Int32Array(size).fill(-1)
  }

  inBounds(row: number, col: number): boolean {
    return row >= 0 && col >= 0 && row < this.height && col < this.width
  }

  at(row: number, col: number): number {
    return row * this.width + col
  }

  isLetter(row: number, col: number): boolean {
    return this.inBounds(row, col) && this.kind[this.at(row, col)] === LETTER
  }

  /**
   * How many existing letters the word would cross at this position, or `null` when it cannot
   * go there: out of bounds, extending or overlapping another word, a letter mismatch, or a
   * new letter flush against a parallel word.
   */
  check(cells: readonly string[], row: number, col: number, dir: Direction): number | null {
    const [dr, dc] = step(dir)
    const length = cells.length
    const endRow = row + dr * (length - 1)
    const endCol = col + dc * (length - 1)
    if (!this.inBounds(row, col) || !this.inBounds(endRow, endCol)) return null
    if (this.isLetter(row - dr, col - dc) || this.isLetter(endRow + dr, endCol + dc)) return null

    const owners = dir === 'across' ? this.across : this.down
    let crossings = 0
    for (let k = 0; k < length; k++) {
      const r = row + dr * k
      const c = col + dc * k
      const index = this.at(r, c)
      const kind = this.kind[index]
      if (kind === LETTER) {
        if (this.letters[index] !== cells[k] || owners[index]! >= 0) return null
        crossings++
      } else if (kind !== EMPTY) {
        return null
      } else if (this.isLetter(r + dc, c + dr) || this.isLetter(r - dc, c - dr)) {
        return null
      }
    }
    return crossings
  }

  /** Whether a clue for a word can go in `slot` of `cell`. */
  canHoldClue(cell: number, slot: 'R' | 'D'): boolean {
    const kind = this.kind[cell]
    if (kind === EMPTY) return true
    return kind === CLUE && this.slots.get(cell)?.[slot] === undefined
  }

  place(word: number, cells: readonly string[], row: number, col: number, dir: Direction, clue?: ClueSlot): void {
    const [dr, dc] = step(dir)
    const placementIndex = this.placements.length
    const owners = dir === 'across' ? this.across : this.down

    for (let k = 0; k < cells.length; k++) {
      const index = this.at(row + dr * k, col + dc * k)
      if (this.kind[index] === LETTER) {
        this.crossings++
      } else {
        this.kind[index] = LETTER
        this.letters[index] = cells[k]!
        this.letterCount++
        const list = this.byLetter.get(cells[k]!)
        if (list) list.push(index)
        else this.byLetter.set(cells[k]!, [index])
      }
      owners[index] = placementIndex
    }

    if (clue) {
      this.kind[clue.cell] = CLUE
      const slots = this.slots.get(clue.cell) ?? {}
      slots[clue.slot] = placementIndex
      this.slots.set(clue.cell, slots)
    }

    this.placements.push({ word, row, col, dir, length: cells.length, clue })
  }
}

/** Shortest shared prefix that makes two words the same stem: `лес` / `лесник`, `water` / `waterfall`. */
export const minStem = (length: number): number => (length <= 4 ? length : Math.max(4, Math.ceil(length * 0.6)))

const commonPrefix = (a: readonly string[], b: readonly string[]): number => {
  let k = 0
  while (k < a.length && k < b.length && a[k] === b[k]) k++
  return k
}

/** Pairs of candidates that must not appear in one puzzle: same root, so one would give the other away. */
export const stemSiblings = (words: readonly LayoutWord[]): number[][] => {
  const siblings: number[][] = words.map(() => [])
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const a = words[i]!.cells
      const b = words[j]!.cells
      if (commonPrefix(a, b) >= minStem(Math.min(a.length, b.length))) {
        siblings[i]!.push(j)
        siblings[j]!.push(i)
      }
    }
  }
  return siblings
}
