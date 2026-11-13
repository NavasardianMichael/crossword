import type { Prisma } from '@prisma/client'
import {
  notifyAdjustment,
  notifyCheckoutFailed,
  notifyCheckoutStarted,
  notifyCreditsAdded,
  notifyFreeCapReached,
  notifyUnmatchedPayment,
} from './paymentNotifications.js'
import { config, isPaddleConfigured } from '../config.js'
import { type CreatedTransaction, createTransaction, PaddleError, previewPrices } from '../lib/paddle.js'
import type { Payer } from '../lib/payer.js'
import { prisma } from '../lib/prisma.js'
import { BILLING_CODE, CREDIT_PACKS, type CreditPackId, FREE_MONTHLY_CREDITS, type Locale } from '../lib/puzzle.js'
import type { RequestInfo } from '../lib/request-info.js'
import { HttpError } from '../middleware/error.js'

/**
 * Credits: the monthly free ones and the bought ones (`docs/BILLING.md`).
 *
 * - Every holder — a guest device, an account — gets `FREE_MONTHLY_CREDITS` each calendar month.
 *   They are spent first, never carry over, and live in their own ledger, `FreeSpend`: one row per
 *   puzzle that took some. A guest device counts only while its address has fewer than
 *   `guestFreePerIp` guest devices spending this month.
 * - Bought credits are `User.credits`. Every change is one `CreditEntry` row written in the same
 *   transaction as the update, so the ledger always adds up to the balance.
 * - A puzzle is charged inside the transaction that stores it: free credits first, bought ones for
 *   the rest. A refused charge stores nothing.
 * - Purchases are Paddle transactions. The webhook stores each event raw (`PaymentEvent`), then
 *   applies it once — the status guard on `Payment` makes a redelivery a no-op.
 * - The admin hears of every checkout, purchase, refund and chargeback, and of a payment that
 *   could not be credited (`paymentNotifications.ts`), fire and forget.
 */

type Db = Prisma.TransactionClient

const isUser = (payer: Payer): payer is { userId: string; ipKey: string } => 'userId' in payer

const holderOf = (payer: Payer): string => (isUser(payer) ? `user:${payer.userId}` : `guest:${payer.guestId}`)

/** The UTC calendar month free credits belong to: `2026-11`. */
export const monthOf = (date = new Date()): string => date.toISOString().slice(0, 7)

const nextMonthStart = (date = new Date()): Date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))

/** This month's free credits the payer has left. */
const freeLeft = async (db: Db, payer: Payer, month: string): Promise<number> => {
  const holder = holderOf(payer)
  const { _sum } = await db.freeSpend.aggregate({ where: { month, holder }, _sum: { amount: true } })
  const spent = _sum.amount ?? 0
  // A guest device that has not spent yet: clearing cookies must not mint endless free credits.
  if (!isUser(payer) && spent === 0) {
    const devices = await db.freeSpend.findMany({
      where: { month, ipKey: payer.ipKey, holder: { startsWith: 'guest:' } },
      distinct: ['holder'],
      select: { holder: true },
    })
    if (devices.length >= config.billing.guestFreePerIp) return 0
  }
  return Math.max(0, FREE_MONTHLY_CREDITS - spent)
}

/**
 * Charges for one holder run one at a time — and a guest's, one at a time per address — so two
 * puzzles built at once cannot both spend the same free credits. Released with the transaction.
 */
const lockHolder = async (tx: Db, payer: Payer): Promise<void> => {
  if (!isUser(payer)) await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`address:${payer.ipKey}`}))`
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${holderOf(payer)}))`
}

export type BillingStatus = {
  signedIn: boolean
  /** Bought credits. They never expire. */
  credits: number
  /** This month's free credits left, spent before `credits`. */
  freeCredits: number
  /** When the free credits are renewed: the first of next month, UTC. */
  freeResetsAt: string
  /** Packs can be bought: Paddle is configured. */
  shopOpen: boolean
}

export const billingStatus = async (payer: Payer): Promise<BillingStatus> => {
  const user = isUser(payer) ? await prisma.user.findUnique({ where: { id: payer.userId }, select: { credits: true } }) : null
  return {
    signedIn: isUser(payer),
    credits: user?.credits ?? 0,
    freeCredits: await freeLeft(prisma, payer, monthOf()),
    freeResetsAt: nextMonthStart().toISOString(),
    shopOpen: isPaddleConfigured(),
  }
}

const signInRequired = () => new HttpError(402, 'Not enough free credits for this puzzle: sign in', BILLING_CODE.signInRequired)
const insufficientCredits = () => new HttpError(402, 'Not enough credits', BILLING_CODE.insufficientCredits)
const freeBusy = () => new HttpError(429, 'Free credits are paused for a while', BILLING_CODE.freeBusy)

