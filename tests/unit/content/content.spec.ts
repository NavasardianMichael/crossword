import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { isLocale, type Locale, LOCALES } from '@i18n/config'
import { normalizeWord } from '@constants/alphabet'
import { TOPICS } from '@constants/puzzle'
import { guidePath, INDEXABLE_ROUTES, ROUTES, topicPath } from '@constants/routes'
import { GUIDES, guideSubject, guideTexts, wordCount } from '@content/index'
import { GUIDE_LOCALES } from '@content/locales'
import { type Guide,GUIDE_TOPICS } from '@content/types'
import { inlineLinks } from '@helpers/inlineMarkup'

/**
 * The content pipeline's gate (`.github/workflows/content.yml`): what a guide needs to be
 * served, found and read in its language — and the punctuation slips that are easiest to type.
 * A content-only push deploys after these alone, so they stand in for a review.
 */

const GUIDES_DIR = path.resolve(__dirname, '../../../src/content/guides')

const entries = (Object.entries(GUIDES) as [Locale, readonly Guide[]][]).flatMap(([locale, guides]) => guides.map((guide) => ({ locale, guide })))
const label = ({ locale, guide }: { locale: Locale; guide: Guide }) => `${locale}/${guide.slug}`

/** Search results show about 600 px of a title; a Chinese, Japanese or Korean character is twice as wide. */
const WIDE = new Set<Locale>(['zh', 'ja', 'ko'])
const width = (locale: Locale, text: string) => {
  const graphemes = [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(text)].length
  return WIDE.has(locale) ? graphemes * 2 : graphemes
}

/** Lowercase Latin, digits, single dashes between. */
const isSlug = (value: string): boolean => /^[a-z0-9-]+$/.test(value) && !/^-|-$|--/.test(value)

/** Locale-free paths a guide may link to in its own language: public pages only. */
const linkable = (locale: Locale): Set<string> =>
  new Set<string>([
    ...INDEXABLE_ROUTES.map((key) => ROUTES[key]),
    ...TOPICS.map(topicPath),
    ROUTES.guides,
    ...(GUIDES[locale] ?? []).map((guide) => guidePath(guide.slug)),
  ])

const fileSlugs = (locale: string): string[] =>
  readdirSync(path.join(GUIDES_DIR, locale))
    .filter((name) => name.endsWith('.ts') && name !== 'index.ts')
    .map((name) => name.replace(/\.ts$/, ''))
    .sort()

describe('guide registry', () => {
  it('has the same languages in the registry, in locales.ts and on disk', () => {
    const folders = readdirSync(GUIDES_DIR).sort()
    expect(Object.keys(GUIDES).sort()).toEqual(folders)
    expect([...GUIDE_LOCALES].sort()).toEqual(folders)
    for (const folder of folders) expect(isLocale(folder), folder).toBe(true)
  })

  it('registers every file once, under its own slug', () => {
    for (const locale of GUIDE_LOCALES) {
      expect((GUIDES[locale] ?? []).map((guide) => guide.slug).sort(), locale).toEqual(fileSlugs(locale))
    }
  })

  it('gives every guide a URL-safe slug and a key of its own in its language', () => {
    for (const locale of GUIDE_LOCALES) {
      const guides = GUIDES[locale] ?? []
      expect(guides.length, locale).toBeGreaterThan(0)
      expect(new Set(guides.map((guide) => guide.key)).size, `${locale}: two guides share a key`).toBe(guides.length)
      for (const guide of guides) {
        expect(isSlug(guide.slug), `${locale}/${guide.slug}`).toBe(true)
        const subject = guideSubject(guide.key)
        if (subject) expect(LOCALES.includes(subject), `${locale}/${guide.slug}: ${guide.key}`).toBe(true)
        else expect(GUIDE_TOPICS.includes(guide.key as (typeof GUIDE_TOPICS)[number]), guide.key).toBe(true)
      }
    }
  })

  it('relates every guide to at least two others in its language, never to itself', () => {
    for (const entry of entries) {
      const { locale, guide } = entry
      const keys = new Set((GUIDES[locale] ?? []).map((each) => each.key))
      expect(guide.related.length, label(entry)).toBeGreaterThanOrEqual(2)
      for (const key of guide.related) expect(keys.has(key) && key !== guide.key, `${label(entry)} → ${key}`).toBe(true)
    }
  })

  it('writes about Armenian crosswords in Armenian, and in English for "armenian crossword"', () => {
    expect(GUIDES.hy?.some((guide) => guide.key === 'language-hy')).toBe(true)
    expect(GUIDES.en?.some((guide) => guide.key === 'language-hy')).toBe(true)
  })

  it('gives every language with guides a guide on its own language (English excepted)', () => {
    for (const locale of GUIDE_LOCALES) {
      if (locale === 'en') continue
      expect(GUIDES[locale]?.some((guide) => guide.key === `language-${locale}`), locale).toBe(true)
    }
  })
})

