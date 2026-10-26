import { lang } from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

/**
 * next-intl's per-request entry point, wired up by `createNextIntlPlugin` in
 * `next.config.ts`.
 *
 * `export default` is the framework contract here — next-intl resolves this
 * module by its default binding — so the repo's named-export preference does not
 * apply, the same exemption `src/app/CLAUDE.md` documents for route modules.
 *
 * The locale comes from the `[lang]` path segment. `next/root-params` (Next
 * 16.3+) exposes segments *above* the root layout to any Server Component
 * without prop drilling, which is exactly what `app/[lang]/layout.tsx` makes
 * `lang` into.
 *
 * `hasLocale` narrows an arbitrary path segment to a supported locale, so
 * `/xx/providers` 404s instead of failing later on a missing catalogue import.
 * The proxy already redirects unprefixed traffic, so an unrecognised value here
 * means someone typed it.
 *
 * **Never destructure `requestLocale` in the parameter list.** It is a lazy getter that
 * reads `headers()`; destructuring evaluates it on every call even when `lang()` already
 * answered, and `headers()` silently opts every page into dynamic rendering — nothing is
 * prerendered. Read `params.requestLocale` only as the fallback. `tests/unit/seo/
 * staticRendering.spec.ts` pins this.
 */
export default getRequestConfig(async (params) => {
  const segment = (await lang()) ?? (await params.requestLocale)
  const locale = hasLocale(routing.locales, segment) ? segment : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
