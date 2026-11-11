import { describe, expect, it } from 'vitest'
import { INTL_STAND_INS, withStandIn } from '@helpers/intlStandIns'

/**
 * A stand-in is only safe if it formats exactly like the language it stands in for — Node has
 * the full ICU data, so the server's output is the reference the browser must reproduce.
 */
const NUMBERS = [0, 1, 4.99, 12, 999, 1000, 2000, 9999, 10000, 12345, 1234567.5, 0.5, -3.25]
const PLURAL_SAMPLES = [...Array.from({ length: 1200 }, (_, n) => n), 0.5, 1.5, 2.5, 1e6, 2e6, 1e7]

const formats = (locale: string) =>
  NUMBERS.flatMap((n) => [
    new Intl.NumberFormat(locale).format(n),
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(n),
    new Intl.NumberFormat(locale, { style: 'percent' }).format(n),
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n),
  ])

describe.each(Object.entries(INTL_STAND_INS))('stand-ins for %s', (locale, standIn) => {
  it('formats numbers identically', () => {
    expect(formats(standIn.number)).toEqual(formats(locale))
  })

  it('picks the same plural form', () => {
    const own = new Intl.PluralRules(locale)
    const other = new Intl.PluralRules(standIn.plural)
    const categories = own.resolvedOptions().pluralCategories
    for (const n of PLURAL_SAMPLES) {
      const picked = other.select(n)
      // A category the language does not have falls back to `other` in a message.
      expect(categories.includes(picked) ? picked : 'other', `${n}`).toBe(own.select(n))
    }
  })
})

describe('withStandIn', () => {
  const lacking = (missing: string) => (locale: string) => locale !== missing

  it('swaps a language the runtime lacks', () => {
    expect(withStandIn('hy', 'number', lacking('hy'))).toBe('lv')
    expect(withStandIn(['hy', 'en'], 'plural', lacking('hy'))).toBe('fr')
  })

  it('leaves a supported or unmapped language alone', () => {
    expect(withStandIn('hy', 'number', () => true)).toBe('hy')
    expect(withStandIn('ru', 'number', lacking('ru'))).toBe('ru')
    expect(withStandIn(undefined, 'number', lacking('hy'))).toBeUndefined()
  })
})
