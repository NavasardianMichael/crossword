'use server'

import { cookies } from 'next/headers'
import { isLocale, type Locale, LOCALE_COOKIE } from './config'

/** A year. The choice is a preference, not a session — it should outlive the tab. */
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/**
 * Persists an explicit language choice.
 *
 * `src/proxy.ts` reads the cookie for unprefixed URLs, so the choice sticks for the
 * next visit to `/`; the switcher also navigates to the new prefix itself. It is not
 * `httpOnly`: nothing here is a secret, and a future client-side read is
 * legitimate. `sameSite: 'lax'` keeps it on top-level navigations without
 * exposing it to cross-site requests.
 *
 * Validates rather than trusting its argument: this is a server entry point that
 * anything on the network can call, and an unchecked value would flow straight
 * into a dynamic `import()` in `request.ts`.
 */
export const setLocale = async (locale: Locale): Promise<void> => {
  if (!isLocale(locale)) return

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
  })
}
