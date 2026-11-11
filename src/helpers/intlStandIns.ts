import type { Locale } from '@i18n/config'

/**
 * Some browsers ship without the Intl data for a language we serve — Chrome has none for
 * Armenian, so `Intl.NumberFormat('hy')` silently formats as English. The server (full ICU)
 * renders "4,99 $" and "2000", the browser renders "$4.99" and "2,000", and hydration fails.
 *
 * Where the browser lacks a language, its numbers and plural rules are taken from a stand-in
 * that follows exactly the same rules — `tests/unit/i18n/intlStandIns.spec.ts` proves each pair
 * against Node's full data. Dates have no stand-in (month names are the language's own), and
 * only data loaded after mount is formatted as a date in the browser.
 */
export const INTL_STAND_INS: Partial<Record<Locale, { number: string; plural: string }>> = {
  // Latvian: decimal comma, a space between thousands from 10 000 on, a hyphen minus, "4,99 $".
  // French: 0 and 1 take the singular (its extra `many`, for millions, falls back to `other`).
  hy: { number: 'lv', plural: 'fr' },
}

type Kind = 'number' | 'plural'
type Locales = string | readonly string[] | undefined

/** The locales to pass on: the first one swapped for its stand-in when the runtime lacks it. */
export const withStandIn = (locales: Locales, kind: Kind, isSupported: (locale: string) => boolean): Locales => {
  const first = typeof locales === 'string' ? locales : locales?.[0]
  if (!first) return locales
  const standIn = INTL_STAND_INS[first.split('-')[0].toLowerCase() as Locale]?.[kind]
  return standIn && !isSupported(first) ? standIn : locales
}

type IntlConstructor = { new (...args: unknown[]): object; supportedLocalesOf: (locales: string[]) => string[] }

/** Wraps `Intl[name]` so the first argument goes through `withStandIn`; statics and `instanceof` still work. */
const patch = (name: 'NumberFormat' | 'PluralRules', kind: Kind) => {
  const native = Intl[name] as unknown as IntlConstructor
  const isSupported = (locale: string) => native.supportedLocalesOf([locale]).length > 0
  const swap = ([locales, ...rest]: unknown[]) => [withStandIn(locales as Locales, kind, isSupported), ...rest]
  Object.defineProperty(Intl, name, {
    configurable: true,
    writable: true,
    value: new Proxy(native, {
      construct: (target, args, newTarget) => Reflect.construct(target, swap(args), newTarget) as object,
      // `Intl.NumberFormat('hy')` without `new` is legal too.
      apply: (target, self, args) => Reflect.apply(target, self, swap(args)) as unknown,
    }),
  })
}

/** Run once in the browser, before hydration (`instrumentation-client.ts`). */
export const installIntlStandIns = () => {
  patch('NumberFormat', 'number')
  patch('PluralRules', 'plural')
}
