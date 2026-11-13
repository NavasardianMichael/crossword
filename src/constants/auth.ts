/** The API's session cookie. The browser sends it; script never reads it. */
export const SESSION_COOKIE = 'crossword-session'

export const RETURN_TO_QUERY = 'returnTo'
export const RESET_TOKEN_QUERY = 'token'
export const VERIFY_TOKEN_QUERY = 'token'
export const VERIFIED_QUERY = 'verified'

/** Mirrors `PASSWORD_POLICY` in `server/src/lib/password.ts`. */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128

/** Envelope codes from `server/src/lib/auth-codes.ts`. */
export const AUTH_CODE = {
  weakPassword: 4001,
  verifyTokenInvalid: 4002,
  resetTokenInvalid: 4003,
  invalidCredentials: 4011,
  googleOnlyAccount: 4012,
  emailNotVerified: 4031,
  emailTaken: 4091,
} as const

export const GOOGLE_ERRORS = ['google_unavailable', 'google_denied', 'google_failed', 'google_email_unverified'] as const
export type GoogleErrorCode = (typeof GOOGLE_ERRORS)[number]

export const isGoogleError = (value: unknown): value is GoogleErrorCode =>
  typeof value === 'string' && (GOOGLE_ERRORS as readonly string[]).includes(value)

const RETURN_BASE = 'https://return-path.invalid'

/**
 * The post-sign-in destination as a clean same-site path, or `undefined` when it would leave the
 * site (callers then use home). Same rule as the API's `safeReturnPath`
 * (`server/src/lib/return-path.ts`): resolved as a browser would, so a hidden tab or `\` cannot
 * turn it into another host, and a path that merely carries them is kept, cleaned.
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
