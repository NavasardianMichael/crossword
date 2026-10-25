import { describe, expect, it } from 'vitest'
import { WORDS } from './fixtures'
import { type Layout, layoutPuzzle, type LayoutWord } from '../../../server/src/lib/layout/index.js'
import { GRID_SPECS, type PuzzleFormat, type PuzzleSize } from '../../../server/src/lib/puzzle.js'

/**
 * Invariants of every finished grid, fuzzed over many seeds. A grid that breaks one of these
 * shows the player a word nobody wrote a clue for, or a clue with nowhere to go.
 */
const words: LayoutWord[] = WORDS.map((word, index) => ({ cells: [...word], theme: index % 3 === 0 }))

/** Every maximal run of 2+ letters, as "row,col,dir,length". */
const runs = (layout: Layout): string[] => {
  const isLetter = (row: number, col: number) =>
    row >= 0 && col >= 0 && row < layout.height && col < layout.width && layout.cells[row * layout.width + col]!.k === 'L'
  const found: string[] = []
  for (let row = 0; row < layout.height; row++) {
    for (let col = 0; col < layout.width; col++) {
      if (!isLetter(row, col)) continue
      for (const [dir, dr, dc] of [
        ['across', 0, 1],
        ['down', 1, 0],
      ] as const) {
        if (isLetter(row - dr, col - dc)) continue
        let length = 1
        while (isLetter(row + dr * length, col + dc * length)) length++
        if (length >= 2) found.push(`${row},${col},${dir},${length}`)
      }
    }
  }
  return found.sort()
}

const isConnected = (layout: Layout): boolean => {
  const letters = layout.cells.flatMap((cell, index) => (cell.k === 'L' ? [index] : []))
  const seen = new Set([letters[0]])
  const queue = [letters[0]!]
  while (queue.length) {
    const cell = queue.pop()!
    const row = Math.floor(cell / layout.width)
    const col = cell % layout.width
    for (const [r, c] of [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ] as const) {
      const next = r * layout.width + c
      if (r < 0 || c < 0 || r >= layout.height || c >= layout.width || seen.has(next)) continue
      if (layout.cells[next]!.k !== 'L') continue
      seen.add(next)
      queue.push(next)
    }
  }
  return seen.size === letters.length
}

const SEEDS = Array.from({ length: 60 }, (_, index) => index * 101 + 7)
const CASES: [PuzzleFormat, PuzzleSize][] = [
  ['classic', 'small'],
  ['classic', 'medium'],
  ['classic', 'large'],
  ['scanword', 'small'],
  ['scanword', 'medium'],
  ['scanword', 'large'],
]

describe.each(CASES)('%s %s layout', (format, size) => {
  const spec = GRID_SPECS[format][size]
  const layouts = SEEDS.map((seed) => layoutPuzzle(format, words, spec, { seed, maxAttempts: 8 }))

  it('lays out a puzzle for every seed', () => {
    expect(layouts.filter((layout) => !layout).length).toBe(0)
  })

  it('places between minWords and maxWords, each word once and spelled from its candidate', () => {
    for (const layout of layouts) {
      if (!layout) continue
      expect(layout.words.length).toBeGreaterThanOrEqual(spec.minWords)
      expect(layout.words.length).toBeLessThanOrEqual(spec.maxWords)
      expect(new Set(layout.words.map(({ word }) => word)).size).toBe(layout.words.length)
      for (const { word, dir, row, col, length } of layout.words) {
        const cells = Array.from(
          { length },
          (_, k) => layout.solution[(row + (dir === 'down' ? k : 0)) * layout.width + col + (dir === 'across' ? k : 0)]
        )
        expect(cells).toEqual(words[word]!.cells)
      }
    }
  })

  it('has no letter run that is not a placed word', () => {
    for (const layout of layouts) {
      if (!layout) continue
      const placed = layout.words.map(({ row, col, dir, length }) => `${row},${col},${dir},${length}`).sort()
      expect(runs(layout)).toEqual(placed)
    }
  })

  it('is one connected grid', () => {
    for (const layout of layouts) if (layout) expect(isConnected(layout)).toBe(true)
  })

  it('never places two words of one stem', () => {
    for (const layout of layouts) {
      if (!layout) continue
      const placed = layout.words.map(({ word }) => WORDS[word]!)
      for (const a of placed) for (const b of placed) if (a !== b) expect(b.startsWith(a)).toBe(false)
    }
  })

  it('is reproducible from its seed', () => {
    expect(layoutPuzzle(format, words, spec, { seed: 42, maxAttempts: 8 })).toEqual(
      layoutPuzzle(format, words, spec, { seed: 42, maxAttempts: 8 })
    )
  })

  if (format === 'classic') {
    it('numbers words in reading order', () => {
      for (const layout of layouts) {
        if (!layout) continue
        const starts = layout.words.map(({ row, col, number }) => ({ cell: row * layout.width + col, number: number! }))
        for (const a of starts) for (const b of starts) if (a.cell < b.cell) expect(a.number).toBeLessThan(b.number)
      }
    })
  } else {
    it('gives every word one clue cell beside its first letter, and at most two clues per cell', () => {
      for (const layout of layouts) {
        if (!layout) continue
        layout.words.forEach(({ row, col, dir, clueCell, arrow }, id) => {
          const cell = layout.cells[clueCell!]!
          expect(cell.k === 'C' && cell.clues.includes(id)).toBe(true)
          const expected = {
            right: [row, col - 1, 'across'],
            downRight: [row - 1, col, 'across'],
            down: [row - 1, col, 'down'],
            rightDown: [row, col - 1, 'down'],
          }[arrow!]
          expect([Math.floor(clueCell! / layout.width), clueCell! % layout.width, dir]).toEqual(expected)
        })
        for (const cell of layout.cells) if (cell.k === 'C') expect(cell.clues.length).toBeLessThanOrEqual(2)
      }
    })

    it('fills most of its rectangle', () => {
      const densities = layouts.flatMap((layout) =>
        layout ? [layout.cells.filter((cell) => cell.k !== 'B').length / layout.cells.length] : []
      )
      const average = densities.reduce((sum, density) => sum + density, 0) / densities.length
      console.info(`${format} ${size}: average fill ${(average * 100).toFixed(0)}%`)
      expect(average).toBeGreaterThan(0.5)
    })
  }
})