const FREE_WINDOW_MS = 60 * 60 * 1000

/**
 * The global brake on free credits: past `freePuzzlesPerHour` puzzles that took some in the last
 * hour, a puzzle that would spend free credits is refused — never silently paid with bought ones
 * instead — until the hour rolls on. Counted from `FreeSpend` rows, so a restart does not reset
 * it. A puzzle paid wholly with bought credits never passes through here.
 */
const assertFreeOpen = async (db: Db): Promise<void> => {
  const recent = await db.freeSpend.count({ where: { createdAt: { gte: new Date(Date.now() - FREE_WINDOW_MS) } } })
  if (recent < config.billing.freePuzzlesPerHour) return
  void notifyFreeCapReached(recent, config.billing.freePuzzlesPerHour)
  throw freeBusy()
}

/**
 * How a puzzle will be paid: wholly with free credits, or partly with bought ones. Decides how
 * much of the Gemini budget its build may spend.
 */
export type PaymentKind = 'free' | 'credits'

/** Splits a price into the free credits it takes and the bought credits it still needs. */
const split = (price: number, free: number) => {
  const fromFree = Math.min(price, free)
  return { fromFree, fromBought: price - fromFree }
}

/** Before the (slow) build: refuse early what the charge would refuse anyway. */
export const assertCanPay = async (payer: Payer, price: number): Promise<PaymentKind> => {
  const { fromFree, fromBought } = split(price, await freeLeft(prisma, payer, monthOf()))
  if (fromBought > 0) {
    if (!isUser(payer)) throw signInRequired()
    const user = await prisma.user.findUnique({ where: { id: payer.userId }, select: { credits: true } })
    if ((user?.credits ?? 0) < fromBought) throw insufficientCredits()
  }
  if (fromFree > 0) await assertFreeOpen(prisma)
  return fromBought > 0 ? 'credits' : 'free'
}

/**
 * Pays for a puzzle inside the transaction that stores it: this month's free credits first, bought
 * credits for the rest. Throws a 402 — rolling the puzzle back — when the two do not cover it.
 */
export const chargeForPuzzle = async (tx: Db, payer: Payer, price: number, puzzleId: string): Promise<void> => {
  const month = monthOf()
  await lockHolder(tx, payer)
  const { fromFree, fromBought } = split(price, await freeLeft(tx, payer, month))
  if (fromBought > 0 && !isUser(payer)) throw signInRequired()

  if (fromFree > 0) {
    await assertFreeOpen(tx)
    await tx.freeSpend.create({ data: { month, holder: holderOf(payer), ipKey: payer.ipKey, puzzleId, amount: fromFree } })
  }
  if (fromBought === 0 || !isUser(payer)) return

  const rows = await tx.$queryRaw<{ credits: number }[]>`
    UPDATE "User" SET "credits" = "credits" - ${fromBought}, "updatedAt" = NOW()
    WHERE "id" = ${payer.userId} AND "credits" >= ${fromBought}
    RETURNING "credits"`
  if (!rows[0]) throw insufficientCredits()
  await tx.creditEntry.create({
    data: { userId: payer.userId, delta: -fromBought, balanceAfter: rows[0].credits, reason: 'generation', puzzleId },
  })
}

// --- Packs and checkout ---------------------------------------------------------------------

export type PackView = {
  id: CreditPackId
  credits: number
  usd: number
  /** Paddle's price for this visitor — their currency, tax included. Null: show `usd`. */
  price: string | null
  /** Has a Paddle price, so it can be bought. */
  available: boolean
}

const priceIdOf = (pack: CreditPackId): string => config.paddle.priceIds[pack]

export const listPacks = async (customerIp: string | undefined): Promise<PackView[]> => {
  const priceIds = CREDIT_PACKS.map(({ id }) => priceIdOf(id)).filter(Boolean)
  let localized = new Map<string, string>()
  if (isPaddleConfigured() && priceIds.length) {
    try {
      localized = await previewPrices(priceIds, customerIp)
    } catch {
      // Logged by lib/paddle; the list prices in USD stand in.
    }
  }
  return CREDIT_PACKS.map(({ id, credits, usd }) => ({
    id,
    credits,
    usd,
    price: localized.get(priceIdOf(id)) ?? null,
    available: isPaddleConfigured() && Boolean(priceIdOf(id)),
  }))
}

/** Paddle's own reason is added outside production; the web shows translated copy either way. */
const checkoutFailed = (detail: string): HttpError =>
  new HttpError(502, config.nodeEnv === 'production' ? 'checkout_failed' : `checkout_failed: ${detail}`, 502)

