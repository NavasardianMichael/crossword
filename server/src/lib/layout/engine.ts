import { type ClueSlot, Grid, type LayoutWord, stemSiblings } from './grid.js'
import { createRandom, type Random, weightedOrder } from './rng.js'
import type { Direction, GridSpec } from '../puzzle.js'

/**
 * Greedy multi-start placement, shared by both formats.
 *
 * Each attempt shuffles the candidates (longer and on-topic words tend to come first), seeds
 * the grid with one word, then repeatedly places the best-scoring crossing move until nothing
 * fits or the word limit is reached. A little randomness in the pick keeps attempts apart; the
 * best attempt wins. A format only supplies how to seed, how to score a move (and, for
 * scanwords, where its clue goes) and how to score a finished grid.
 */
export type Move = { word: number; row: number; col: number; dir: Direction; score: number; clue?: ClueSlot }

export type Strategy = {
  /** Places the first word; returns its index, or -1 when no candidate fits. */
  seed: (grid: Grid, words: readonly LayoutWord[], order: readonly number[], random: Random) => number
  /** Scores a legal crossing move, or rejects it. */
  evaluate: (
    grid: Grid,
    word: LayoutWord,
    row: number,
    col: number,
    dir: Direction,
    crossings: number,
    random: Random
  ) => { score: number; clue?: ClueSlot } | null
  /** Scores a finished attempt; the highest wins. */
  score: (grid: Grid, words: readonly LayoutWord[]) => number
}

export type LayoutOptions = {
  seed: number
  /** Attempts are what tests pin, so a run is reproducible. */
  maxAttempts: number
  /** Epoch ms after which no new attempt starts (production budget). The first one always runs. */
  deadline?: number
}

/** Unused candidates looked at per step: enough for choice, bounded for time. */
const MAX_SCAN = 160
const PICK_WEIGHTS = [0.6, 0.3, 0.1]

const keepTop = (top: Move[], move: Move): void => {
  if (top.length === PICK_WEIGHTS.length && move.score <= top[top.length - 1]!.score) return
  top.push(move)
  top.sort((a, b) => b.score - a.score)
  if (top.length > PICK_WEIGHTS.length) top.pop()
}

const pick = (top: Move[], random: Random): Move => {
  const total = PICK_WEIGHTS.slice(0, top.length).reduce((sum, weight) => sum + weight, 0)
  let roll = random() * total
  for (let i = 0; i < top.length; i++) {
    roll -= PICK_WEIGHTS[i]!
    if (roll <= 0) return top[i]!
  }
  return top[0]!
}

const attempt = (
  words: readonly LayoutWord[],
  siblings: readonly number[][],
  spec: GridSpec,
  strategy: Strategy,
  random: Random
): Grid | null => {
  const grid = new Grid(spec.width, spec.height)
  const order = weightedOrder(
    words.map(({ cells, theme }) => cells.length * 2 + (theme ? 6 : 0)),
    random
  )
  const used = new Uint8Array(words.length)
  const markUsed = (index: number) => {
    used[index] = 1
    for (const sibling of siblings[index]!) used[sibling] = 1
  }

  const first = strategy.seed(grid, words, order, random)
  if (first < 0) return null
  markUsed(first)

  while (grid.placements.length < spec.maxWords) {
    const top: Move[] = []
    let scanned = 0

    for (const index of order) {
      if (used[index]) continue
      if (++scanned > MAX_SCAN) break
      const word = words[index]!
      const { cells } = word

      for (let i = 0; i < cells.length; i++) {
        const hits = grid.byLetter.get(cells[i]!)
        if (!hits) continue
        for (const cell of hits) {
          const dir: Direction | null = grid.across[cell]! < 0 ? 'across' : grid.down[cell]! < 0 ? 'down' : null
          if (!dir) continue
          const r = Math.floor(cell / grid.width)
          const c = cell % grid.width
          const row = dir === 'across' ? r : r - i
          const col = dir === 'across' ? c - i : c
          const crossings = grid.check(cells, row, col, dir)
          if (!crossings) continue
          const evaluated = strategy.evaluate(grid, word, row, col, dir, crossings, random)
          if (evaluated) keepTop(top, { word: index, row, col, dir, ...evaluated })
        }
      }
    }

    if (!top.length) break
    const move = pick(top, random)
    grid.place(move.word, words[move.word]!.cells, move.row, move.col, move.dir, move.clue)
    markUsed(move.word)
  }

  return grid.placements.length >= spec.minWords ? grid : null
}

export const runLayout = (
  words: readonly LayoutWord[],
  spec: GridSpec,
  strategy: Strategy,
  { seed, maxAttempts, deadline = Infinity }: LayoutOptions
): Grid | null => {
  const siblings = stemSiblings(words)
  let best: { grid: Grid; score: number } | null = null

  for (let i = 0; i < maxAttempts && (i === 0 || Date.now() < deadline); i++) {
    const grid = attempt(words, siblings, spec, strategy, createRandom(seed + i * 7919))
    if (!grid) continue
    const score = strategy.score(grid, words)
    if (!best || score > best.score) best = { grid, score }
  }

  return best?.grid ?? null
}
