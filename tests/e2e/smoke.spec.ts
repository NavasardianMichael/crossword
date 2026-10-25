import { type Download, expect, type Page, test } from '@playwright/test'
import { readFileSync } from 'node:fs'

/**
 * The whole stack, end to end (needs `pnpm dev` with a seeded database). Gemini may be off:
 * the seed pool serves every puzzle here.
 */

const createPuzzle = async (page: Page, locale: string, format: 'classic' | 'scanword' = 'classic') => {
  await page.goto(`/${locale}`)
  await page.locator(`input[name="format"][value="${format}"]`).check({ force: true })
  await page.locator('input[name="topic"][value="any"]').check({ force: true })
  await page.locator('form button[type="submit"]').click()
  await page.waitForURL((url) => url.pathname.startsWith(`/${locale}/p/`) && /\/p\/[0-9A-Za-z]{10}$/.test(url.pathname))
  await expect(page.getByRole('grid')).toBeVisible()
}

test.describe('server rendering', () => {
  test.use({ javaScriptEnabled: false })

  test('the home page is complete without JavaScript', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('h1')).toBeVisible()
    // On phones the nav sits in the menu drawer; the links are in the HTML either way.
    await expect(page.locator('a[href="/en/crossword"]')).not.toHaveCount(0)
    await expect(page.locator('a[href="/en/topics/animals"]')).not.toHaveCount(0)
  })

  test('every page is self-canonical with hreflang for each language', async ({ page }) => {
    await page.goto('/hy/scanword')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/hy\/scanword$/)
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4)
    await expect(page.locator('html')).toHaveAttribute('lang', 'hy')
  })

  test('the home page carries one title and a link preview', async ({ page }) => {
    await page.goto('/en')
    // The home title is complete on its own: the layout's "| Crossword AI" template is not added twice.
    await expect(page).toHaveTitle(/^[^|]*\| Crossword AI$/)
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Crossword AI')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/opengraph-image$/)
  })

  test('the FAQ page answers in full, with FAQPage data', async ({ page }) => {
    await page.goto('/hy/faq')
    await expect(page.locator('h1')).toHaveText('Հարցեր և պատասխաններ')
    const data = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((text) => JSON.parse(text))
    const faq = data.find((each) => each['@type'] === 'FAQPage')
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(15)
    // Every answer is in the server HTML, not only in the structured data.
    await expect(page.getByText(faq.mainEntity[0].acceptedAnswer.text)).toHaveCount(1)
  })
})

test('a puzzle is shared through the apps its language uses', async ({ page }) => {
  await createPuzzle(page, 'ru')
  await page.getByRole('button', { name: 'Поделиться' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('textbox')).toHaveValue(/\/ru\/p\/[0-9A-Za-z]{10}$/)
  const first = dialog.getByRole('link').first()
  await expect(first).toHaveText('Telegram')
  await expect(first).toHaveAttribute('href', /^https:\/\/t\.me\/share\/url\?url=.*%2Fru%2Fp%2F.*utm_source%3Dtelegram/)
})

test('an unprefixed visit goes to the browser language', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'hy-AM' })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/hy$/)
  await context.close()
})

test('a crossword can be revealed to the end', async ({ page }) => {
  await createPuzzle(page, 'en')
  await page.getByRole('button', { name: 'Reveal' }).click()
  await page.getByRole('menuitem', { name: 'Reveal puzzle' }).click()
  await page.getByRole('button', { name: 'Reveal everything' }).click()
  await expect(page.getByRole('dialog').getByText('Solved', { exact: false })).toBeVisible()
})

test('the grid works from the keyboard alone', async ({ page }) => {
  await createPuzzle(page, 'en')
  const cursor = page.locator('[role="gridcell"][tabindex="0"]')
  await cursor.focus()
  const first = await cursor.getAttribute('data-cell')
  await page.keyboard.type('q')
  await expect(page.locator(`[data-cell="${first}"]`)).toHaveText(/Q/)
  await expect(page.locator('[role="gridcell"][tabindex="0"]')).not.toHaveAttribute('data-cell', first!)
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await expect(page.locator(`[data-cell="${first}"]`)).not.toHaveText(/Q/)
})

