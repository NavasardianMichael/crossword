import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * next-intl's `requestLocale` is a lazy getter that reads `headers()`. Destructuring it in
 * `getRequestConfig`'s parameter list evaluates it on every render — even though `lang()`
 * from `next/root-params` already answered — and silently turns every page dynamic: the
 * build still succeeds, nothing is prerendered. Nothing else would notice, so this does.
 */
const REQUEST = readFileSync(path.resolve(__dirname, '../../../src/i18n/request.ts'), 'utf8')

describe('static rendering', () => {
  it('reads the locale from next/root-params first', () => {
    expect(REQUEST).toContain('await lang()')
  })

  it('never destructures requestLocale in getRequestConfig', () => {
    expect(REQUEST).not.toMatch(/getRequestConfig\(\s*async\s*\(\s*\{[^}]*requestLocale/)
  })

  it('does not fall back on the deprecated setRequestLocale', () => {
    expect(REQUEST).not.toContain('setRequestLocale')
  })
})
