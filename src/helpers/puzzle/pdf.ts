import type { PDFFont, PDFPage } from 'pdf-lib'
import { displayCell } from '@constants/alphabet'
import type { Arrow, Direction, PuzzleView } from '@constants/puzzle'
import { INK } from '@styles/tokens'

/**
 * The printed sheet (components/puzzle/PrintSheet.tsx) as a real, vector PDF, built in the
 * browser — so it works offline, costs the server nothing, and its text stays selectable.
 * `pdf-lib` and the fonts load only when a PDF is asked for.
 *
 * Laid out in top-down points (`Y` flips to PDF space at the last moment). Unlike the CSS
 * sheet, a scanword clue is fitted to its cell: the size steps down until every line fits.
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

export type PdfInput = {
  puzzle: PuzzleView
  labels: PdfLabels
  /** Letters to print in the grid (the player's), per cell. */
  letters?: string[]
  /** An answer key on a page of its own. */
  answers: boolean
  pageSize: 'a4' | 'letter'
}

/** Static TrueType instances (OFL): Rubik and Nunito cover Latin + Cyrillic, Noto Sans Armenian the rest. */
const FONT_FILES = {
  display: '/fonts/pdf/rubik-bold.ttf',
  body: '/fonts/pdf/nunito-regular.ttf',
  bodyBold: '/fonts/pdf/nunito-bold.ttf',
  armenian: '/fonts/pdf/noto-sans-armenian-regular.ttf',
  armenianBold: '/fonts/pdf/noto-sans-armenian-bold.ttf',
} as const

export type PdfFonts = Partial<Record<keyof typeof FONT_FILES, ArrayBuffer>>

/** The Armenian block and its ligatures (U+FB13–FB17). */
const ARMENIAN_RUN = /([\u0530-\u058F\uFB13-\uFB17]+)/

export const needsArmenian = (input: Pick<PdfInput, 'puzzle' | 'labels'>): boolean =>
  input.puzzle.locale === 'hy' || Object.values(input.labels).some((label) => ARMENIAN_RUN.test(label))

/** Fetches the faces a PDF needs; the Armenian pair only when some text is Armenian. */
export const loadPdfFonts = async (armenian: boolean): Promise<PdfFonts> => {
  const names = (Object.keys(FONT_FILES) as (keyof typeof FONT_FILES)[]).filter(
    (name) => armenian || !name.startsWith('armenian')
  )
  const files = await Promise.all(
    names.map(async (name) => {
      const response = await fetch(FONT_FILES[name])
      if (!response.ok) throw new Error(`Font ${FONT_FILES[name]} answered ${response.status}`)
      return [name, await response.arrayBuffer()] as const
    })
  )
  return Object.fromEntries(files)
}

const MM = 72 / 25.4
const PAGE_SIZES = { a4: [595.28, 841.89], letter: [612, 792] } as const
const MARGIN = 12 * MM
const LINE = 0.7

/** A face is a Latin/Cyrillic font plus, for Armenian runs, its Armenian partner. */
type Face = { latin: PDFFont; armenian?: PDFFont }

type Colour = ReturnType<typeof import('pdf-lib').rgb>

const runsOf = (text: string, face: Face) =>
  text
    .split(ARMENIAN_RUN)
    .filter(Boolean)
    .map((run) => ({ run, font: face.armenian && ARMENIAN_RUN.test(run) ? face.armenian : face.latin }))

const widthOf = (text: string, face: Face, size: number) =>
  runsOf(text, face).reduce((sum, { run, font }) => sum + font.widthOfTextAtSize(run, size), 0)

