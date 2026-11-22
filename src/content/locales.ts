import type { Locale } from '@constants/puzzle'

/**
 * The languages that have guides, so far. Kept apart from the registry (`./index.ts`) so the
 * header, the menu and the footer can link `/guides` without shipping the articles to the
 * browser. `tests/unit/content` fails when it and the registry disagree.
 */
export const GUIDE_LOCALES: readonly Locale[] = ['en', 'ru', 'hy', 'de', 'pl', 'sv', 'hu', 'nl', 'cs', 'fr', 'it', 'es', 'pt', 'uk', 'ja']

export const hasGuides = (locale: string): boolean => (GUIDE_LOCALES as readonly string[]).includes(locale)
