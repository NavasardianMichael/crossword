import * as Sentry from '@sentry/nextjs'
import { SENTRY_DSN, SENTRY_ENABLED, SENTRY_ENVIRONMENT, SENTRY_TRACES_SAMPLE_RATE } from '@constants/sentry'

/** Server-side Sentry; the app has no edge runtime code. */
export function register() {
  if (!SENTRY_ENABLED || process.env.NEXT_RUNTIME !== 'nodejs') return
  Sentry.init({ dsn: SENTRY_DSN, environment: SENTRY_ENVIRONMENT, tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE })
}

/** Errors thrown while rendering pages or handling routes. */
export const onRequestError = Sentry.captureRequestError
