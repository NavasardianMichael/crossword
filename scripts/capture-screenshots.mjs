#!/usr/bin/env node
/**
 * Captures the web manifest's screenshots (`src/app/manifest.ts`) from the running app: the
 * richer install sheet Chrome shows on Android (`narrow`) and desktop (`wide`).
 *
 * Usage: pnpm dev   (in another terminal, with a seeded database)
 *        pnpm screenshots
 *
 * Writes `public/screenshots/{narrow,wide}-{home,crossword,scanword}.png`. Each puzzle is
 * half filled with its own solution, so the board looks mid-game. The sizes are fixed by the
 * viewports below; `SCREENSHOT_SIZES` and `SCREENSHOTS` in `src/constants/pwa.ts` must match.
 */
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, devices } from '@playwright/test'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/screenshots')
const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:7007'
const API_URL = process.env.SCREENSHOT_API_URL ?? 'http://localhost:9007'
const LOCALE = 'en'
/** Share of letter cells typed in before the shot: mid-game, never close to solved. */
const FILL_SHARE = 0.5

/** 824×1830 and 1920×1200: within the 2.3:1 ratio Chrome accepts. */
const FORM_FACTORS = {
  narrow: { ...devices['Pixel 7'], viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 },
  wide: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 },
}

const settle = async (page) => {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  // The `next dev` badge and overlay.
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' })
  await page.waitForTimeout(600)
}

const createPuzzle = async (page, format) => {
  await page.goto(`/${LOCALE}`)
  await page.locator(`input[name="format"][value="${format}"]`).check({ force: true })
  await page.locator('input[name="topic"][value="any"]').check({ force: true })
  await page.locator('form button[type="submit"]').click()
  await page.waitForURL((url) => /\/p\/[0-9A-Za-z]{10}$/.test(url.pathname), { timeout: 90_000 })
  await page.getByRole('grid').waitFor()
  const id = new URL(page.url()).pathname.split('/').pop()
  const response = await fetch(`${API_URL}/puzzles/${id}`)
  if (!response.ok) throw new Error(`GET /puzzles/${id} answered ${response.status}`)
  const body = await response.json()
  return body.value ?? body
}

/** Types whole words in until FILL_SHARE of the letter cells hold their answer, then parks the cursor on an empty word. */
const fillHalf = async (page, puzzle) => {
  const cellsOf = (word) =>
    Array.from({ length: word.length }, (_, i) =>
      word.dir === 'across' ? word.row * puzzle.width + word.col + i : (word.row + i) * puzzle.width + word.col
    )
  const letterCells = puzzle.cells.filter((cell) => cell.k === 'L').length
  const filled = new Set()
  const untouched = []
  for (const word of puzzle.words) {
    const cells = cellsOf(word)
    if (filled.size + cells.length > letterCells * FILL_SHARE) {
      untouched.push(cells)
      continue
    }
    for (const cell of cells) {
      if (filled.has(cell)) continue
      await page.locator(`[data-cell="${cell}"]`).click()
      await page.keyboard.type(puzzle.solution[cell].toLowerCase())
      filled.add(cell)
    }
  }
  const empty = untouched.find((cells) => cells.every((cell) => !filled.has(cell))) ?? untouched[0]
  if (empty) await page.locator(`[data-cell="${empty[0]}"]`).click()
}

const SHOTS = {
  home: async (page) => {
    await page.goto(`/${LOCALE}`)
  },
  crossword: async (page) => fillHalf(page, await createPuzzle(page, 'classic')),
  scanword: async (page) => fillHalf(page, await createPuzzle(page, 'scanword')),
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
try {
  for (const [factor, device] of Object.entries(FORM_FACTORS)) {
    for (const [name, shoot] of Object.entries(SHOTS)) {
      // A fresh context each time: no "leave this game?" prompt, no prefetched puzzle reused.
      const context = await browser.newContext({ ...device, baseURL: BASE_URL, locale: 'en-US' })
      const page = await context.newPage()
      await shoot(page)
      await settle(page)
      const file = path.join(OUT, `${factor}-${name}.png`)
      await page.screenshot({ path: file })
      console.log(`✓ ${path.relative(ROOT, file)}`)
      await context.close()
    }
  }
} finally {
  await browser.close()
}
