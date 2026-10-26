import { CORAL, INK, LAVENDER, MINT, SKY, SUN, TEAL, WHITE } from '@styles/tokens'

/**
 * The emblem: a 3×3 sticker grid with a crossing of lettered tiles in crayon colours and two
 * blank cells — a crossword at a glance. One SVG string feeds the inline header mark, the
 * favicon and the app icons (`ImageResponse` takes it as an image).
 */
const TILES: { x: number; y: number; fill: string; letter?: string }[] = [
  { x: 0, y: 0, fill: CORAL[400], letter: 'A' },
  { x: 1, y: 0, fill: SUN[400], letter: 'Б' },
  { x: 2, y: 0, fill: TEAL[300], letter: 'Ա' },
  { x: 0, y: 1, fill: LAVENDER[300] },
  { x: 1, y: 1, fill: MINT[300], letter: '?' },
  { x: 2, y: 1, fill: SKY[300] },
  { x: 1, y: 2, fill: CORAL[300] },
]

export const emblemSvg = ({ background = false }: { background?: boolean } = {}): string => {
  const cell = 20
  const gap = 2
  const tiles = TILES.map(({ x, y, fill, letter }) => {
    const left = 1 + x * (cell + gap)
    const top = 1 + y * (cell + gap)
    const text = letter
      ? `<text x="${left + cell / 2}" y="${top + cell / 2 + 5.5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="800" fill="${INK[900]}">${letter}</text>`
      : ''
    return `<rect x="${left}" y="${top + 1.5}" width="${cell}" height="${cell}" rx="5" fill="${INK[900]}" opacity="0.18"/><rect x="${left}" y="${top}" width="${cell}" height="${cell}" rx="5" fill="${fill}" stroke="${INK[900]}" stroke-width="1.5"/>${text}`
  }).join('')
  const backdrop = background ? `<rect width="68" height="68" rx="16" fill="${WHITE}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 70 70">${backdrop}${tiles}</svg>`
}

export const emblemDataUri = (options?: { background?: boolean }): string =>
  `data:image/svg+xml;base64,${Buffer.from(emblemSvg(options)).toString('base64')}`
