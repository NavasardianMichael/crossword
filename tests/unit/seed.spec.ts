import { describe, expect, it } from 'vitest'
import { checkLocale } from '../../server/prisma/check-seed'
import { LOCALES } from '../../server/src/lib/puzzle'

/**
 * Every language's seed words — hand-written and Claude-written — pass the same validation as
 * generated words, appear once, and (once there are enough Claude-written ones) keep the balance
 * of lengths, topics, difficulties and starting letters the layouts need (`prisma/check-seed.ts`).
 */
describe('seed words', () => {
  it.each([...LOCALES])('%s passes the seed checker', async (locale) => {
    expect(await checkLocale(locale, { quiet: true })).toEqual([])
  })
})
