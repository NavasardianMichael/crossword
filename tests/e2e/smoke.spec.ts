import { expect, type Page, test } from '@playwright/test'

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
