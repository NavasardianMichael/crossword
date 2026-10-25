import * as Sentry from '@sentry/nextjs'
import { SENTRY_DSN, SENTRY_ENABLED, SENTRY_ENVIRONMENT, SENTRY_TRACES_SAMPLE_RATE } from '@constants/sentry'

// Runs in the browser before the app becomes interactive.
if (SENTRY_ENABLED) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    integrations: [Sentry.replayIntegration()],
    // Replays only for sessions that hit an error (text and inputs masked by default).
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
