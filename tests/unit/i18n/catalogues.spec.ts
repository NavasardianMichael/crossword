import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { LOCALES } from '@i18n/config'
import { matchAcceptLanguage } from '@i18n/matchAcceptLanguage'
// A plain .mjs script, shared with the CLI so both run the same checks.
import { checkLocale } from '../../../scripts/check-messages.mjs'

const MESSAGES = path.resolve(__dirname, '../../../src/messages')

describe('locales', () => {
  it('ships a native catalogue for every puzzle language', () => {
    expect(LOCALES).toContain('en')
    expect(LOCALES).toContain('ru')
    expect(LOCALES).toContain('hy')
    expect(LOCALES).toContain('es')
    expect(LOCALES).toContain('mr')
    expect(LOCALES).not.toContain('tr')
  })

  it('negotiates real browser headers to a supported locale', () => {
    expect(matchAcceptLanguage('hy-AM,hy;q=0.9,en;q=0.8')).toBe('hy')
    expect(matchAcceptLanguage('ru-RU,ru;q=0.9')).toBe('ru')
    expect(matchAcceptLanguage('ru-KZ')).toBe('ru')
    expect(matchAcceptLanguage('en;q=0.8,hy-AM;q=1.0')).toBe('hy')
    expect(matchAcceptLanguage('es-MX,es;q=0.9')).toBe('es')
    expect(matchAcceptLanguage('pt-BR')).toBe('pt')
    expect(matchAcceptLanguage('zh-CN,zh;q=0.9')).toBe('zh')
    expect(matchAcceptLanguage('tl-PH,tl;q=0.9')).toBe('fil')
    expect(matchAcceptLanguage('da-DK,fi;q=0.9')).toBe('en')
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
