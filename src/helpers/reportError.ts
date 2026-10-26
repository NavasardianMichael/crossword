import * as Sentry from '@sentry/nextjs'

/**
 * The one place a deliberate silence goes. Logged in development, sent to Sentry in
 * production (a no-op while Sentry is off). `silent` skips Sentry for expected failures
 * such as being offline.
 */
export const reportError = (error: unknown, context: string, options: { silent?: boolean } = {}): void => {
  if (process.env.NODE_ENV !== 'production') console.warn(`[${context}]`, error)
  if (!options.silent) Sentry.captureException(error, { tags: { context } })
}
