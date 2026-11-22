import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { inflateSync } from 'node:zlib'
import { PDFArray, PDFDocument, PDFName, PDFRawStream } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import type { PuzzleView } from '@constants/puzzle'
import { buildPuzzlePdf, PDF_FONT_NAMES, type PdfFonts, type PdfLabels, pdfScripts, wrapText } from '@helpers/puzzle/pdf'
import { PDF_SCRIPTS, type PdfScript } from '@helpers/puzzle/pdfText'

const font = (name: string) => {
  const bytes = readFileSync(path.resolve('public/fonts/pdf', `${name}.ttf`))
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

const CJK = new Set<PdfScript>(['sc', 'jp', 'kr'])

/** The base three, and the pairs of the scripts asked for. */
const fontsFor = (scripts: readonly PdfScript[]): PdfFonts => ({
  display: font('rubik-bold'),
  body: font('nunito-regular'),
  bodyBold: font('nunito-bold'),
  scripts: Object.fromEntries(
    scripts.map((script) => {
      if (CJK.has(script)) {
        const medium = font(`noto-sans-${script}-medium`)
        return [script, { regular: medium, bold: medium }]
      }
      return [script, { regular: font(`noto-sans-${script}-regular`), bold: font(`noto-sans-${script}-bold`) }]
    })
  ),
})

const FONTS = fontsFor(['armenian'])

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

/** Content streams are compressed; inflate each page so a watermark can be counted. */
const pageSources = (doc: PDFDocument): string[] =>
  doc.getPages().map((page) => {
    const contents = page.node.lookup(PDFName.of('Contents'))
    const items = contents instanceof PDFArray ? contents.asArray() : [contents]
    return items
      .map((item) => {
        const stream = page.doc.context.lookup(item)
        if (!(stream instanceof PDFRawStream)) return ''
        try {
          return inflateSync(stream.contents).toString('latin1')
        } catch {
          return Buffer.from(stream.contents).toString('latin1')
        }
      })
      .join('\n')
  })

describe('puzzle PDF', () => {
  it('lays out a crossword with its clue lists, and an answer key on a second page', async () => {
    const bytes = await buildPuzzlePdf({ puzzle: classic, labels: LABELS, answers: true, pageSize: 'letter' }, FONTS)
    expect(await pages(bytes)).toBe(2)
    const doc = await PDFDocument.load(bytes)
    expect(doc.getTitle()).toBe('Crossword — Animals · Easy')
    expect(doc.getPage(0).getSize()).toEqual({ width: 612, height: 792 })
    // The play-online line sits in the bottom-right corner of every page. Text is stored as
    // glyph ids, so the corner is the shared text matrix: x in the right half, y on the margin.
    const corners = pageSources(doc).map((source) => source.match(/1 0 0 1 ([\d.]+) 34\.01574803149606 Tm/))
    expect(corners).toHaveLength(2)
    expect(corners.every((match) => match !== null && Number(match[1]) > 612 / 2)).toBe(true)
  })

  it('draws an Armenian scanword, with the player letters, on one A4 page', async () => {
    const labels = { ...LABELS, title: 'Սկանվորդ', brand: 'Խաչբառ AI' }
    const letters = ['', 'տ', 'ու', '', '', '', '', '', 'և', '', '', '']
    const bytes = await buildPuzzlePdf({ puzzle: scanword, labels, letters, answers: false, pageSize: 'a4' }, FONTS)
    expect(await pages(bytes)).toBe(1)
  })

  it('loads a script font only when some text is in that script', () => {
    expect(pdfScripts({ puzzle: classic, labels: LABELS })).toEqual([])
    expect(pdfScripts({ puzzle: classic, labels: { ...LABELS, brand: 'Խաչբառ AI' } })).toEqual(['armenian'])
    expect(pdfScripts({ puzzle: scanword, labels: LABELS })).toEqual(['armenian'])
  })

  it('has every font file a sheet may load', () => {
    for (const name of PDF_FONT_NAMES) expect(existsSync(path.resolve('public/fonts/pdf', `${name}.ttf`)), name).toBe(true)
  })

  /** A 3×3 crossword in a language: CAT across and COW down, in its own words. */
  const crosswordIn = (locale: PuzzleView['locale'], across: [string, string, string], down: [string, string], clues: [string, string]): PuzzleView => ({
    ...classic,
    locale,
    words: [
      { ...classic.words[0]!, clue: clues[0] },
      { ...classic.words[1]!, clue: clues[1] },
    ],
    solution: [...across, down[0], '', '', down[1], '', ''],
  })

  const SHEETS: [string, PuzzleView, Partial<PdfLabels>][] = [
    ['Arabic', crosswordIn('ar', ['ق', 'ط', 'ة'], ['ل', 'ب'], ['حيوان أليف يموء (3)', 'حيوان يعطي الحليب 12']), { title: 'كلمات متقاطعة', across: 'أفقي', down: 'عمودي' }],
    ['Persian', crosswordIn('fa', ['گ', 'ر', 'ب'], ['ا', 'و'], ['حیوان خانگی', 'جانور شیرده']), { title: 'جدول کلمات' }],
    ['Hebrew', crosswordIn('he', ['ח', 'ת', 'ו'], ['ל', 'ה'], ['חיית מחמד מגרגרת', 'נותנת חלב']), { title: 'תשבץ' }],
    ['Urdu', crosswordIn('ur', ['ب', 'ل', 'ی'], ['ا', 'ے'], ['پالتو جانور', 'دودھ دینے والا جانور']), { title: 'معمہ' }],
    ['Hindi', crosswordIn('hi', ['बि', 'ल्ली', 'क'], ['ग', 'य'], ['घर का पालतू जानवर', 'दूध देने वाला पशु']), { title: 'वर्ग पहेली' }],
    ['Marathi', crosswordIn('mr', ['मां', 'जर', 'क'], ['गा', 'य'], ['घरातील पाळीव प्राणी', 'दूध देणारा प्राणी']), { title: 'शब्दकोडे' }],
    ['Bengali', crosswordIn('bn', ['বি', 'ড়া', 'ল'], ['গ', 'রু'], ['পোষা প্রাণী', 'দুধ দেয় যে প্রাণী']), { title: 'শব্দজব্দ' }],
    ['Tamil', crosswordIn('ta', ['பூ', 'னை', 'க'], ['ப', 'சு'], ['வீட்டு விலங்கு', 'பால் தரும் விலங்கு']), { title: 'குறுக்கெழுத்து' }],
    ['Thai', crosswordIn('th', ['แ', 'ม', 'ว'], ['ว', 'ั'], ['สัตว์เลี้ยงที่ร้องเหมียว', 'สัตว์ที่ให้นม']), { title: 'ปริศนาอักษรไขว้' }],
    ['Greek', crosswordIn('el', ['γ', 'α', 'τ'], ['α', 'γ'], ['Κατοικίδιο που νιαουρίζει', 'Δίνει γάλα']), { title: 'Σταυρόλεξο' }],
    ['Chinese', crosswordIn('zh', ['小', '猫', '咪'], ['奶', '牛'], ['会喵喵叫的宠物', '产奶的动物（2）']), { title: '填字游戏' }],
    ['Japanese', crosswordIn('ja', ['ね', 'こ', 'や'], ['う', 'し'], ['ニャーと鳴く動物', '牛乳を出す動物']), { title: 'クロスワード' }],
    ['Korean', crosswordIn('ko', ['고', '양', '이'], ['소', '야'], ['야옹 하고 우는 동물', '우유를 주는 동물']), { title: '십자말풀이' }],
    ['Vietnamese', crosswordIn('vi', ['m', 'è', 'o'], ['ư', 'ơ'], ['Con vật kêu meo meo', 'Con vật cho sữa']), { title: 'Ô chữ' }],
  ]

  it.each(SHEETS)('draws a %s crossword with its answer key in its own script', async (_name, puzzle, overrides) => {
    const labels = { ...LABELS, ...overrides }
    const scripts = pdfScripts({ puzzle, labels })
    const bytes = await buildPuzzlePdf({ puzzle, labels, letters: puzzle.solution, answers: true, pageSize: 'a4' }, fontsFor(scripts))
    expect(await pages(bytes)).toBe(2)
  })

  it('finds the script of each of those languages', () => {
    const found = new Set(SHEETS.flatMap(([, puzzle, overrides]) => pdfScripts({ puzzle, labels: { ...LABELS, ...overrides } })))
    expect([...found].sort()).toEqual(PDF_SCRIPTS.filter((script) => script !== 'armenian').sort())
  })

  it('builds the colourful sheet and the black-and-white sheet', async () => {
    for (const appearance of ['colorful', 'mono'] as const) {
      const crossword = await buildPuzzlePdf({ puzzle: classic, labels: LABELS, answers: false, pageSize: 'a4', appearance }, FONTS)
      const scan = await buildPuzzlePdf({ puzzle: scanword, labels: LABELS, answers: false, pageSize: 'a4', appearance }, FONTS)
      expect(await pages(crossword)).toBe(1)
      expect(await pages(scan)).toBe(1)
    }
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
