import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../../src/constants/app'
import { asksForConsent, consentDefaultsScript } from '../../src/helpers/consent'

/** Runs the inline <head> script for a device in `timeZone` and returns its analytics default. */
const headDefault = (timeZone: string | undefined, stored: string | null = null): string => {
  const context: Record<string, unknown> = {
    Intl: { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone }) }) },
    localStorage: { getItem: (key: string) => (key === STORAGE_KEYS.analyticsConsent ? stored : null) },
  }
  context.window = context
  runInNewContext(consentDefaultsScript(), context)
  const [[command, kind, values]] = context.dataLayer as [string, string, Record<string, string>][]
  expect([command, kind]).toEqual(['consent', 'default'])
  expect(values.ad_storage).toBe('denied')
  return values.analytics_storage
}

const ZONES = ['Europe/Berlin', 'Europe/London', 'Europe/Zurich', 'Atlantic/Canary', 'Asia/Nicosia', 'Europe/Oslo',
  'Asia/Yerevan', 'Europe/Moscow', 'America/New_York', 'Asia/Tokyo', 'UTC', 'Etc/GMT+3', undefined]

describe('analytics consent by region', () => {
  it('asks in the EU, EEA, UK and Switzerland, and where the zone is unknown', () => {
    for (const zone of ['Europe/Berlin', 'Europe/London', 'Europe/Zurich', 'Atlantic/Canary', 'Asia/Nicosia', 'Europe/Oslo', 'UTC', 'Etc/GMT+3', undefined, '']) {
      expect(asksForConsent(zone), String(zone)).toBe(true)
    }
  })

  it('does not ask elsewhere', () => {
    for (const zone of ['Asia/Yerevan', 'Europe/Moscow', 'Europe/Kyiv', 'Europe/Istanbul', 'America/New_York', 'Asia/Tokyo']) {
      expect(asksForConsent(zone), zone).toBe(false)
    }
  })

  it('the <head> default matches the banner: denied where it asks, granted elsewhere', () => {
    for (const zone of ZONES) {
      expect(headDefault(zone), String(zone)).toBe(asksForConsent(zone) ? 'denied' : 'granted')
    }
  })

  it('a stored answer wins over the region', () => {
    expect(headDefault('Europe/Berlin', '"granted"')).toBe('granted')
    expect(headDefault('Asia/Yerevan', '"denied"')).toBe('denied')
  })
})
