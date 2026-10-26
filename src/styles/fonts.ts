import { Nunito, Rubik } from 'next/font/google'
import type { Locale } from '@i18n/config'

/**
 * Rubik for display (headings, grid letters, numbers) — round, friendly and bold; Nunito for
 * body copy — soft and very readable at small sizes. Both cover Latin and Cyrillic, so
 * English and Russian need nothing else.
 *
 * The variables are `--font-heading` / `--font-body`, NOT `--font-sans`: Tailwind defines
 * `--font-sans` itself, and globals.css composes it from these plus `--font-script`.
 */
export const fontHeading = Rubik({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['500', '600', '700', '800'],
})

export const fontBody = Nunito({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-body',
  adjustFontFallback: true,
})

/**
 * Locales whose script neither face has, loaded per page from Google Fonts — only the active
 * locale's family, so English and Russian visitors never download an Armenian font. (next/font
 * would inline every family's @font-face into the shared CSS.)
 *
 * `--font-script` is appended *after* the Latin faces, so Latin text inside an Armenian page
 * still renders in Rubik/Nunito by per-glyph fallback.
 */
const SCRIPT_FAMILIES: Partial<Record<Locale, string>> = {
  hy: 'Noto Sans Armenian',
}

export type ScriptFont = { family: string; href: string }

export const getScriptFont = (locale: Locale): ScriptFont | null => {
  const family = SCRIPT_FAMILIES[locale]
  if (!family) return null
  return {
    family,
    href: `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`,
  }
}
