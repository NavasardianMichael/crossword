import { describe, expect, it } from 'vitest'
import { LOCALES } from '@i18n/config'
import { TOPICS } from '@constants/puzzle'
import { INDEXABLE_ROUTES } from '@constants/routes'
import robots from '../../../src/app/robots'
import sitemap from '../../../src/app/sitemap'

describe('sitemap', () => {
  const entries = sitemap()

  it('lists every public page and topic page in every locale', () => {
    expect(entries).toHaveLength((INDEXABLE_ROUTES.length + TOPICS.length) * LOCALES.length)
  })

  it('gives every entry the full hreflang set', () => {
    for (const entry of entries) expect(Object.keys(entry.alternates?.languages ?? {})).toHaveLength(LOCALES.length)
  })

  it('never lists personal pages', () => {
    // Anchored at the locale segment: the history *topic* (/topics/history) is public.
    expect(entries.some(({ url }) => /\/[a-z]{2}\/(history|play|p\/[^/]+)$/.test(url))).toBe(false)
  })

  it('is referenced from robots.txt, which blocks puzzles and history', () => {
    const rules = robots()
    expect(String(rules.sitemap)).toMatch(/\/sitemap\.xml$/)
    expect(JSON.stringify(rules.rules)).toContain('/*/p/')
    expect(JSON.stringify(rules.rules)).toContain('/*/history')
  })
})
