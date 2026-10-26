import { describe, expect, it } from 'vitest'
import { ALPHABETS } from '@constants/alphabet'
import { KEY_CODE_LETTERS, KEYBOARD_ROWS } from '@constants/keyboards'
import { LOCALES, type PuzzleView } from '@constants/puzzle'
import { checkCells, isSolved, MARK_LOCKED, MARK_REVEALED, MARK_WRONG, revealCells } from '@helpers/puzzle/check'
import { activeWord, afterType, moveCursor, nextWord, previousInWord, selectCell } from '@helpers/puzzle/cursor'
import { buildModel } from '@helpers/puzzle/model'
import { mergeSeen } from '@helpers/puzzle/seen'

/**
 *   C A T
 *   O · ·
 *   W · ·
 */
const puzzle: PuzzleView = {
  id: 'abcdefghij',
  locale: 'en',
  format: 'classic',
  topic: 'animals',
  difficulty: 1,
  width: 3,
  height: 3,
  cells: [{ k: 'L', n: 1 }, { k: 'L' }, { k: 'L' }, { k: 'L' }, { k: 'B' }, { k: 'B' }, { k: 'L' }, { k: 'B' }, { k: 'B' }],
  words: [
    { id: 0, dir: 'across', row: 0, col: 0, length: 3, number: 1, clue: 'Purring pet', entryId: 10 },
    { id: 1, dir: 'down', row: 0, col: 0, length: 3, number: 1, clue: 'Dairy animal', entryId: 11 },
  ],
  solution: ['c', 'a', 't', 'o', '', '', 'w', '', ''],
  createdAt: '2026-10-25T00:00:00.000Z',
}
const model = buildModel(puzzle)
const empty = () => new Array<string>(9).fill('')

describe('model', () => {
  it('knows which words run through each cell', () => {
    expect(model.wordCells).toEqual([
      [0, 1, 2],
      [0, 3, 6],
    ])
    expect(model.across[0]).toBe(0)
    expect(model.down[0]).toBe(1)
    expect(model.down[1]).toBe(-1)
  })
})

describe('cursor', () => {
  it('turns on a second tap of a crossing cell, and keeps the direction a cell has', () => {
    const start = { cell: 0, dir: 'across' as const }
    expect(selectCell(model, start, 0)).toEqual({ cell: 0, dir: 'down' })
    expect(selectCell(model, start, 1)).toEqual({ cell: 1, dir: 'across' })
    expect(selectCell(model, start, 3)).toEqual({ cell: 3, dir: 'down' })
  })

  it('advances within the word, skipping filled cells, then moves to the next unfinished word', () => {
    const entries = empty()
    entries[0] = 'c'
    expect(afterType(puzzle, model, entries, { cell: 0, dir: 'across' }, true)).toEqual({ cell: 1, dir: 'across' })
    entries[1] = 'a'
    entries[2] = 't'
    expect(afterType(puzzle, model, entries, { cell: 2, dir: 'across' }, true)).toEqual({ cell: 3, dir: 'down' })
  })

  it('turns on a perpendicular arrow before it moves', () => {
    expect(moveCursor(puzzle, model, { cell: 0, dir: 'across' }, 'down')).toEqual({ cell: 0, dir: 'down' })
    expect(moveCursor(puzzle, model, { cell: 0, dir: 'down' }, 'down')).toEqual({ cell: 3, dir: 'down' })
    expect(moveCursor(puzzle, model, { cell: 2, dir: 'across' }, 'right')).toEqual({ cell: 2, dir: 'across' })
  })

  it('steps back within a word and stops at its start', () => {
    expect(previousInWord(puzzle, model, { cell: 2, dir: 'across' })).toEqual({ cell: 1, dir: 'across' })
    expect(previousInWord(puzzle, model, { cell: 0, dir: 'across' })).toEqual({ cell: 0, dir: 'across' })
  })

  it('jumps to the next word in clue order, wrapping round', () => {
    expect(nextWord(puzzle, model, empty(), { cell: 1, dir: 'across' })).toEqual({ cell: 0, dir: 'down' })
    expect(activeWord(model, nextWord(puzzle, model, empty(), { cell: 3, dir: 'down' }))).toBe(0)
  })
})

describe('check and reveal', () => {
  it('flags wrong letters, locks right ones, and ignores empty cells', () => {
    const entries = empty()
    entries[0] = 'c'
    entries[1] = 'x'
    const marks = new Array<number>(9).fill(0)
    expect(checkCells(puzzle, entries, marks, [0, 1, 2])).toBe(1)
    expect(marks[0]).toBe(MARK_LOCKED)
    expect(marks[1]).toBe(MARK_WRONG)
    expect(marks[2]).toBe(0)
  })

  it('reveals the solution and counts only cells that changed', () => {
    const entries = empty()
    entries[0] = 'c'
    const marks = new Array<number>(9).fill(0)
    expect(revealCells(puzzle, entries, marks, [0, 1, 2])).toBe(2)
    expect(entries.slice(0, 3)).toEqual(['c', 'a', 't'])
    expect(marks[1]).toBe(MARK_REVEALED | MARK_LOCKED)
  })

  it('is solved only when every letter matches', () => {
    expect(isSolved(puzzle, ['c', 'a', 't', 'o', '', '', 'w', '', ''])).toBe(true)
    expect(isSolved(puzzle, ['c', 'a', 't', 'o', '', '', '', '', ''])).toBe(false)
  })
})

describe('seen-list', () => {
  it('appends new ids last, moves repeats to the end, and keeps only the newest', () => {
    expect(mergeSeen([1, 2, 3], [2, 4])).toEqual([1, 3, 2, 4])
    expect(mergeSeen([1, 2, 3], [4, 5], 3)).toEqual([3, 4, 5])
  })
})

describe('keyboards', () => {
  it.each(LOCALES)('%s on-screen keyboard has exactly the alphabet', (locale) => {
    expect(KEYBOARD_ROWS[locale].flat().sort()).toEqual([...ALPHABETS[locale]].sort())
  })

  it('maps physical keys only to letters of the language (or Armenian ւ, which completes ու)', () => {
    for (const [locale, map] of Object.entries(KEY_CODE_LETTERS)) {
      for (const letter of Object.values(map)) {
        expect(ALPHABETS[locale as keyof typeof ALPHABETS].includes(letter) || letter === 'ւ').toBe(true)
      }
    }
  })
})
