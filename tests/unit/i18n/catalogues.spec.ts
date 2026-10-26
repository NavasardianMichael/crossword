import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { LOCALES } from '@i18n/config'
import { matchAcceptLanguage } from '@i18n/matchAcceptLanguage'
// A plain .mjs script, shared with the CLI so both run the same checks.
import { checkLocale } from '../../../scripts/check-messages.mjs'

const MESSAGES = path.resolve(__dirname, '../../../src/messages')

describe('locales', () => {
  it('ships English, Russian and Armenian', () => {
    expect([...LOCALES]).toEqual(['en', 'ru', 'hy'])
  })

  it('negotiates real browser headers to a supported locale', () => {
    expect(matchAcceptLanguage('hy-AM,hy;q=0.9,en;q=0.8')).toBe('hy')
    expect(matchAcceptLanguage('ru-RU,ru;q=0.9')).toBe('ru')
    expect(matchAcceptLanguage('ru-KZ')).toBe('ru')
    expect(matchAcceptLanguage('en;q=0.8,hy-AM;q=1.0')).toBe('hy')
    expect(matchAcceptLanguage('de-DE,fr;q=0.9')).toBe('en')
    expect(matchAcceptLanguage(null)).toBe('en')
  })
})

describe('message catalogues', () => {
  it('has a catalogue file for every locale', () => {
    for (const locale of LOCALES) expect(() => readFileSync(path.join(MESSAGES, `${locale}.json`))).not.toThrow()
  })

  it.each(LOCALES.filter((locale) => locale !== 'en'))('%s matches en.json (keys, placeholders, plurals)', (locale) => {
    expect(checkLocale(locale)).toEqual([])
  })
})
