import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { config, isGeminiConfigured, isGoogleOAuthConfigured } from './config.js'
import { fail, ok } from './lib/api-response.js'
import { optionalAuth } from './middleware/auth.js'
import { requireSameOrigin } from './middleware/csrf.js'
import { asyncHandler, errorHandler } from './middleware/error.js'
import { billingRouter, paddleWebhookRouter } from './routes/billing.js'
import { contactRouter } from './routes/contact.js'
import { identityRouter } from './routes/identity.js'
import { puzzlesRouter } from './routes/puzzles.js'
import { samplesRouter } from './routes/samples.js'
import { poolSizes } from './services/entryPool.js'

import './types/express.js'

export function createApp() {
  const app = express()

  // Exactly one hop — nginx. Never `true`, which would trust a client-supplied
  // X-Forwarded-For and collapse every IP rate limiter into a spoofable key.
  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  app.use(cors({ origin: config.corsOrigin, credentials: true }))
  // Paddle signs the raw bytes and is not the web app: ahead of the JSON parser and the origin check.
  app.use('/billing/webhook', paddleWebhookRouter)
  // A seen-list of 4,000 ids is about 30 KB of JSON.
  app.use(express.json({ limit: '64kb' }))
  app.use(cookieParser())
  app.use(optionalAuth)
  // Before every router, so no state-changing route can be reached without an origin proof.
  app.use(requireSameOrigin)

  // `gemini` is reported from the server's own config, so the web app decides what to say
  // from one source of truth rather than a mirrored NEXT_PUBLIC_ variable.
  app.get(
    '/health',
    asyncHandler(async (_req, res) => {
      ok(res, { status: 'ok', gemini: isGeminiConfigured(), google: isGoogleOAuthConfigured(), pool: await poolSizes() })
    })
  )

  app.use('/billing', billingRouter)
  app.use('/contact', contactRouter)
  app.use('/identity', identityRouter)
  app.use('/puzzles', puzzlesRouter)
  app.use('/samples', samplesRouter)

  // Answered in the envelope like everything else — Express's default is an HTML page.
  app.use((_req, res) => fail(res, 'Not found', 404, 404))

  app.use(errorHandler)

  return app
}
