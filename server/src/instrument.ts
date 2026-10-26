import * as Sentry from '@sentry/node'
import { config } from './config.js'

/**
 * Imported first by `index.ts`, so Sentry wraps Express before it is loaded. Off while
 * `SENTRY_DSN_API` is empty, which is how local dev and tests run.
 */
if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.nodeEnv,
    tracesSampleRate: config.nodeEnv === 'production' ? 0.1 : 1,
  })
}
