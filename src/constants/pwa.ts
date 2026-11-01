export type ScreenshotFormFactor = 'narrow' | 'wide'

/**
 * The web manifest's screenshots, captured from the running app by `pnpm screenshots`
 * (`scripts/capture-screenshots.mjs`). The sizes are that script's viewports times its device
 * scale factor; `tests/unit/pwa/manifest.spec.ts` checks them against the files.
 */
export const SCREENSHOT_SIZES: Record<ScreenshotFormFactor, string> = { narrow: '824x1830', wide: '1920x1200' }

export const SCREENSHOTS = [
  { name: 'home', label: 'Pick a format and a topic for a new puzzle' },
  { name: 'crossword', label: 'A crossword in progress' },
  { name: 'scanword', label: 'A scanword, clues inside the grid' },
] as const

export const screenshotPath = (formFactor: ScreenshotFormFactor, name: string): string =>
  `/screenshots/${formFactor}-${name}.png`
