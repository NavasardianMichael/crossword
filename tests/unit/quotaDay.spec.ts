import { describe, expect, it } from 'vitest'
import { quotaDayStart } from '../../server/src/services/entryPool.js'

// Google resets the free tier's daily quota at midnight Pacific time.
describe('quotaDayStart', () => {
  it('starts the quota day at midnight Pacific in summer (UTC−7)', () => {
    expect(quotaDayStart(new Date('2026-07-01T10:00:00.250Z')).toISOString()).toBe('2026-07-01T07:00:00.000Z')
  })

  it('starts the quota day at midnight Pacific in winter (UTC−8)', () => {
    expect(quotaDayStart(new Date('2026-01-15T05:30:00Z')).toISOString()).toBe('2026-01-14T08:00:00.000Z')
  })

  it('is the moment itself at Pacific midnight', () => {
    expect(quotaDayStart(new Date('2026-11-13T08:00:00Z')).toISOString()).toBe('2026-11-13T08:00:00.000Z')
  })
})
