import { buildPaymentMail, buildUnmatchedMail, type BuyerFacts, type PaymentFacts, type PaymentMailEvent } from './paymentMail.js'
import { config } from '../config.js'
import { type InternalMailPayload, isMailConfigured, sendInternalMail } from '../lib/mail.js'
import { prisma } from '../lib/prisma.js'
import type { CreditPackId } from '../lib/puzzle.js'
import { createRateLimiter } from '../lib/rateLimit.js'
import type { RequestInfo } from '../lib/request-info.js'

/**
 * Tells the admin inbox (the mail engine's internal endpoint) about purchases: a checkout
 * opened or refused, credits added, a refund or chargeback, a payment that needs a hand.
 * Best effort: callers fire and forget, every failure is logged here and nothing is thrown —
 * a notification must never stand between a buyer and their credits, nor fail a webhook.
 */

/**
 * The engine's send budget is shared with verification and password mail. Real buyers come
 * nowhere near this; a script clicking "Buy" would, so past it a click is only logged. Mails
 * about money that moved are never capped.
 */
const startedLimiter = createRateLimiter({ limit: 30, windowMs: 60 * 60 * 1000 })

const loadBuyer = async (userId: string, exceptPaymentId: string | null): Promise<BuyerFacts | null> => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  const paidBefore = await prisma.payment.count({
    where: { userId, status: { in: ['completed', 'refunded'] }, ...(exceptPaymentId ? { id: { not: exceptPaymentId } } : {}) },
  })
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    emailVerified: Boolean(user.emailVerifiedAt),
    signIn: [user.passwordHash && 'password', user.googleId && 'Google'].filter(Boolean).join(' + ') || 'nothing',
    createdAt: user.createdAt,
    credits: user.credits,
    paidBefore,
  }
}

const loadFacts = async (paymentId: string): Promise<PaymentFacts | null> => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
  if (!payment) return null
  const buyer = await loadBuyer(payment.userId, payment.id)
  if (!buyer) return null
  return { payment: { ...payment, sandbox: config.paddle.sandbox }, buyer }
}

/**
 * Sent only in production: a dev machine with the mail engine configured (for verification
 * mail) would otherwise fill the admin inbox with sandbox purchases. Elsewhere it prints.
 */
const deliver = async (payload: InternalMailPayload): Promise<void> => {
  if (config.nodeEnv !== 'production') {
    const lines = Object.entries(payload.details ?? {}).map(([key, value]) => (value === '' ? key : `  ${key}: ${String(value)}`))
    console.log(`[notify] ${payload.subject} (not sent outside production)\n${payload.body}\n${lines.join('\n')}`)
    return
  }
  if (!isMailConfigured()) {
    console.error(`[notify] "${payload.subject}" not sent: MAIL_API_URL or MAIL_API_KEY is empty`)
    return
  }
  const result = await sendInternalMail(payload)
  if (!result.ok) console.error(`[notify] "${payload.subject}" not sent: ${result.status} ${result.message}`)
}

const attempt = async (label: string, send: () => Promise<void>): Promise<void> => {
  try {
    await send()
  } catch (error) {
    console.error(`[notify] ${label} mail failed`, error instanceof Error ? error.message : error)
  }
}

const notify = (event: PaymentMailEvent, paymentId: string, request: RequestInfo | null): Promise<void> =>
  attempt(`${event.kind} (${paymentId})`, async () => {
    if (event.kind === 'started' && !startedLimiter('all').allowed) {
      console.warn(`[notify] checkout mail for ${paymentId} skipped: over the hourly cap`)
      return
    }
    const facts = await loadFacts(paymentId)
    if (facts) await deliver(buildPaymentMail(event, facts, request))
  })

/** Never rejects. */
export const notifyCheckoutStarted = (paymentId: string, request: RequestInfo | null): Promise<void> =>
  notify({ kind: 'started' }, paymentId, request)

/** Never rejects. Paddle refused, so there is no `Payment` row: the facts come from the pack. */
export const notifyCheckoutFailed = (
  userId: string,
  pack: { id: CreditPackId; credits: number; priceId: string },
  reason: string,
  request: RequestInfo | null
): Promise<void> =>
  attempt(`startFailed (${userId})`, async () => {
    if (!startedLimiter('all').allowed) return
    const buyer = await loadBuyer(userId, null)
    if (!buyer) return
    const facts: PaymentFacts = {
      payment: {
        id: null,
        pack: pack.id,
        credits: pack.credits,
        priceId: pack.priceId,
        status: 'not created',
        sandbox: config.paddle.sandbox,
        createdAt: null,
        completedAt: null,
        currency: null,
        total: null,
        tax: null,
        fee: null,
        earnings: null,
        payoutCurrency: null,
        payoutEarnings: null,
        paymentMethod: null,
        refundedCredits: 0,
      },
      buyer,
    }
    await deliver(buildPaymentMail({ kind: 'startFailed', reason }, facts, request))
  })

/** Never rejects. Sent once, by the webhook delivery that moved the payment to `completed`. */
export const notifyCreditsAdded = (paymentId: string): Promise<void> => notify({ kind: 'completed' }, paymentId, null)

/** Never rejects. Sent once per adjustment (`CreditEntry.adjustmentId` is unique). */
export const notifyAdjustment = (
  paymentId: string,
  adjustment: { action: 'refund' | 'chargeback'; adjustmentId: string; back: number; taken: number }
): Promise<void> => notify({ kind: 'adjusted', ...adjustment }, paymentId, null)

const freeCapLimiter = createRateLimiter({ limit: 1, windowMs: 60 * 60 * 1000 })

/**
 * Never rejects. Free credits hit their hourly cap (`billing.ts`): real demand, so raise
 * `FREE_PUZZLES_PER_HOUR`, or a farm, so look at who is claiming them. At most once an hour.
 */
export const notifyFreeCapReached = (recent: number, cap: number): Promise<void> =>
  attempt('free cap', async () => {
    if (!freeCapLimiter('all').allowed) return
    console.warn(`[billing] free credits paused: ${recent} puzzles took them in the last hour, cap ${cap}`)
    await deliver({
      subject: 'Crossword: free credits paused',
      body:
        `${recent} puzzles took free credits in the last hour, reaching the cap of ${cap}. Puzzles that would ` +
        'spend free credits are refused until the hour rolls on; puzzles paid with bought credits are not ' +
        'affected. If this is real demand, raise FREE_PUZZLES_PER_HOUR; if not, look at the FreeSpend rows ' +
        'of the last hour (ipKey) for a farm.',
      details: { recent, cap },
    })
  })

/** Never rejects. A completed transaction the webhook could not credit. */
export const notifyUnmatchedPayment = (transactionId: string, eventId: string, problem: string): Promise<void> =>
  attempt(`unmatched (${transactionId})`, () => deliver(buildUnmatchedMail(transactionId, eventId, problem, config.paddle.sandbox)))
