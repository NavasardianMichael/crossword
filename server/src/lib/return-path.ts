/** Paths this server links into the web app. Locale-free: the web proxy adds the language. */

export const PASSWORD_RESET_QUERY = 'token'
export const PASSWORD_RESET_PATH = '/auth/reset-password'
export const FORGOT_PASSWORD_PATH = '/auth/forgot-password'
export const EMAIL_VERIFY_QUERY = 'token'
export const EMAIL_VERIFY_PATH = '/auth/verify-email'
export const RETURN_TO_QUERY = 'returnTo'
export const SIGN_IN_PATH = '/auth/sign-in'
export const HOME_PATH = '/'

/**
 * A post-sign-in destination is a same-site path only. `//evil.example` and an absolute URL
 * are refused, so `returnTo` cannot be an open redirect.
 */
export const isSafeReturnPath = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= 512 &&
  value.startsWith('/') &&
  !value.startsWith('//') &&
  !value.startsWith('/\\') &&
  !/[\r\n]/.test(value)

export const buildWebUrl = (origin: string, path: string, query: Record<string, string> = {}): string => {
  const url = new URL(path, origin.endsWith('/') ? origin : `${origin}/`)
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value)
  return url.toString()
}
