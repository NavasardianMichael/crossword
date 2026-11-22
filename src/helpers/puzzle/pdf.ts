import type { PDFFont, PDFPage } from 'pdf-lib'
import { getDirection } from '@i18n/config'
import { displayCell } from '@constants/alphabet'
import type { Arrow, Direction, Locale, PuzzleView } from '@constants/puzzle'
import { CORAL, INK, LAVENDER, MINT, PRINT, SKY, SUN, TEAL } from '@styles/tokens'
import { fontRuns, type PdfScript, type RunFace, scriptsIn, visualRuns } from './pdfText'

/**
 * The puzzle as a real, vector PDF, built in the browser — so it works offline, costs the
 * server nothing, and its text stays selectable. `pdf-lib` and the fonts load only when a
 * PDF is asked for.
 *
 * Laid out in top-down points (`Y` flips to PDF space at the last moment). A scanword clue
 * is fitted to its cell: the size steps down until every line fits.
 */
export type PdfLabels = {
  title: string
  /** Topic · difficulty. */
  subtitle: string
  brand: string
  across: string
  down: string
  answers: string
  /** "Play it online: <url>", already filled in. */
  playOnline: string
}

/** `default` is today's light-purple grid; `colorful` the on-screen crayons; `mono` true black and white. */
export const PDF_APPEARANCES = ['default', 'colorful', 'mono'] as const
export type PdfAppearance = (typeof PDF_APPEARANCES)[number]

export type PdfInput = {
  puzzle: PuzzleView
  labels: PdfLabels
  /** Letters to print in the grid (the player's), per cell. */
  letters?: string[]
  /** An answer key on a page of its own. */
  answers: boolean
  pageSize: 'a4' | 'letter'
  /** Omitted means `default`, so older callers keep the light-purple sheet. */
  appearance?: PdfAppearance
}

/** Scanword stickers, in the same order as the on-screen tiles. */
const STICKERS = [
  { fill: CORAL[100], mark: CORAL[300], block: CORAL[400] },
  { fill: TEAL[100], mark: TEAL[300], block: TEAL[400] },
  { fill: SUN[100], mark: SUN[300], block: SUN[400] },
  { fill: LAVENDER[100], mark: LAVENDER[300], block: LAVENDER[400] },
  { fill: MINT[100], mark: MINT[300], block: MINT[400] },
  { fill: SKY[100], mark: SKY[300], block: SKY[400] },
] as const

const sticker = (stamp: number) => STICKERS[Math.abs(stamp) % STICKERS.length]!

/**
 * Static TrueType instances (OFL), in `public/fonts/pdf/`: Rubik and Nunito for Latin and
 * Cyrillic, and a Noto Sans cut per other script (`scripts/pdf-fonts.py`). Chinese, Japanese and
 * Korean are megabytes each, so they come in one weight that serves every face.
 */
const BASE_FONT_FILES = { display: 'rubik-bold', body: 'nunito-regular', bodyBold: 'nunito-bold' } as const

const SCRIPT_FONT_FILES: Record<PdfScript, { regular: string; bold: string }> = {
  armenian: { regular: 'noto-sans-armenian-regular', bold: 'noto-sans-armenian-bold' },
  greek: { regular: 'noto-sans-greek-regular', bold: 'noto-sans-greek-bold' },
  arabic: { regular: 'noto-sans-arabic-regular', bold: 'noto-sans-arabic-bold' },
  hebrew: { regular: 'noto-sans-hebrew-regular', bold: 'noto-sans-hebrew-bold' },
  devanagari: { regular: 'noto-sans-devanagari-regular', bold: 'noto-sans-devanagari-bold' },
  bengali: { regular: 'noto-sans-bengali-regular', bold: 'noto-sans-bengali-bold' },
  tamil: { regular: 'noto-sans-tamil-regular', bold: 'noto-sans-tamil-bold' },
  thai: { regular: 'noto-sans-thai-regular', bold: 'noto-sans-thai-bold' },
  sc: { regular: 'noto-sans-sc-medium', bold: 'noto-sans-sc-medium' },
  jp: { regular: 'noto-sans-jp-medium', bold: 'noto-sans-jp-medium' },
  kr: { regular: 'noto-sans-kr-medium', bold: 'noto-sans-kr-medium' },
}

export const pdfFontUrl = (name: string): string => `/fonts/pdf/${name}.ttf`