/**
 * Opens a Paddle transaction for one pack and records it as a pending `Payment`. The browser
 * goes to `checkoutUrl` — our `/[lang]/payments/checkout?_ptxn=txn_…`, where Paddle.js opens
 * the overlay for that transaction (the same URL Paddle builds from a default payment link).
 * `request` is the click on "Buy", for the admin mail only.
 */
export const startCheckout = async (
  userId: string,
  pack: CreditPackId,
  locale: Locale,
  request: RequestInfo | null = null
): Promise<{ checkoutUrl: string; paymentId: string }> => {
  const priceId = priceIdOf(pack)
  if (!isPaddleConfigured() || !priceId) throw new HttpError(503, 'shop_closed', 503)
  const credits = CREDIT_PACKS.find(({ id }) => id === pack)!.credits

  let transaction: CreatedTransaction
  try {
    transaction = await createTransaction({ priceId, customData: { userId, pack } })
  } catch (error) {
    if (error instanceof PaddleError) {
      const detail = `${error.message} [request ${error.requestId ?? '?'}]`
      void notifyCheckoutFailed(userId, { id: pack, credits, priceId }, detail, request)
      throw checkoutFailed(detail)
    }
    throw error
  }
  const checkoutUrl = `${config.corsOrigin}/${locale}/payments/checkout?_ptxn=${encodeURIComponent(transaction.id)}`

  await prisma.payment.create({ data: { id: transaction.id, userId, pack, priceId, credits } })
  console.info('[billing] checkout opened', { paymentId: transaction.id, userId, pack })
  void notifyCheckoutStarted(transaction.id, request)
  return { checkoutUrl, paymentId: transaction.id }
}

/** The return page polls this until the webhook has completed the payment. Only the payer may read it. */
export const paymentStatus = async (userId: string, paymentId: string) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, select: { userId: true, status: true, credits: true } })
  return payment?.userId === userId ? { status: payment.status, credits: payment.credits } : null
}

// --- Webhook ----------------------------------------------------------------------------------

/** The parts of Paddle's payloads we read. Amounts are integer strings in the lowest unit. */
type Totals = { grand_total?: string; total?: string; tax?: string; fee?: string; earnings?: string; currency_code?: string }

type TransactionData = {
  id?: string
  customer_id?: string | null
  currency_code?: string
  billed_at?: string | null
  items?: { price?: { id?: string } }[]
  details?: { totals?: Totals; payout_totals?: Totals | null }
  payments?: { status?: string; method_details?: { type?: string } | null }[]
}

type AdjustmentData = {
  id?: string
  action?: string
  status?: string
  type?: string | null
  transaction_id?: string
  totals?: Totals
}

export type PaddleEvent = { event_id?: string; event_type?: string; occurred_at?: string; data?: Record<string, unknown> }

const cents = (value: unknown): number | null => (typeof value === 'string' && /^-?\d+$/.test(value) ? Number(value) : null)

/**
 * A verified webhook: stored raw first, then applied. A redelivery of a handled event is
 * skipped; one whose handling threw is retried (the route answers 500, Paddle redelivers).
 */
export const receiveWebhook = async (event: PaddleEvent): Promise<void> => {
  const { event_id: id, event_type: type, data = {} } = event
  if (!id || !type) throw new HttpError(400, 'Malformed event', 400)

  const transactionId = (type.startsWith('adjustment.') ? data.transaction_id : data.id) as string | undefined
  const stored = await prisma.paymentEvent.upsert({
    where: { id },
    create: {
      id,
      type,
      transactionId: typeof transactionId === 'string' ? transactionId : null,
      occurredAt: event.occurred_at ? new Date(event.occurred_at) : new Date(),
      payload: event as Prisma.InputJsonValue,
    },
    update: {},
    select: { processedAt: true },
  })
  if (stored.processedAt) return

  switch (type) {
    case 'transaction.completed':
      await completePayment(data as TransactionData, id)
      break
    case 'transaction.payment_failed':
      await failPayment(data as TransactionData)
      break
    case 'adjustment.created':
    case 'adjustment.updated':
      await applyAdjustment(data as AdjustmentData)
      break
    default:
      console.info('[billing] webhook event stored, nothing to do', { id, type })
  }
  await prisma.paymentEvent.update({ where: { id }, data: { processedAt: new Date() } })
}

