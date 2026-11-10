/**
 * Error reporting for the web app, shared by the browser (`instrumentation-client.ts`) and
 * Next's own server (`instrumentation.ts`). The API has no Sentry. `NEXT_PUBLIC_SENTRY_DSN` is
 * inlined at build time, so an empty one — local dev, CI — leaves Sentry off everywhere.
 *
 * Errors only: no tracing and no session replay, and no default PII.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ?? ''

export const sentryOptions = {
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NODE_ENV,
  sendDefaultPii: false,
} as const
