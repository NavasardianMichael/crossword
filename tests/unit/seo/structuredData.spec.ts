import en from '@messages/en.json'
import hy from '@messages/hy.json'
import { describe, expect, it } from 'vitest'
import { LOCALES } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { CONTENT_UPDATED_AT } from '@constants/legal'
import { TOPICS } from '@constants/puzzle'
import { INDEXABLE_ROUTES, ROUTES, topicPath } from '@constants/routes'
import { buildLlmsFullTxt, buildLlmsTxt } from '@helpers/llms'
import { absoluteUrl } from '@helpers/url'
import { collectionPageSchema, faqSchema, howToSchema } from '@linkedDataSchema/index'

const page = {
  locale: 'hy' as const,
  name: 'Name',
  description: 'About it',
  path: ROUTES.rules,
  dateModified: CONTENT_UPDATED_AT,
}

describe('JSON-LD builders', () => {
  it('numbers HowTo steps and points at the locale page', () => {
    const schema = howToSchema(page, [
      { title: 'One', text: 'First' },
      { title: 'Two', text: 'Second' },
    ])
    expect(schema.url).toBe(absoluteUrl('/hy/rules'))
    expect(schema.inLanguage).toBe('hy')
    expect(schema.dateModified).toBe(CONTENT_UPDATED_AT.toISOString())
    expect(schema.step).toMatchObject([
      { '@type': 'HowToStep', position: 1, name: 'One', text: 'First' },
      { '@type': 'HowToStep', position: 2, name: 'Two', text: 'Second' },
    ])
  })

  it('lists collection items with absolute, locale-prefixed URLs', () => {
    const schema = collectionPageSchema({ ...page, path: ROUTES.topics }, [
      { name: 'Animals', path: topicPath('animals') },
    ])
    expect(schema.mainEntity).toMatchObject({
      numberOfItems: 1,
      itemListElement: [{ position: 1, name: 'Animals', url: absoluteUrl('/hy/topics/animals') }],
    })
  })

  it('names the FAQ page only when it is a page of its own', () => {
    const items = [{ question: 'Q?', answer: 'A.' }]
    expect(faqSchema(items)).not.toHaveProperty('url')
    expect(
      faqSchema(items, { locale: 'en', name: 'FAQ', path: ROUTES.faq, dateModified: CONTENT_UPDATED_AT })
    ).toMatchObject({
      url: absoluteUrl('/en/faq'),
      mainEntity: [{ '@type': 'Question', name: 'Q?', acceptedAnswer: { text: 'A.' } }],
    })
  })
})

describe('llms.txt', () => {
  const summary = buildLlmsTxt()
  const full = buildLlmsFullTxt()

  it('links every indexable page in every language, except the legal ones listed once', () => {
    const paths = [
      ...INDEXABLE_ROUTES.filter((key) => key !== 'privacy' && key !== 'terms').map((key) => ROUTES[key]),
      ...TOPICS.map(topicPath),
    ]
    for (const locale of LOCALES) {
      for (const path of paths) expect(summary).toContain(`(${absoluteUrl(localePath(locale, path))})`)
    }
  })

  it('carries every FAQ answer, in English and in Armenian', () => {
    for (const messages of [en, hy]) {
      for (const { items } of messages.Faq.groups) {
        for (const { question, answer } of items) {
          expect(full).toContain(question)
          expect(full).toContain(answer)
        }
      }
    }
  })

  it('states facts from the constants, never placeholders', () => {
    expect(summary).toContain(`${TOPICS.length} topics`)
    expect(summary).not.toMatch(/\{[a-z]+\}/)
    expect(full).not.toMatch(/\{[a-z]+\}/)
  })
})
