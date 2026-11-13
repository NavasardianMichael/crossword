import { createApp } from './app.js'
import { config } from './config.js'
import { startPoolRefillJob } from './jobs/poolRefill.js'
import { prisma } from './lib/prisma.js'

/** systemd's TimeoutStopSec is 30 s; whatever is still running after this is cut. */
const SHUTDOWN_GRACE_MS = 20_000

const app = createApp()
let stopRefill: () => Promise<void> = async () => {}

const server = app.listen(config.port, config.host, () => {
  console.log(`Crossword API (${config.nodeEnv}) listening on http://${config.host}:${config.port}`)
  // Test-only switches: say so loudly, since a shell variable left over from an e2e run would
  // otherwise make every puzzle quietly free, or every limit quietly gone.
  if (!config.billing.enabled) console.warn('[api] BILLING_ENABLED=false: puzzles are built without charging any credits (e2e only)')
  if (!config.rateLimitEnabled) console.warn('[api] RATE_LIMIT_ENABLED=false: every rate limit is off (tests only)')
  // Here rather than in `createApp`, so tests that build the app never poll.
  stopRefill = startPoolRefillJob()
})

/**
 * A deploy restarts the service: stop taking connections, let the requests in flight finish
 * (a puzzle that was just charged must still reach its player) and the refill tick log its
 * Gemini calls, then let go of the database.
 */
let shuttingDown = false
const shutdown = (signal: NodeJS.Signals) => {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[api] ${signal}: finishing in-flight requests`)
  setTimeout(() => {
    console.warn(`[api] still busy after ${SHUTDOWN_GRACE_MS / 1000} s, exiting`)
    process.exit(1)
  }, SHUTDOWN_GRACE_MS).unref()

  const closed = new Promise<void>((resolve) => server.close(() => resolve()))
  server.closeIdleConnections()
  void Promise.all([closed, stopRefill()])
    .then(() => prisma.$disconnect())
    .then(
      () => process.exit(0),
      (error: unknown) => {
        console.error('[api] shutdown', error)
        process.exit(1)
      }
    )
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
