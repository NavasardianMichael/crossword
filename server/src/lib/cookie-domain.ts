/**
 * The session cookie's `Domain`. Empty means host-only.
 *
 * Dev serves the web and the API from different ports of `localhost`; cookies ignore ports,
 * so a host-only cookie already covers both. In production the web hostname covers itself
 * and `api.` under it. A `Domain` of `localhost` is rejected by browsers.
 */
export const deriveCookieDomain = (nodeEnv: string, corsOrigin: string): string => {
  if (nodeEnv !== 'production') return ''

  try {
    const { hostname } = new URL(corsOrigin)
    return hostname.includes('.') ? hostname : ''
  } catch {
    return ''
  }
}
