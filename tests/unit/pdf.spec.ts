import { readFileSync } from 'node:fs'
import path from 'node:path'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import type { PuzzleView } from '@constants/puzzle'
import { buildPuzzlePdf, needsArmenian, type PdfFonts, type PdfLabels, wrapText } from '@helpers/puzzle/pdf'

const font = (name: string) => {
  const bytes = readFileSync(path.resolve('public/fonts/pdf', `${name}.ttf`))
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

const FONTS: PdfFonts = {
  display: font('rubik-bold'),
  body: font('nunito-regular'),
  bodyBold: font('nunito-bold'),
  armenian: font('noto-sans-armenian-regular'),
  armenianBold: font('noto-sans-armenian-bold'),
}

const LABELS: PdfLabels = {
  title: 'Crossword',
  subtitle: 'Animals · Easy',
  brand: 'Crossword AI',
  across: 'Across',
  down: 'Down',
  answers: 'Answers',
  playOnline: 'Play it online: https://example.com/en/p/abcdefghij',
}

/** C A T / O · · / W · · */
const classic: PuzzleView = {
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

/**
 * ▸ Տ ՈՒ Ն        a one-clue cell, and a two-clue cell whose second clue bends down-then-right
 * ▸ Ձ ՈՒ Կ
 * և Ա Ն Ի
 */
const scanword: PuzzleView = {
  id: 'klmnopqrst',
  locale: 'hy',
  format: 'scanword',
  topic: 'home',
  difficulty: 2,
  width: 4,
  height: 3,
  cells: [{ k: 'C', clues: [0] }, { k: 'L' }, { k: 'L' }, { k: 'L' }, { k: 'C', clues: [1, 2] }, { k: 'L' }, { k: 'L' }, { k: 'L' }, { k: 'L' }, { k: 'L' }, { k: 'L' }, { k: 'L' }],
  words: [
    { id: 0, dir: 'across', row: 0, col: 1, length: 3, clue: 'Բնակարան', clueCell: 0, arrow: 'right', entryId: 20 },
    { id: 1, dir: 'across', row: 1, col: 1, length: 3, clue: 'Ջրային կենդանի', clueCell: 4, arrow: 'right', entryId: 21 },
    { id: 2, dir: 'across', row: 2, col: 0, length: 4, clue: 'Դիմացկունություն', clueCell: 4, arrow: 'downRight', entryId: 22 },
  ],
  solution: ['', 'տ', 'ու', 'ն', '', 'ձ', 'ու', 'կ', 'և', 'ա', 'ն', 'ի'],
  createdAt: '2026-10-25T00:00:00.000Z',
}

const pages = async (bytes: Uint8Array) => (await PDFDocument.load(bytes)).getPageCount()

describe('puzzle PDF', () => {
  it('lays out a crossword with its clue lists, and an answer key on a second page', async () => {
    const bytes = await buildPuzzlePdf({ puzzle: classic, labels: LABELS, answers: true, pageSize: 'letter' }, FONTS)
    expect(await pages(bytes)).toBe(2)
    const doc = await PDFDocument.load(bytes)
    expect(doc.getTitle()).toBe('Crossword — Animals · Easy')
    expect(doc.getPage(0).getSize()).toEqual({ width: 612, height: 792 })
  })

  it('draws an Armenian scanword, with the player letters, on one A4 page', async () => {
    const labels = { ...LABELS, title: 'Սկանվորդ', brand: 'Խաչբառ AI' }
    const letters = ['', 'տ', 'ու', '', '', '', '', '', 'և', '', '', '']
    const bytes = await buildPuzzlePdf({ puzzle: scanword, labels, letters, answers: false, pageSize: 'a4' }, FONTS)
    expect(await pages(bytes)).toBe(1)
  })

  it('loads the Armenian faces only when some text is Armenian', () => {
    expect(needsArmenian({ puzzle: classic, labels: LABELS })).toBe(false)
    expect(needsArmenian({ puzzle: classic, labels: { ...LABELS, brand: 'Խաչբառ AI' } })).toBe(true)
    expect(needsArmenian({ puzzle: scanword, labels: LABELS })).toBe(true)
  })

  it('refuses to build without its fonts', async () => {
    await expect(buildPuzzlePdf({ puzzle: classic, labels: LABELS, answers: false, pageSize: 'a4' }, {})).rejects.toThrow()
  })
})

describe('wrapText', () => {
  const measure = (line: string) => line.length

  it('wraps on spaces', () => {
    expect(wrapText('one two three', measure, 8)).toEqual(['one two', 'three'])
  })

  it('breaks a word longer than the line by letters, with a hyphen', () => {
    expect(wrapText('abcdefghij', measure, 4)).toEqual(['abc-', 'def-', 'ghij'])
  })
})
