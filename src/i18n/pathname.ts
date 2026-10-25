import { isLocale, type Locale } from './config'

export type SplitPathname = {
  /** `undefined` when the path carries no locale prefix at all. */
  locale?: Locale
  /** The path as `src/constants/routes.ts` declares it, with no locale segment. */
  pathname: string
}

/**
 * Splits `/es/providers/abc` into `{ locale: 'es', pathname: '/providers/abc' }`.
 *
 * Every internal path constant is locale-free, so anything that compares a live
 * URL against `ROUTES` — the proxy's auth guard, `matchRouteName`,
 * `isRouteActive` — has to strip the prefix first. next-intl's `usePathname`
 * does this for client components; this is the same operation for the proxy,
 * which runs before any of that exists.
 */
/**
 * The inverse: a locale-free route path prefixed for one locale.
 *
 * `ROUTES.home` is `'/'`, which would otherwise yield `/en/` — a second URL for
 * the same page, and a redirect hop for anything that follows it.
 *
 * Lives here rather than in `metadata.ts` so JSON-LD builders and the sitemap can
 * use it without pulling in `next/root-params`, which is Server-Component-only.
 */
export const localePath = (locale: Locale, path: string): string => (path === '/' ? `/${locale}` : `/${locale}${path}`)

export const splitLocaleFromPathname = (pathname: string): SplitPathname => {
  const [, maybeLocale, ...rest] = pathname.split('/')

  if (!isLocale(maybeLocale)) return { pathname }

  // '/es' -> '/', not '' — ROUTES.home is '/' and a bare '' matches nothing.
  return { locale: maybeLocale, pathname: `/${rest.join('/')}` }
}
