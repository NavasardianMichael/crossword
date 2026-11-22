import type { Locale } from '@constants/puzzle'
import { guides as cs } from './guides/cs'
import { guides as de } from './guides/de'
import { guides as en } from './guides/en'
import { guides as es } from './guides/es'
import { guides as fr } from './guides/fr'
import { guides as hu } from './guides/hu'
import { guides as hy } from './guides/hy'
import { guides as it } from './guides/it'
import { guides as ja } from './guides/ja'
import { guides as nl } from './guides/nl'
import { guides as pl } from './guides/pl'
import { guides as pt } from './guides/pt'
import { guides as ru } from './guides/ru'
import { guides as sv } from './guides/sv'
import { guides as uk } from './guides/uk'
import type { ContentSection, FaqItem, Guide, GuideKey } from './types'

/**
 * Every guide, per language, in the order the language's hub lists them. Adding a guide: a
 * file named after its slug in `guides/<locale>/`, a line in that folder's `index.ts`, then
 * `pnpm test:unit` — the content tests check the rest. A new language also needs a line here
 * and in `locales.ts`. A push that changes only `src/content/**` deploys through
 * `.github/workflows/content.yml` (docs/DEPLOYMENT.md, "Content").
 */
export const GUIDES: Partial<Record<Locale, readonly Guide[]>> = { en, ru, hy, de, pl, sv, hu, nl, cs, fr, it, es, pt, uk, ja }

export const guidesFor = (locale: Locale): readonly Guide[] => GUIDES[locale] ?? []

export const findGuide = (locale: Locale, slug: unknown): Guide | undefined => guidesFor(locale).find((guide) => guide.slug === slug)

export const guideByKey = (locale: Locale, key: GuideKey): Guide | undefined => guidesFor(locale).find((guide) => guide.key === key)

/** In the given order, keys this language has no guide for left out. */
export const guidesByKey = (locale: Locale, keys: readonly GuideKey[]): Guide[] => keys.flatMap((key) => guideByKey(locale, key) ?? [])

/** The languages a guide is written in, each with its own slug: the page's `hreflang` set. */
export const guideSlugsByLocale = (key: GuideKey): Partial<Record<Locale, string>> =>
  Object.fromEntries(
    (Object.entries(GUIDES) as [Locale, readonly Guide[]][]).flatMap(([locale, guides]) => {
      const guide = guides.find((each) => each.key === key)
      return guide ? [[locale, guide.slug]] : []
    })
  )

/** The language a `language-<locale>` guide is about; `undefined` for the other guides. */
export const guideSubject = (key: GuideKey): Locale | undefined =>
  key.startsWith('language-') ? (key.slice('language-'.length) as Locale) : undefined

/** A section's text, heading included: reading time and the content tests. */
export const sectionTexts = (section: ContentSection): string[] => [
  section.heading,
  ...section.blocks.flatMap((block) => {
    switch (block.kind) {
      case 'p':
      case 'tip':
        return [block.text]
      case 'list':
        return block.items
      case 'compare':
        return [block.weak, block.strong]
      case 'clues':
        return block.items.flatMap(({ clue, answer }) => [clue, answer])
    }
  }),
]

/** Every prose field of a guide, for the content tests. */
export const guideTexts = (guide: Guide): string[] => [
  guide.title,
  guide.shortTitle,
  guide.metaTitle,
  guide.description,
  ...guide.intro,
  ...guide.sections.flatMap(sectionTexts),
  ...guide.faq.flatMap((item) => [item.question, item.answer]),
]

/**
 * Words, as the language divides them: `Intl.Segmenter` splits Japanese, Chinese and Thai
 * too, which write no spaces between words.
 */
export const wordCount = (locale: Locale, texts: readonly string[]): number => {
  const segmenter = new Intl.Segmenter(locale, { granularity: 'word' })
  return texts.reduce((count, text) => count + [...segmenter.segment(text)].filter((segment) => segment.isWordLike).length, 0)
}

const WORDS_PER_MINUTE = 200

export const readingMinutes = (locale: Locale, page: { intro: string[]; sections: ContentSection[]; faq: FaqItem[] }): number => {
  const texts = [...page.intro, ...page.sections.flatMap(sectionTexts), ...page.faq.flatMap((item) => [item.question, item.answer])]
  return Math.max(1, Math.round(wordCount(locale, texts) / WORDS_PER_MINUTE))
}