describe('guide search metadata', () => {
  it('keeps titles and descriptions within what results show', () => {
    for (const entry of entries) {
      const { locale, guide } = entry
      expect(width(locale, guide.metaTitle), `${label(entry)} metaTitle`).toBeLessThanOrEqual(60)
      expect(width(locale, guide.title), `${label(entry)} title`).toBeLessThanOrEqual(110)
      expect(width(locale, guide.shortTitle), `${label(entry)} shortTitle`).toBeLessThanOrEqual(50)
      expect(width(locale, guide.description), `${label(entry)} description`).toBeGreaterThanOrEqual(100)
      expect(width(locale, guide.description), `${label(entry)} description`).toBeLessThanOrEqual(160)
    }
  })

  it('gives every guide its own title and description in its language', () => {
    for (const locale of GUIDE_LOCALES) {
      const guides = GUIDES[locale] ?? []
      for (const field of ['title', 'shortTitle', 'metaTitle', 'description'] as const) {
        const values = guides.map((guide) => guide[field])
        expect(new Set(values).size, `${locale} ${field}`).toBe(values.length)
      }
    }
  })

  it('names how people search, Latin-lettered Armenian included', () => {
    for (const entry of entries) {
      const { locale, guide } = entry
      expect(guide.searchTerms.length, label(entry)).toBeGreaterThanOrEqual(3)
      if (locale === 'hy') {
        // Many Armenians type in Latin letters: «hayeren khachbar», «xachbar».
        expect(guide.searchTerms.some((term) => /^[a-z0-9 -]+$/.test(term)), label(entry)).toBe(true)
        expect(guide.latinTitle, label(entry)).toMatch(/^[\x20-\x7E—]+$/)
      }
    }
  })

  it('dates every guide, never updated before it was published', () => {
    for (const entry of entries) {
      const { guide } = entry
      expect(guide.published, label(entry)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(guide.updated, label(entry)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(guide.updated >= guide.published, label(entry)).toBe(true)
    }
  })
})

describe('guide body', () => {
  it('has an intro, at least three sections and three questions', () => {
    for (const entry of entries) {
      const { guide } = entry
      expect(guide.intro.length, label(entry)).toBeGreaterThan(0)
      expect(guide.sections.length, label(entry)).toBeGreaterThanOrEqual(3)
      expect(guide.faq.length, label(entry)).toBeGreaterThanOrEqual(3)
    }
  })

  it('is long enough to be worth a search result', () => {
    for (const entry of entries) {
      expect(wordCount(entry.locale, guideTexts(entry.guide)), label(entry)).toBeGreaterThanOrEqual(600)
    }
  })

  it('anchors sections uniquely, leaving `faq` to the questions', () => {
    for (const entry of entries) {
      const ids = entry.guide.sections.map((section) => section.id)
      expect(new Set(ids).size, label(entry)).toBe(ids.length)
      for (const id of ids) {
        expect(isSlug(id), `${label(entry)} #${id}`).toBe(true)
        expect(id, label(entry)).not.toBe('faq')
      }
    }
  })

  it('links only to public pages of this site in its own language', () => {
    for (const entry of entries) {
      const allowed = linkable(entry.locale)
      for (const href of guideTexts(entry.guide).flatMap(inlineLinks)) {
        expect(allowed.has(href), `${label(entry)} links to ${href}`).toBe(true)
      }
    }
  })

  it('gives sample clues answers a grid could hold: one word in the language', () => {
    for (const entry of entries) {
      for (const section of entry.guide.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'clues') continue
          for (const { answer } of block.items) {
            expect(normalizeWord(answer, entry.locale), `${label(entry)}: «${answer}»`).not.toBeNull()
          }
        }
      }
    }
  })
})

describe('typography', () => {
  const texts = entries.flatMap((entry) => guideTexts(entry.guide).map((text) => ({ page: label(entry), locale: entry.locale, text })))

  it('quotes with the language’s own marks, never straight double quotes', () => {
    for (const { page, text } of texts) expect(text, page).not.toMatch(/"/)
  })

  it('has no stray spaces', () => {
    for (const { page, text } of texts) expect(text, page).not.toMatch(/ {2}|^\s|\s$/)
  })

  describe('Armenian', () => {
    const ARMENIAN_LETTER = 'Ա-և'
    const armenian = texts.filter(({ locale }) => locale === 'hy')

    it('asks questions with ՞ on the word, never ?', () => {
      for (const { guide } of entries.filter(({ locale }) => locale === 'hy')) {
        for (const item of guide.faq) expect(item.question, guide.slug).toMatch(/՞/)
      }
      for (const { page, text } of armenian) expect(text, page).not.toMatch(/\?/)
    })

    it('ends sentences with ։, not a Latin full stop or colon', () => {
      // An abbreviation's full stop is followed by a lowercase word; a sentence end by a capital.
      const fullStop = new RegExp(`[${ARMENIAN_LETTER}]{2,}\\.\\s+[Ա-Ֆ]`)
      const lastStop = new RegExp(`[${ARMENIAN_LETTER}]{2,}\\.$`)
      const colon = new RegExp(`[${ARMENIAN_LETTER}]:`)
      for (const { page, text } of armenian) {
        expect(text, page).not.toMatch(fullStop)
        expect(text, page).not.toMatch(lastStop)
        expect(text, page).not.toMatch(colon)
      }
    })

    it('has no space before Armenian punctuation and no Latin ! after a word', () => {
      for (const { page, text } of armenian) {
        expect(text, page).not.toMatch(/ [,։․՝]/)
        expect(text, page).not.toMatch(new RegExp(`[${ARMENIAN_LETTER}]!`))
      }
    })
  })
})
