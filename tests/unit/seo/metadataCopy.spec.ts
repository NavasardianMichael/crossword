import type English from '@messages/en.json'
import { createTranslator } from 'next-intl'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { type Locale, LOCALES } from '@i18n/config'
import { TOPICS } from '@constants/puzzle'

/**
 * Search snippets in every language. Google cuts a title at about 600 px and a description at
 * about 160 Latin characters; past that the snippet ends in "…" or Google writes its own. Width
 * is counted in graphemes, a Chinese, Japanese or Korean one counting twice (it is about twice
 * as wide). A page title gets ` | {appName}` from the layout template, so it is budgeted
 * without it: if anything is cut, it is the brand.
 */
const MESSAGES = path.resolve(__dirname, '../../../src/messages')

const WIDE = new Set<Locale>(['zh', 'ja', 'ko'])

const TITLE_MAX = 50
const HOME_TITLE_MAX = 65
const DESCRIPTION_MIN = 70
const DESCRIPTION_MAX = 160
/** A topic page's description ends with the topic's own one-line description. */
const TOPIC_DESCRIPTION_MAX = 175

/** Pages whose `Seo.<key>Title` and `Seo.<key>Description` are their search snippet. */
const PAGES = ['crossword', 'scanword', 'topics', 'rules', 'faq', 'about', 'credits', 'contact'] as const

const messagesFor = (locale: Locale) =>
  JSON.parse(readFileSync(path.join(MESSAGES, `${locale}.json`), 'utf8')) as typeof English

const width = (locale: Locale, text: string) => {
  const graphemes = [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(text)].length
  return WIDE.has(locale) ? graphemes * 2 : graphemes
}

describe.each(LOCALES)('%s search snippets', (locale) => {
  const messages = messagesFor(locale)
  const t = createTranslator({ locale, messages })
  const topicName = (topic: (typeof TOPICS)[number]) => t(`Topics.${topic}.name`)

  it('keeps the home title and description within budget', () => {
    expect(width(locale, t('Seo.homeTitle'))).toBeLessThanOrEqual(HOME_TITLE_MAX)
    expect(width(locale, t('Seo.homeDescription'))).toBeGreaterThanOrEqual(DESCRIPTION_MIN)
    expect(width(locale, t('Seo.homeDescription'))).toBeLessThanOrEqual(DESCRIPTION_MAX)
  })

  it.each(PAGES)('keeps the %s page title and description within budget', (page) => {
    expect(width(locale, t(`Seo.${page}Title`))).toBeLessThanOrEqual(TITLE_MAX)
    expect(width(locale, t(`Seo.${page}Description`))).toBeGreaterThanOrEqual(DESCRIPTION_MIN)
    expect(width(locale, t(`Seo.${page}Description`))).toBeLessThanOrEqual(DESCRIPTION_MAX)
  })

  it('keeps every topic page title and description within budget', () => {
    for (const topic of TOPICS) {
      const name = topicName(topic)
      const description = t('Seo.topicDescription', { topic: name, description: t(`Topics.${topic}.description`) })
      expect(width(locale, t('Seo.topicTitle', { topic: name }))).toBeLessThanOrEqual(TITLE_MAX)
      expect(width(locale, description)).toBeLessThanOrEqual(TOPIC_DESCRIPTION_MAX)
    }
  })

  it('names only its own topic on a topic page', () => {
    // Each topic page says what it is about. A template listing other topics would put the
    // same keywords on all twelve, and Google's spam policies call that keyword stuffing.
    const templates = [messages.Seo.topicTitle, messages.Seo.topicDescription].map((template) =>
      template.replace(/\{[a-z]+\}/g, ' ').toLocaleLowerCase(locale)
    )
    for (const topic of TOPICS) {
      const name = topicName(topic).toLocaleLowerCase(locale)
      for (const template of templates) expect(template, `"${name}" in a topic template`).not.toContain(name)
    }
  })

  it('gives every page its own title', () => {
    const titles = [
      t('Seo.homeTitle'),
      ...PAGES.map((page) => t(`Seo.${page}Title`)),
      ...TOPICS.map((topic) => t('Seo.topicTitle', { topic: topicName(topic) })),
    ]
    expect(new Set(titles).size).toBe(titles.length)
  })
})
