import { describe, expect, it } from 'vitest'
import { LOCALES } from '@i18n/config'
import { CONTENT_UPDATED_AT, LEGAL_UPDATED_AT } from '@constants/legal'
import { TOPICS } from '@constants/puzzle'
import { INDEXABLE_ROUTES } from '@constants/routes'
import { GUIDES } from '@content/index'
import { GUIDE_LOCALES } from '@content/locales'
import robots from '../../../src/app/robots'
import sitemap from '../../../src/app/sitemap'

describe('sitemap', () => {
  const all = sitemap()
  /** Guides exist in some languages only: tested on their own below. */
  const isGuide = (url: string) => /\/[a-z]{2,3}\/guides(\/|$)/.test(url)
  const entries = all.filter(({ url }) => !isGuide(url))
  const guideEntries = all.filter(({ url }) => isGuide(url))

  it('lists every public page and topic page in every locale', () => {
    expect(entries).toHaveLength((INDEXABLE_ROUTES.length + TOPICS.length) * LOCALES.length)
  })

  it('lists every guide, and the guides hub of every language that has guides', () => {
    const guideCount = Object.values(GUIDES).reduce((sum, guides) => sum + (guides?.length ?? 0), 0)
    expect(guideEntries).toHaveLength(guideCount + GUIDE_LOCALES.length)
  })

  it("gives a guide only its own languages' hreflang, each at its own slug", () => {
    for (const { url, alternates } of guideEntries) {
      const languages = Object.entries(alternates?.languages ?? {}).filter(([code]) => code !== 'x-default')
      expect(languages.some(([, href]) => href === url), url).toBe(true)
      for (const [code, href] of languages) expect(String(href), url).toContain(`/${code}/guides`)
    }
  })

  it('dates a guide by its own updated date', () => {
    for (const [locale, guides] of Object.entries(GUIDES)) {
      for (const guide of guides ?? []) {
        const entry = guideEntries.find(({ url }) => url.endsWith(`/${locale}/guides/${guide.slug}`))
        expect(entry, guide.slug).toBeDefined()
        expect(new Date(entry!.lastModified!).toISOString().slice(0, 10)).toBe(guide.updated)
      }
    }
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

  it('is referenced from robots.txt, which blocks the play shell', () => {
    const rules = robots()
    expect(String(rules.sitemap)).toMatch(/\/sitemap\.xml$/)
    expect(JSON.stringify(rules.rules)).toContain('/*/play')
  })

  it('lets crawlers fetch the linked, noindexed history page, so they see its noindex', () => {
    expect(JSON.stringify(robots().rules)).not.toContain('history')
  })

  it('lists the pricing page', () => {
    expect(entries.some(({ url }) => url.endsWith('/en/credits'))).toBe(true)
  })

  it('lets link-preview bots fetch shared puzzles (they stay out of search through noindex)', () => {
    expect(JSON.stringify(robots().rules)).not.toContain('/p/')
  })
})
