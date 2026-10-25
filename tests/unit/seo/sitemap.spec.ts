import { describe, expect, it } from 'vitest'
import { LOCALES } from '@i18n/config'
import { CONTENT_UPDATED_AT, LEGAL_UPDATED_AT } from '@constants/legal'
import { TOPICS } from '@constants/puzzle'
import { INDEXABLE_ROUTES } from '@constants/routes'
import robots from '../../../src/app/robots'
import sitemap from '../../../src/app/sitemap'

describe('sitemap', () => {
  const entries = sitemap()

  it('lists every public page and topic page in every locale', () => {
    expect(entries).toHaveLength((INDEXABLE_ROUTES.length + TOPICS.length) * LOCALES.length)
  })

  it('gives every entry the full hreflang set, plus x-default', () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {}
      expect(Object.keys(languages)).toHaveLength(LOCALES.length + 1)
      expect(String(languages['x-default' as keyof typeof languages])).toMatch(/\/en(\/|$)/)
    }
  })

  it('dates entries by when the copy changed, not by the build', () => {
    for (const { url, lastModified } of entries) {
      const expected = /\/(privacy|terms)$/.test(url) ? LEGAL_UPDATED_AT : CONTENT_UPDATED_AT
      expect(new Date(lastModified!).getTime()).toBe(expected.getTime())
    }
  })

  it('lists the FAQ page', () => {
    expect(entries.some(({ url }) => url.endsWith('/hy/faq'))).toBe(true)
  })

  it('never lists personal pages', () => {
    // Anchored at the locale segment: the history *topic* (/topics/history) is public.
    expect(entries.some(({ url }) => /\/[a-z]{2}\/(history|play|p\/[^/]+)$/.test(url))).toBe(false)
  })

  it('is referenced from robots.txt, which blocks the play shell and history', () => {
    const rules = robots()
    expect(String(rules.sitemap)).toMatch(/\/sitemap\.xml$/)
    expect(JSON.stringify(rules.rules)).toContain('/*/play')
    expect(JSON.stringify(rules.rules)).toContain('/*/history')
  })

  it('lets link-preview bots fetch shared puzzles (they stay out of search through noindex)', () => {
    expect(JSON.stringify(robots().rules)).not.toContain('/p/')
  })
})