/** Word wrap; a word wider than the line breaks by letters with a hyphen (a PDF has no hyphenation dictionary). */
export const wrapText = (text: string, measure: (line: string) => number, maxWidth: number): string[] => {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word
    if (measure(candidate) <= maxWidth) {
      line = candidate
      continue
    }
    if (line) lines.push(line)
    let rest = word
    while (rest.length > 1 && measure(rest) > maxWidth) {
      let cut = rest.length - 1
      while (cut > 1 && measure(`${rest.slice(0, cut)}-`) > maxWidth) cut--
      lines.push(`${rest.slice(0, cut)}-`)
      rest = rest.slice(cut)
    }
    line = rest
  }
  if (line) lines.push(line)
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
  const fontkit = (await import('@pdf-lib/fontkit')).default
  const { puzzle, labels } = input

  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  // No ligatures: a ligature glyph maps back to one letter, so Armenian ու would copy out wrong.
  const embed = (bytes?: ArrayBuffer) =>
    bytes ? pdf.embedFont(bytes, { features: { liga: false, clig: false, dlig: false } }) : Promise.resolve(undefined)
  const [display, body, bodyBold, armenian, armenianBold] = await Promise.all([
    embed(fonts.display),
    embed(fonts.body),
    embed(fonts.bodyBold),
    embed(fonts.armenian),
    embed(fonts.armenianBold),
  ])
  if (!display || !body || !bodyBold) throw new Error('PDF fonts are missing')
  const faces = {
    display: { latin: display, armenian: armenianBold },
    body: { latin: body, armenian },
    bold: { latin: bodyBold, armenian: armenianBold },
  } satisfies Record<string, Face>

  const ink = hexToRgb(rgb, INK[900])
  const muted = hexToRgb(rgb, INK[700])
  const shade = hexToRgb(rgb, INK[300], 0.3)
  const hatch = hexToRgb(rgb, INK[300])

  const [pageWidth, pageHeight] = PAGE_SIZES[input.pageSize]
  const contentWidth = pageWidth - 2 * MARGIN
  const bottom = pageHeight - MARGIN
  let page: PDFPage = pdf.addPage([pageWidth, pageHeight])

  // ── drawing, in top-down coordinates ──
  const text = (value: string, x: number, baseline: number, size: number, face: Face, color = ink) => {
    let cursor = x
    for (const { run, font } of runsOf(value, face)) {
      page.drawText(run, { x: cursor, y: pageHeight - baseline, size, font, color })
      cursor += font.widthOfTextAtSize(run, size)
    }
  }
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
    text(labels.title, MARGIN, baseline, titleSize, faces.display)
    text(labels.subtitle, MARGIN + widthOf(labels.title, faces.display, titleSize) + 3 * MM, baseline, 10, faces.body)
    text(labels.brand, pageWidth - MARGIN - widthOf(labels.brand, faces.display, 10), baseline, 10, faces.display)
    const rule = baseline + 2 * MM
    rect(MARGIN, rule, contentWidth, 1.1, { fill: ink })
    return rule + 5 * MM
  }

  const arrow = (kind: Arrow, x: number, y: number, width: number, height: number, cell: number) => {
    const a = cell * 0.2
    const head = a * 0.45
    const line = Math.max(0.6, cell * 0.025)
    const right = (tipX: number, tipY: number) =>
      path(`M ${tipX} ${tipY} L ${tipX - head} ${tipY - head * 0.6} L ${tipX - head} ${tipY + head * 0.6} Z`, { fill: ink })
    const down = (tipX: number, tipY: number) =>
      path(`M ${tipX} ${tipY} L ${tipX - head * 0.6} ${tipY - head} L ${tipX + head * 0.6} ${tipY - head} Z`, { fill: ink })
    const edgeX = x + width
    const edgeY = y + height
    const midX = x + width / 2
    const midY = y + height / 2
    if (kind === 'right') {
      path(`M ${edgeX - a / 2} ${midY} L ${edgeX + a / 2 - head} ${midY}`, { stroke: ink, line })
      right(edgeX + a / 2, midY)
    } else if (kind === 'down') {
      path(`M ${midX} ${edgeY - a / 2} L ${midX} ${edgeY + a / 2 - head}`, { stroke: ink, line })
      down(midX, edgeY + a / 2)
    } else if (kind === 'downRight') {
      const turnY = edgeY + a * 0.35
      path(`M ${midX - a / 2} ${edgeY - a * 0.35} L ${midX - a / 2} ${turnY} L ${midX + a / 2 - head} ${turnY}`, { stroke: ink, line })
      right(midX + a / 2, turnY)
    } else {
      const turnX = edgeX + a * 0.35
      path(`M ${edgeX - a * 0.35} ${midY - a / 2} L ${turnX} ${midY - a / 2} L ${turnX} ${midY + a / 2 - head}`, { stroke: ink, line })
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
    const words = clue.split(/\s+/)
    const attempt = (size: number) => ({ lines: wrapText(clue, (line) => widthOf(line, face, size), width), size })
    const fits = ({ lines, size }: { lines: string[]; size: number }) => lines.length * size * 1.08 <= height
    for (let size = ceiling; size >= readable; size -= 0.25) {
      const whole = words.every((word) => widthOf(word, face, size) <= width)
      if (whole && fits(attempt(size))) return attempt(size)
    }
    for (let size = ceiling; size > floor; size -= 0.25) if (fits(attempt(size))) return attempt(size)
    return attempt(floor)
  }

  const grid = (top: number, width: number, letters: string[] | undefined, answerKey: boolean) => {
    const cell = width / puzzle.width
    const left = MARGIN + (contentWidth - width) / 2
    const at = (index: number) => ({ x: left + (index % puzzle.width) * cell, y: top + Math.floor(index / puzzle.width) * cell })

    // Fills first, then every line, then type and arrows on top.
    puzzle.cells.forEach((view, index) => {
      const { x, y } = at(index)
      if (view.k === 'C') rect(x, y, cell, cell, { fill: shade })
      if (view.k === 'B' && puzzle.format === 'scanword') {
        const gap = 1.6 * MM
        let d = ''
        for (let c = gap; c < 2 * cell; c += gap) {
          const fromX = Math.max(0, c - cell)
          const toX = Math.min(cell, c)
          d += ` M ${x + fromX} ${y + c - fromX} L ${x + toX} ${y + c - toX}`
        }
        path(d, { stroke: hatch, line: 0.5 })
      }
    })
    puzzle.cells.forEach((view, index) => {
      if (view.k === 'B' && puzzle.format !== 'scanword') return
      const { x, y } = at(index)
      rect(x, y, cell, cell, { stroke: ink })
    })
    puzzle.cells.forEach((view, index) => {
      const { x, y } = at(index)
      if (view.k === 'L') {
        if (puzzle.format === 'classic' && view.n !== undefined) {
          const size = cell * 0.24
          text(String(view.n), x + cell * 0.06, y + cell * 0.04 + size * 0.8, size, faces.body)
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
          if (part > 0) rect(x, partTop, cell, 0.5, { fill: ink })
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
          lines: wrapText(`${word.clue} (${word.length})`, (line) => widthOf(line, faces.body, size), columnWidth - numberWidth),
        }))
      items.forEach(({ word, lines }, index) => {
        const itemHeight = lines.length * lineHeight + 0.8 * MM
        const drawItem = (x: number, y: number) => {
          text(String(word.number ?? ''), x, y + size, size, faces.bold)
          lines.forEach((line, row) => text(line, x + numberWidth, y + size + row * lineHeight, size, faces.body))
        }
        // The heading travels with the first clue, so it never sits alone at the foot of a column.
        if (index > 0) blocks.push({ height: itemHeight, draw: drawItem })
        else
          blocks.push({
            height: headingHeight + itemHeight,
            draw: (x, y) => {
              text(dir === 'across' ? labels.across : labels.down, x, y + headingSize, headingSize, faces.display)
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
  const footerSpace = 8 * MM
  const width =
    puzzle.format === 'scanword'
      ? Math.min(contentWidth, (bottom - top - footerSpace) * ratio)
      : Math.min(contentWidth, 125 * MM, 150 * MM * ratio)
  let y = grid(top, width, input.letters, false)
  if (puzzle.format === 'classic') y = clueLists(y + 5 * MM)
  if (y + footerSpace > bottom) {
    page = pdf.addPage([pageWidth, pageHeight])
    y = MARGIN
  }
  text(labels.playOnline, MARGIN, y + 4 * MM + 8, 8, faces.body, muted)

  if (input.answers) {
    page = pdf.addPage([pageWidth, pageHeight])
    text(labels.answers, MARGIN, MARGIN + 14, 14, faces.display)
    grid(MARGIN + 14 + 5 * MM, Math.min(contentWidth, 120 * MM, 170 * MM * ratio), puzzle.solution, true)
  }

  pdf.setTitle(`${labels.title} — ${labels.subtitle}`, { showInWindowTitleBar: true })
  pdf.setLanguage(puzzle.locale)
  pdf.setCreator(labels.brand)
  pdf.setProducer(labels.brand)
  return pdf.save()
}