const completePayment = async (data: TransactionData, eventId: string): Promise<void> => {
  const payment = data.id ? await prisma.payment.findUnique({ where: { id: data.id } }) : null
  if (!payment) {
    // Not opened by our checkout (a dashboard sale?). The raw event is in PaymentEvent to settle by hand.
    console.error('[billing] completed transaction has no Payment row', { transactionId: data.id })
    void notifyUnmatchedPayment(data.id ?? '— (none in the payload)', eventId, 'no Payment row: not opened by our checkout')
    return
  }
  if (!data.items?.some((item) => item.price?.id === payment.priceId)) {
    console.error('[billing] completed transaction does not carry the pack price', { paymentId: payment.id, priceId: payment.priceId })
    void notifyUnmatchedPayment(payment.id, eventId, `the transaction does not carry the ${payment.pack} pack's price (${payment.priceId})`)
    return
  }

  const totals = data.details?.totals
  const payout = data.details?.payout_totals
  const method = (data.payments?.find(({ status }) => status === 'captured') ?? data.payments?.[0])?.method_details?.type

  const added = await prisma.$transaction(async (tx) => {
    // The status guard is the idempotency: only the first delivery moves it to `completed`.
    const { count } = await tx.payment.updateMany({
      where: { id: payment.id, status: { in: ['pending', 'failed'] } },
      data: {
        status: 'completed',
        completedAt: data.billed_at ? new Date(data.billed_at) : new Date(),
        currency: totals?.currency_code ?? data.currency_code ?? null,
        total: cents(totals?.grand_total ?? totals?.total),
        tax: cents(totals?.tax),
        fee: cents(totals?.fee),
        earnings: cents(totals?.earnings),
        payoutCurrency: payout?.currency_code ?? null,
        payoutEarnings: cents(payout?.earnings),
        paymentMethod: method ?? null,
        customerId: data.customer_id ?? null,
      },
    })
    if (!count) return false

    const [row] = await tx.$queryRaw<{ credits: number }[]>`
      UPDATE "User" SET "credits" = "credits" + ${payment.credits}, "updatedAt" = NOW()
      WHERE "id" = ${payment.userId}
      RETURNING "credits"`
    await tx.creditEntry.create({
      data: { userId: payment.userId, delta: payment.credits, balanceAfter: row!.credits, reason: 'purchase', paymentId: payment.id },
    })
    return true
  })
  if (added) {
    console.info('[billing] credits added', { paymentId: payment.id, userId: payment.userId, credits: payment.credits })
    void notifyCreditsAdded(payment.id)
  }
}

const failPayment = async (data: TransactionData): Promise<void> => {
  if (!data.id) return
  const { count } = await prisma.payment.updateMany({ where: { id: data.id, status: 'pending' }, data: { status: 'failed' } })
  console.warn('[billing] payment attempt failed', { paymentId: data.id, recorded: count > 0 })
}

/**
 * An approved refund or chargeback takes the pack's credits back — the refunded share of them
 * for a partial refund — but never more than the balance holds: what was spent stays spent.
 */
const applyAdjustment = async (data: AdjustmentData): Promise<void> => {
  if ((data.action !== 'refund' && data.action !== 'chargeback') || data.status !== 'approved' || !data.id) return
  const { id: adjustmentId, action } = data
  const payment = data.transaction_id ? await prisma.payment.findUnique({ where: { id: data.transaction_id } }) : null
  if (!payment || (payment.status !== 'completed' && payment.status !== 'refunded')) {
    console.error('[billing] adjustment for an unknown or unpaid transaction', { adjustmentId, transactionId: data.transaction_id })
    return
  }

  const refunded = cents(data.totals?.total)
  const share = data.type === 'full' || !refunded || !payment.total ? 1 : Math.min(1, refunded / payment.total)
  const back = Math.round(payment.credits * share)

  const takenBack = await prisma.$transaction(async (tx) => {
    if (await tx.creditEntry.findUnique({ where: { adjustmentId }, select: { id: true } })) return null
    const [user] = await tx.$queryRaw<{ credits: number }[]>`SELECT "credits" FROM "User" WHERE "id" = ${payment.userId} FOR UPDATE`
    const taken = Math.min(back, user!.credits)
    const [row] = await tx.$queryRaw<{ credits: number }[]>`
      UPDATE "User" SET "credits" = "credits" - ${taken}, "updatedAt" = NOW()
      WHERE "id" = ${payment.userId}
      RETURNING "credits"`
    await tx.creditEntry.create({
      data: { userId: payment.userId, delta: -taken, balanceAfter: row!.credits, reason: 'refund', paymentId: payment.id, adjustmentId },
    })
    const { refundedCredits } = await tx.payment.update({
      where: { id: payment.id },
      data: { refundedCredits: { increment: back } },
      select: { refundedCredits: true },
    })
    if (data.type === 'full' || refundedCredits >= payment.credits) {
      await tx.payment.update({ where: { id: payment.id }, data: { status: 'refunded' } })
    }
    console.info('[billing] credits taken back', { adjustmentId, paymentId: payment.id, action, back, taken })
    return taken
  })
  if (takenBack !== null) void notifyAdjustment(payment.id, { action, adjustmentId, back, taken: takenBack })
}
