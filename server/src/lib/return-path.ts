/** Paths this server links into the web app. Locale-free: the web proxy adds the language. */

export const PASSWORD_RESET_QUERY = 'token'
export const PASSWORD_RESET_PATH = '/auth/reset-password'
export const FORGOT_PASSWORD_PATH = '/auth/forgot-password'
export const EMAIL_VERIFY_QUERY = 'token'
export const EMAIL_VERIFY_PATH = '/auth/verify-email'
export const RETURN_TO_QUERY = 'returnTo'
export const SIGN_IN_PATH = '/auth/sign-in'
export const HOME_PATH = '/'

const RETURN_BASE = 'https://return-path.invalid'

/**
 * The post-sign-in destination as a clean same-site path, or `undefined` when it would leave the
 * site (callers then use home). The value is resolved exactly as a browser would resolve it —
 * tabs and line breaks dropped, `\` read as `/` — so `/\t/evil.example` is seen as the
 * `//evil.example` it really is and refused, while a path that merely carries such characters
 * is kept, cleaned. Mirrored by `safeReturnPath` in `src/constants/auth.ts`.
 */
export const safeReturnPath = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || value.length > 512) return undefined
  let url: URL
  try {
    url = new URL(value, RETURN_BASE)
  } catch {
    return undefined
  }
  if (url.origin !== RETURN_BASE) return undefined
  // `/.//evil.example` normalises to the path `//evil.example`, which a redirect would read as a host.
  return `/${url.pathname.replace(/^\/+/, '')}${url.search}${url.hash}`
}

export const buildWebUrl = (origin: string, path: string, query: Record<string, string> = {}): string => {
  const url = new URL(path, origin.endsWith('/') ? origin : `${origin}/`)
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value)
  return url.toString()
}