/** Every font file a sheet may load, by name (`public/fonts/pdf/<name>.ttf`). */
export const PDF_FONT_NAMES: readonly string[] = [
  ...new Set([...Object.values(BASE_FONT_FILES), ...Object.values(SCRIPT_FONT_FILES).flatMap(({ regular, bold }) => [regular, bold])]),
]

export type PdfFonts = Partial<Record<keyof typeof BASE_FONT_FILES, ArrayBuffer>> & {
  scripts?: Partial<Record<PdfScript, { regular: ArrayBuffer; bold: ArrayBuffer }>>
}

/** The script fonts a sheet needs: its words', clues' and labels'. */
export const pdfScripts = (input: Pick<PdfInput, 'puzzle' | 'labels'>): PdfScript[] =>
  scriptsIn([...Object.values(input.labels), ...input.puzzle.words.map((word) => word.clue), ...input.puzzle.solution], input.puzzle.locale)

/** Fetches the faces a PDF needs: the base three, and a script's pair only when some text is in it. */
export const loadPdfFonts = async (scripts: readonly PdfScript[]): Promise<PdfFonts> => {
  const fetchFont = async (name: string) => {
    const response = await fetch(pdfFontUrl(name))
    if (!response.ok) throw new Error(`Font ${pdfFontUrl(name)} answered ${response.status}`)
    return response.arrayBuffer()
  }
  const base = await Promise.all(
    (Object.entries(BASE_FONT_FILES) as [keyof typeof BASE_FONT_FILES, string][]).map(async ([key, name]) => [key, await fetchFont(name)] as const)
  )
  const pairs = await Promise.all(
    scripts.map(async (script) => {
      const { regular, bold } = SCRIPT_FONT_FILES[script]
      const regularBytes = await fetchFont(regular)
      return [script, { regular: regularBytes, bold: bold === regular ? regularBytes : await fetchFont(bold) }] as const
    })
  )
  return { ...Object.fromEntries(base), scripts: Object.fromEntries(pairs) }
}

const MM = 72 / 25.4
const PAGE_SIZES = { a4: [595.28, 841.89], letter: [612, 792] } as const
const MARGIN = 12 * MM
const LINE = 0.7

/** An embedded font and the characters it can draw. */
type SheetFont = { font: PDFFont; chars: ReadonlySet<number> }

/** A face: a Latin/Cyrillic font, its fallback, and a partner per script the sheet loaded. */
type Face = RunFace<SheetFont>

type Colour = ReturnType<typeof import('pdf-lib').rgb>

/** Written without spaces between words: they wrap between words (`Intl.Segmenter`), with no hyphen. */
const UNSPACED = new Set<Locale>(['zh', 'ja', 'th'])

/** The units a line may break between: words, or for Chinese, Japanese and Thai the segmenter's words. */
export const wordsOf = (text: string, locale: Locale = 'en'): string[] =>
  UNSPACED.has(locale)
    ? [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)].map(({ segment }) => segment)
    : text.split(/\s+/).filter(Boolean)

/**
 * Word wrap. A word wider than the line breaks between letters — whole graphemes, so a mark never
 * leaves its letter — with a hyphen where the language uses one (a PDF has no hyphenation dictionary).
 */
export const wrapText = (text: string, measure: (line: string) => number, maxWidth: number, locale: Locale = 'en'): string[] => {
  const unspaced = UNSPACED.has(locale)
  const hyphen = unspaced ? '' : '-'
  const graphemes = (value: string) => [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(value)].map(({ segment }) => segment)
  const lines: string[] = []
  const push = (value: string) => {
    const trimmed = value.trim()
    if (trimmed) lines.push(trimmed)
  }
  let line = ''
  for (const word of wordsOf(text, locale)) {
    const candidate = unspaced ? `${line}${word}` : line ? `${line} ${word}` : word
    if (measure(candidate.trim()) <= maxWidth) {
      line = candidate
      continue
    }
    push(line)
    let rest = graphemes(word.trim())
    while (rest.length > 1 && measure(rest.join('')) > maxWidth) {
      let cut = rest.length - 1
      while (cut > 1 && measure(`${rest.slice(0, cut).join('')}${hyphen}`) > maxWidth) cut--
      lines.push(`${rest.slice(0, cut).join('')}${hyphen}`)
      rest = rest.slice(cut)
    }
    line = rest.join('')
  }
  push(line)
  return lines
}

const hexToRgb = (rgb: typeof import('pdf-lib').rgb, hex: string, mix = 1): Colour => {
  const channel = (index: number) => {
    const value = parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255
    return value * mix + (1 - mix)
  }
  return rgb(channel(0), channel(1), channel(2))
}