// Playwright types only US-layout keys, which is exactly the fallback a player on an English OS
// layout uses: W and U are ո and ւ on the Armenian phonetic layout, 7 is և.
test('Armenian ո then ւ fills one cell with ՈՒ, and և is one letter', async ({ page }) => {
  await createPuzzle(page, 'hy', 'scanword')
  const cursor = page.locator('[role="gridcell"][tabindex="0"]')
  await cursor.focus()
  const first = await cursor.getAttribute('data-cell')
  await page.keyboard.press('w')
  await page.keyboard.press('u')
  await expect(page.locator(`[data-cell="${first}"]`)).toHaveText('ՈՒ')

  await page.locator(`[data-cell="${first}"]`).click()
  await page.keyboard.press('Delete')
  await page.keyboard.press('7')
  await expect(page.locator(`[data-cell="${first}"]`)).toHaveText('և')
})

test('a scanword prints as a clean sheet, with an answer key on request', async ({ page }) => {
  await createPuzzle(page, 'en', 'scanword')
  await page.evaluate(() => {
    window.print = () => window.dispatchEvent(new Event('beforeprint'))
  })
  await page.getByRole('button', { name: 'More' }).click()
  await page.getByRole('menuitem', { name: 'Print', exact: true }).click()
  await page.getByRole('switch', { name: 'Add the answers' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Print', exact: true }).click()

  const sheet = page.locator('body > .print-sheet')
  await expect(sheet).toHaveCount(1)
  await expect(sheet.getByText('Answers')).toHaveCount(1)
  await page.emulateMedia({ media: 'print' })
  await expect(sheet).toBeVisible()
  await expect(page.locator('main')).toBeHidden()

  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')))
  await expect(sheet).toHaveCount(0)
})

test('a scanword opens as a PDF in a new tab', async ({ page }) => {
  await createPuzzle(page, 'hy', 'scanword')
  await page.getByRole('button', { name: 'Ավելին' }).click()
  await page.getByRole('menuitem', { name: 'Պահել PDF-ով' }).click()
  await page.getByRole('switch').nth(1).click()
  // Headless Chromium has no PDF viewer: the tab's navigation to the PDF arrives as a download.
  // Listened for as soon as the tab exists — with the fonts cached, the PDF can beat a later listener.
  const downloaded = new Promise<Download>((resolve) => page.once('popup', (tab) => void tab.waitForEvent('download').then(resolve)))
  await page.getByRole('dialog').getByRole('button', { name: 'Բացել PDF-ը' }).click()

  const download = await downloaded
  const head = readFileSync((await download.path())!).subarray(0, 5).toString('latin1')
  expect(head).toBe('%PDF-')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('leaving an unfinished game asks first', async ({ page }) => {
  await createPuzzle(page, 'en')
  const board = page.url()
  await page.locator('[role="gridcell"][tabindex="0"]').focus()
  await page.keyboard.type('q')

  // An in-app link: a native confirm, which keeps the game when refused.
  page.once('dialog', (dialog) => {
    expect(dialog.type()).toBe('confirm')
    void dialog.dismiss()
  })
  await page.getByRole('banner').getByRole('link').first().click()
  await expect(page.getByRole('grid')).toBeVisible()
  expect(page.url()).toBe(board)

  // Reloading or closing the tab: the browser's own prompt.
  const asked = new Promise<string>((resolve) =>
    page.once('dialog', (dialog) => {
      resolve(dialog.type())
      void dialog.dismiss()
    })
  )
  void page.reload().catch(() => undefined)
  expect(await asked).toBe('beforeunload')
})
