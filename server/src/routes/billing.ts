import express, { Router } from 'express'
import { fail, ok } from '../lib/api-response.js'
import { verifyWebhookSignature } from '../lib/paddle.js'
import { payerOf } from '../lib/payer.js'
import { isCreditPackId, isLocale } from '../lib/puzzle.js'
import { requireAuth, sessionOf } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/error.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { billingStatus, listPacks, type PaddleEvent, paymentStatus, receiveWebhook, startCheckout } from '../services/billing.js'

export const billingRouter = Router()

const PADDLE_TRANSACTION_ID = /^txn_[a-z0-9]{26}$/

/** GET /billing — the balance and this month's free puzzle, for the account or this guest device. */
billingRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    ok(res, await billingStatus(payerOf(req, res)))
  })
)

/** GET /billing/packs — the credit packs, priced by Paddle for the visitor's country when it can. */
billingRouter.get(
  '/packs',
  rateLimit('packs', { limit: 30, windowMs: 60_000 }),
  asyncHandler(async (req, res) => {
    ok(res, await listPacks(req.ip))
  })
)

/** POST /billing/checkout — `{ pack, locale }`: a Paddle checkout for one pack. Signed in only. */
billingRouter.post(
  '/checkout',
  requireAuth,
  rateLimit('checkout', { limit: 10, windowMs: 60 * 60 * 1000 }),
  asyncHandler(async (req, res) => {
    const { pack, locale } = req.body ?? {}
    if (!isCreditPackId(pack)) return fail(res, 'Unsupported pack', 400)
    if (!isLocale(locale)) return fail(res, 'Unsupported locale', 400)
    ok(res, await startCheckout(sessionOf(req).userId, pack, locale), 201)
  })
)

/** GET /billing/payments/:id — a payment's status, for the page that waits for the webhook. */
billingRouter.get(
  '/payments/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params
    if (typeof id !== 'string' || !PADDLE_TRANSACTION_ID.test(id)) return fail(res, 'Invalid payment id', 400, 400)
    const status = await paymentStatus(sessionOf(req).userId, id)
    if (!status) return fail(res, 'Payment not found', 404, 404)
    res.setHeader('Cache-Control', 'no-store')
    ok(res, status)
  })
)

export const paddleWebhookRouter = Router()

/**
 * POST /billing/webhook — Paddle's notifications. Mounted before the JSON parser (the signature
 * covers the raw bytes) and before the origin check (Paddle is not the web app). Anything but a
 * 2xx makes Paddle redeliver.
 */
paddleWebhookRouter.post(
  '/',
  express.raw({ type: '*/*', limit: '1mb' }),
  asyncHandler(async (req, res) => {
    const raw = req.body as unknown
    if (!Buffer.isBuffer(raw) || !raw.length) return fail(res, 'Missing body', 400, 400)
    if (!verifyWebhookSignature(raw, req.get('paddle-signature') ?? '')) {
      console.warn('[paddle] webhook refused: invalid signature')
      return fail(res, 'Invalid signature', 401, 401)
    }

    let event: PaddleEvent
    try {
      event = JSON.parse(raw.toString('utf8')) as PaddleEvent
    } catch {
      return fail(res, 'Malformed JSON', 400, 400)
    }
    await receiveWebhook(event)
    ok(res, null)
  })
)