export const buildPuzzlePdf = async (input: PdfInput, fonts: PdfFonts): Promise<Uint8Array> => {
  const { PDFDocument, rgb } = await import('pdf-lib')
  // fontkit's Indic and Universal shapers (Hindi, Marathi, Bengali, Tamil) run on regenerator
  // generators and look the runtime up as a global; without it shaping throws.
  const scope = globalThis as { regeneratorRuntime?: unknown }
  scope.regeneratorRuntime ??= (await import('regenerator-runtime')).default
  const fontkit = (await import('@pdf-lib/fontkit')).default
  const bidi = (await import('bidi-js')).default()
  const { puzzle, labels } = input
  const appearance = input.appearance ?? 'default'
  // Arabic, Persian, Urdu and Hebrew sheets mirror, as the board does: the grid, the arrows, the
  // clue columns and the header all read from the right.
  const rtl = getDirection(puzzle.locale) === 'rtl'

  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  // No ligatures: a ligature glyph maps back to one letter, so Armenian ու would copy out wrong.
  // Fonts are embedded whole: pdf-lib's subsetter drops glyphs from the CJK cuts, so a Chinese,
  // Japanese or Korean sheet weighs a few megabytes — it is built and kept on the device.
  const LIGATURES_OFF = { liga: false, clig: false, dlig: false }
  // pdf-lib draws no GPOS offsets, and Noto Sans Arabic's `ccmp` splits letters into a dotless
  // body plus dots placed by offset (final ي would lose its dots); without it the letters stay whole.
  const FEATURES: Partial<Record<PdfScript, Record<string, boolean>>> = { arabic: { ...LIGATURES_OFF, ccmp: false } }
  const embedded = new Map<ArrayBuffer, Promise<SheetFont>>()
  const embed = (bytes: ArrayBuffer | undefined, script?: PdfScript): Promise<SheetFont> | undefined => {
    if (!bytes) return undefined
    if (!embedded.has(bytes)) {
      embedded.set(
        bytes,
        pdf
          .embedFont(bytes, { features: (script && FEATURES[script]) ?? LIGATURES_OFF })
          .then((font) => ({ font, chars: new Set(font.getCharacterSet()) }))
      )
    }
    return embedded.get(bytes)
  }
  const [display, body, bodyBold] = await Promise.all([embed(fonts.display), embed(fonts.body), embed(fonts.bodyBold)])
  if (!display || !body || !bodyBold) throw new Error('PDF fonts are missing')
  const scriptFonts = await Promise.all(
    (Object.entries(fonts.scripts ?? {}) as [PdfScript, { regular: ArrayBuffer; bold: ArrayBuffer }][]).map(
      async ([script, pair]) => [script, await embed(pair.regular, script)!, await embed(pair.bold, script)!] as const
    )
  )
  const regular = Object.fromEntries(scriptFonts.map(([script, font]) => [script, font]))
  const bold = Object.fromEntries(scriptFonts.map(([script, , font]) => [script, font]))
  const faces = {
    // Rubik has no Vietnamese tone letters: Nunito Bold draws those.
    display: { primary: display, fallbacks: [bodyBold], scripts: bold },
    body: { primary: body, fallbacks: [], scripts: regular },
    bold: { primary: bodyBold, fallbacks: [], scripts: bold },
  } satisfies Record<string, Face>
  const runsOf = (value: string, face: Face) => (rtl ? visualRuns(value, face, puzzle.locale, bidi) : fontRuns(value, face, puzzle.locale))
  const widthOf = (value: string, face: Face, size: number) =>
    runsOf(value, face).reduce((sum, run) => sum + run.font.font.widthOfTextAtSize(run.text, size), 0)

  const paint = (hex: string, mix = 1) => hexToRgb(rgb, hex, mix)
  const ink = paint(appearance === 'mono' ? PRINT.ink : INK[900])
  const muted = paint(appearance === 'mono' ? PRINT.muted : INK[700])
  const clueFill = paint(appearance === 'colorful' ? TEAL[100] : appearance === 'mono' ? PRINT.paper : INK[300], appearance === 'default' ? 0.3 : 1)
  const clueInk = paint(appearance === 'colorful' ? TEAL[700] : appearance === 'mono' ? PRINT.ink : INK[900])
  const ruleColor = paint(appearance === 'colorful' ? CORAL[500] : appearance === 'mono' ? PRINT.ink : INK[900])
  const hatchOf = (stamp: number): Colour => paint(appearance === 'colorful' ? sticker(stamp).mark : appearance === 'mono' ? PRINT.hatch : INK[300])

  const [pageWidth, pageHeight] = PAGE_SIZES[input.pageSize]
  const contentWidth = pageWidth - 2 * MARGIN
  // One line in the bottom margin of every page, so the grid and clues stop above it.
  const playSize = 8
  const playBaseline = pageHeight - MARGIN
  const bottom = playBaseline - playSize - 3 * MM
  let page: PDFPage = pdf.addPage([pageWidth, pageHeight])

  // ── drawing, in top-down coordinates ──
  const text = (value: string, x: number, baseline: number, size: number, face: Face, color = ink) => {
    let cursor = x
    for (const run of runsOf(value, face)) {
      page.drawText(run.text, { x: cursor, y: pageHeight - baseline, size, font: run.font.font, color })
      cursor += run.font.font.widthOfTextAtSize(run.text, size)
    }
  }
  /** Text that starts at `x` in a left-to-right sheet, and ends at the mirrored point in a right-to-left one. */
  const textFrom = (value: string, x: number, baseline: number, size: number, face: Face, color = ink) =>
    text(value, rtl ? pageWidth - x - widthOf(value, face, size) : x, baseline, size, face, color)
  const rect = (x: number, y: number, width: number, height: number, style: { fill?: Colour; stroke?: Colour; line?: number }) =>
    page.drawRectangle({
      x,
      y: pageHeight - y - height,
      width,
      height,
      color: style.fill,
      borderColor: style.stroke,
      borderWidth: style.stroke ? (style.line ?? LINE) : 0,
    })
  // SVG paths are y-down from their origin: anchored at the page's top-left, they take top-down points.
  const path = (d: string, style: { stroke?: Colour; fill?: Colour; line?: number }) =>
    page.drawSvgPath(d, {
      x: 0,
      y: pageHeight,
      borderColor: style.stroke,
      borderWidth: style.stroke ? (style.line ?? LINE) : 0,
      color: style.fill,
    })

  const header = () => {
    const titleSize = 16
    const baseline = MARGIN + titleSize
    textFrom(labels.title, MARGIN, baseline, titleSize, faces.display)
    textFrom(labels.subtitle, MARGIN + widthOf(labels.title, faces.display, titleSize) + 3 * MM, baseline, 10, faces.body)
    textFrom(labels.brand, pageWidth - MARGIN - widthOf(labels.brand, faces.display, 10), baseline, 10, faces.display)
    const rule = baseline + 2 * MM
    rect(MARGIN, rule, contentWidth, 1.1, { fill: ruleColor })
    return rule + 5 * MM
  }

  const arrow = (kind: Arrow, x: number, y: number, width: number, height: number, cell: number) => {
    // Right-to-left, an arrow points left: every x mirrors about the clue box's centre line.
    const mx = (px: number) => (rtl ? 2 * x + width - px : px)
    const a = cell * 0.2
    const head = a * 0.45
    const line = Math.max(0.6, cell * 0.025)
    const right = (tipX: number, tipY: number) =>
      path(`M ${mx(tipX)} ${tipY} L ${mx(tipX - head)} ${tipY - head * 0.6} L ${mx(tipX - head)} ${tipY + head * 0.6} Z`, { fill: clueInk })
    const down = (tipX: number, tipY: number) =>
      path(`M ${mx(tipX)} ${tipY} L ${mx(tipX - head * 0.6)} ${tipY - head} L ${mx(tipX + head * 0.6)} ${tipY - head} Z`, { fill: clueInk })
    const edgeX = x + width
    const edgeY = y + height
    const midX = x + width / 2
    const midY = y + height / 2
    if (kind === 'right') {
      path(`M ${mx(edgeX - a / 2)} ${midY} L ${mx(edgeX + a / 2 - head)} ${midY}`, { stroke: clueInk, line })
      right(edgeX + a / 2, midY)
    } else if (kind === 'down') {
      path(`M ${mx(midX)} ${edgeY - a / 2} L ${mx(midX)} ${edgeY + a / 2 - head}`, { stroke: clueInk, line })
      down(midX, edgeY + a / 2)
    } else if (kind === 'downRight') {
      const turnY = edgeY + a * 0.35
      path(`M ${mx(midX - a / 2)} ${edgeY - a * 0.35} L ${mx(midX - a / 2)} ${turnY} L ${mx(midX + a / 2 - head)} ${turnY}`, { stroke: clueInk, line })
      right(midX + a / 2, turnY)
    } else {
      const turnX = edgeX + a * 0.35
      path(`M ${mx(edgeX - a * 0.35)} ${midY - a / 2} L ${mx(turnX)} ${midY - a / 2} L ${mx(turnX)} ${midY + a / 2 - head}`, { stroke: clueInk, line })
      down(turnX, midY + a / 2)
    }
  }

  /**
   * The largest size at which the clue's lines fit the box: keeping every word whole while the
   * type stays comfortably readable, and below that breaking long words by letters instead.
   */
  const fitClue = (clue: string, width: number, height: number, cell: number) => {
    const face = faces.bold
    const ceiling = cell * 0.2
    const readable = cell * 0.14
    const floor = cell * 0.09
    const words = wordsOf(clue, puzzle.locale)
    const attempt = (size: number) => ({ lines: wrapText(clue, (line) => widthOf(line, face, size), width, puzzle.locale), size })
    const fits = ({ lines, size }: { lines: string[]; size: number }) => lines.length * size * 1.08 <= height
    for (let size = ceiling; size >= readable; size -= 0.25) {
      const whole = words.every((word) => widthOf(word.trim(), face, size) <= width)
      if (whole && fits(attempt(size))) return attempt(size)
    }
    for (let size = ceiling; size > floor; size -= 0.25) if (fits(attempt(size))) return attempt(size)
    return attempt(floor)
  }

  const grid = (top: number, width: number, letters: string[] | undefined, answerKey: boolean) => {
    const cell = width / puzzle.width
    const left = MARGIN + (contentWidth - width) / 2
    const at = (index: number) => {
      const column = index % puzzle.width
      return { x: left + (rtl ? puzzle.width - 1 - column : column) * cell, y: top + Math.floor(index / puzzle.width) * cell }
    }

    // Fills first, then every line, then type and arrows on top.
    puzzle.cells.forEach((view, index) => {
      const { x, y } = at(index)
      if (view.k === 'C') rect(x, y, cell, cell, { fill: clueFill })
      if (view.k === 'B' && puzzle.format === 'scanword') {
        const stamp = view.d ?? index
        if (appearance === 'colorful') rect(x, y, cell, cell, { fill: paint(sticker(stamp).fill) })
        const gap = 1.6 * MM
        let d = ''
        for (let c = gap; c < 2 * cell; c += gap) {
          const fromX = Math.max(0, c - cell)
          const toX = Math.min(cell, c)
          d += ` M ${x + fromX} ${y + c - fromX} L ${x + toX} ${y + c - toX}`
        }
        path(d, { stroke: hatchOf(stamp), line: 0.5 })
      }
      if (view.k === 'B' && puzzle.format === 'classic' && appearance !== 'default') {
        const fill = appearance === 'mono' ? ink : paint(sticker(index).block)
        rect(x, y, cell, cell, { fill })
      }
    })
    puzzle.cells.forEach((view, index) => {
      if (view.k === 'B' && puzzle.format !== 'scanword') return
      const { x, y } = at(index)
      rect(x, y, cell, cell, { stroke: view.k === 'C' ? clueInk : ink })
    })
    puzzle.cells.forEach((view, index) => {
      const { x, y } = at(index)
      if (view.k === 'L') {
        if (puzzle.format === 'classic' && view.n !== undefined) {
          const size = cell * 0.24
          const number = String(view.n)
          const inset = cell * 0.06
          text(number, rtl ? x + cell - inset - widthOf(number, faces.body, size) : x + inset, y + cell * 0.04 + size * 0.8, size, faces.body)
        }
        const token = letters?.[index]
        if (token) {
          const letter = displayCell(token, puzzle.locale)
          const size = cell * 0.5
          text(letter, x + (cell - widthOf(letter, faces.display, size)) / 2, y + cell / 2 + size * 0.36, size, faces.display)
        }
      }
      if (view.k === 'C' && !answerKey) {
        const partHeight = cell / view.clues.length
        view.clues.forEach((id, part) => {
          const word = puzzle.words[id]!
          const partTop = y + part * partHeight
          if (part > 0) rect(x, partTop, cell, 0.5, { fill: clueInk })
          const pad = cell * 0.09
          const { lines, size } = fitClue(word.clue, cell - 2 * pad, partHeight - pad, cell)
          const lineHeight = size * 1.08
          const first = partTop + (partHeight - lines.length * lineHeight) / 2 + size * 0.8
          lines.forEach((line, row) =>
            text(line, x + (cell - widthOf(line, faces.bold, size)) / 2, first + row * lineHeight, size, faces.bold)
          )
        })
      }
    })
    // Arrows last: they cross into the neighbouring cell, over its border.
    puzzle.cells.forEach((view, index) => {
      if (view.k !== 'C' || answerKey) return
      const { x, y } = at(index)
      const partHeight = cell / view.clues.length
      view.clues.forEach((id, part) => arrow(puzzle.words[id]!.arrow!, x, y + part * partHeight, cell, partHeight, cell))
    })
    return top + cell * puzzle.height
  }

  /**
   * Classic clue lists in two columns, balanced like CSS `columns: 2`; a list too long for the
   * page carries on over new pages.
   */
  const clueLists = (top: number) => {
    const gap = 8 * MM
    const columnWidth = (contentWidth - gap) / 2
    const size = 9
    const lineHeight = size * 1.35
    const numberWidth = 6 * MM
    const headingSize = 11
    const headingHeight = headingSize + 2 * MM

    type Block = { height: number; draw: (x: number, y: number) => void }
    const blocks: Block[] = []
    for (const dir of ['across', 'down'] as Direction[]) {
      const items = puzzle.words
        .filter((word) => word.dir === dir)
        .map((word) => ({
          word,
          lines: wrapText(`${word.clue} (${word.length})`, (line) => widthOf(line, faces.body, size), columnWidth - numberWidth, puzzle.locale),
        }))
      items.forEach(({ word, lines }, index) => {
        const itemHeight = lines.length * lineHeight + 0.8 * MM
        const drawItem = (x: number, y: number) => {
          textFrom(String(word.number ?? ''), x, y + size, size, faces.bold)
          lines.forEach((line, row) => textFrom(line, x + numberWidth, y + size + row * lineHeight, size, faces.body))
        }
        // The heading travels with the first clue, so it never sits alone at the foot of a column.
        if (index > 0) blocks.push({ height: itemHeight, draw: drawItem })
        else
          blocks.push({
            height: headingHeight + itemHeight,
            draw: (x, y) => {
              textFrom(dir === 'across' ? labels.across : labels.down, x, y + headingSize, headingSize, faces.display)
              drawItem(x, y + headingHeight)
            },
          })
      })
      if (blocks.length) blocks[blocks.length - 1]!.height += 3 * MM
    }

    const half = blocks.reduce((sum, block) => sum + block.height, 0) / 2
    let column = 0
    let columnTop = top
    let leftBottom = top
    let y = top
    let firstPage = true
    for (const block of blocks) {
      const balanced = firstPage && column === 0 && y - columnTop + block.height / 2 > half
      if (balanced || y + block.height > bottom) {
        if (column === 0) {
          column = 1
          leftBottom = y
        } else {
          page = pdf.addPage([pageWidth, pageHeight])
          column = 0
          columnTop = MARGIN
          firstPage = false
        }
        y = columnTop
      }
      block.draw(MARGIN + column * (columnWidth + gap), y)
      y += block.height
    }
    return column === 1 ? Math.max(y, leftBottom) : y
  }

  // ── the sheet ──
  const top = header()
  const ratio = puzzle.width / puzzle.height
  const width =
    puzzle.format === 'scanword'
      ? Math.min(contentWidth, (bottom - top) * ratio)
      : Math.min(contentWidth, 125 * MM, 150 * MM * ratio)
  const gridBottom = grid(top, width, input.letters, false)
  if (puzzle.format === 'classic') clueLists(gridBottom + 5 * MM)

  if (input.answers) {
    page = pdf.addPage([pageWidth, pageHeight])
    textFrom(labels.answers, MARGIN, MARGIN + 14, 14, faces.display)
    grid(MARGIN + 14 + 5 * MM, Math.min(contentWidth, 120 * MM, 170 * MM * ratio), puzzle.solution, true)
  }

  // The same corner on every sheet, including a clue page and the answer key.
  const playX = pageWidth - MARGIN - widthOf(labels.playOnline, faces.body, playSize)
  for (const sheet of pdf.getPages()) {
    page = sheet
    textFrom(labels.playOnline, playX, playBaseline, playSize, faces.body, muted)
  }

  pdf.setTitle(`${labels.title} — ${labels.subtitle}`, { showInWindowTitleBar: true })
  pdf.setLanguage(puzzle.locale)
  pdf.setCreator(labels.brand)
  pdf.setProducer(labels.brand)
  return pdf.save()
}
