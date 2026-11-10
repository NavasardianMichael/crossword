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

/** Same rule as the API's `isSafeReturnPath`: a same-site path, never an open redirect. */
export const isSafeReturnPath = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= 512 &&
  value.startsWith('/') &&
  !value.startsWith('//') &&
  !value.startsWith('/\\') &&
  !/[\r\n]/.test(value)
