import type { InternalMailPayload } from '../lib/mail.js'
import { type ClientInfoKey, describeUserAgent, type RequestInfo } from '../lib/request-info.js'

/**
 * The admin mails about purchases, built from plain facts so they are testable without a
 * database; `paymentNotifications.ts` loads the facts and sends.
 *
 * **Visitor text goes only into `body` and `details`.** The engine sanitises those two but
 * inserts `subject` and the sender name into its HTML as they are — so the subject and sender
 * are fixed strings with numbers, and the buyer's name and email travel in the body and details.
 */

export type PaymentMailEvent =
  /** A Paddle transaction was opened; the buyer is on the checkout overlay. */
  | { kind: 'started' }
  /** Paddle refused to open a transaction: nothing to pay, nothing charged. */
  | { kind: 'startFailed'; reason: string }
  /** The webhook completed the payment and added the credits. */
  | { kind: 'completed' }
  /** An approved refund or chargeback took credits back: `back` asked for, `taken` (≤ balance) actually removed. */
  | { kind: 'adjusted'; action: 'refund' | 'chargeback'; adjustmentId: string; back: number; taken: number }

export type BuyerFacts = {
  id: string
  email: string
  fullName: string
  emailVerified: boolean
  signIn: string
  createdAt: Date
  /** The balance now, after this event. */
  credits: number
  /** Completed payments of this account other than this one. */
  paidBefore: number
}

export type PaymentFacts = {
  payment: {
    /** The Paddle transaction id; null when Paddle refused to open one. */
    id: string | null
    pack: string
    credits: number
    priceId: string
    status: string
    sandbox: boolean
    createdAt: Date | null
    completedAt: Date | null
    /** Paddle's totals, in the currency's lowest unit. */
    currency: string | null
    total: number | null
    tax: number | null
    fee: number | null
    earnings: number | null
    payoutCurrency: string | null
    payoutEarnings: number | null
    paymentMethod: string | null
    refundedCredits: number
  }
  buyer: BuyerFacts
}

const CLIENT_LABEL: Record<ClientInfoKey, string> = {
  timezone: 'Timezone',
  languages: 'Browser languages',
  platform: 'Platform',
  mobile: 'Mobile (browser says)',
  screen: 'Screen',
  viewport: 'Window',
  pixelRatio: 'Pixel ratio',
  touchPoints: 'Touch points',
  cores: 'CPU cores',
  memoryGb: 'Memory (GB, approx.)',
  connection: 'Connection',
  standalone: 'Installed as app',
}

const YEREVAN = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Yerevan', dateStyle: 'medium', timeStyle: 'medium' })

export const formatYerevan = (date: Date): string => `${YEREVAN.format(date)} (Yerevan)`

export const formatDuration = (ms: number): string => {
  const seconds = Math.max(0, Math.round(ms / 1000))
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return `${hours}h ${minutes % 60}m`
  return `${Math.floor(hours / 24)}d ${hours % 24}h`
}

/** Paddle amounts are in the lowest unit: `1199 USD` → `11.99 USD`, `1200 JPY` → `1,200 JPY`. */
export const formatMoney = (amount: number | null, currency: string | null): string => {
  if (amount === null || !currency) return '—'
  let digits = 2
  try {
    digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {
    // An unknown code: two decimals, as most currencies.
  }
  const value = (amount / 10 ** digits).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  return `${value} ${currency}`
}

type Details = Record<string, string>

const packLabel = ({ pack, credits }: PaymentFacts['payment']): string => `${pack} (${credits} credits)`

const paymentDetails = ({ payment }: PaymentFacts, event: PaymentMailEvent): Details => {
  const details: Details = {
    Pack: packLabel(payment),
    'Paddle transaction': payment.id ?? '— (none: Paddle refused)',
    'Paddle price id': payment.priceId,
    Environment: payment.sandbox ? 'SANDBOX — not real money' : 'live',
  }
  if (payment.createdAt) details['Checkout opened'] = formatYerevan(payment.createdAt)
  if (event.kind === 'startFailed') details['Paddle answer'] = event.reason
  if (event.kind === 'completed' || event.kind === 'adjusted') {
    details['Paid'] = formatMoney(payment.total, payment.currency)
    details['Tax'] = formatMoney(payment.tax, payment.currency)
    details['Paddle fee'] = formatMoney(payment.fee, payment.currency)
    details['Our earnings'] = formatMoney(payment.earnings, payment.currency)
    if (payment.payoutCurrency) details['Earnings (payout currency)'] = formatMoney(payment.payoutEarnings, payment.payoutCurrency)
    if (payment.paymentMethod) details['Method'] = payment.paymentMethod
  }
  if (event.kind === 'completed' && payment.completedAt) {
    details['Paid at'] = formatYerevan(payment.completedAt)
    if (payment.createdAt) details['Time to pay'] = formatDuration(payment.completedAt.getTime() - payment.createdAt.getTime())
  }
  if (event.kind === 'adjusted') {
    details['Adjustment'] = `${event.action} ${event.adjustmentId}`
    details['Credits to take back'] = String(event.back)
    details['Credits taken'] = event.taken < event.back ? `${event.taken} (the rest was already spent)` : String(event.taken)
    details['Credits refunded in total'] = `${payment.refundedCredits} of ${payment.credits}`
    details['Payment status now'] = payment.status
  }
  return details
}

const buyerDetails = ({ buyer }: PaymentFacts): Details => ({
  Buyer: buyer.fullName,
  'Buyer email': buyer.email,
  'Email verified': buyer.emailVerified ? 'yes' : 'no',
  'Signs in with': buyer.signIn,
  'Account id': buyer.id,
  'Account since': formatYerevan(buyer.createdAt),
  'Balance now': `${buyer.credits} credits`,
  'Paid before': buyer.paidBefore ? `${buyer.paidBefore} payment(s)` : 'never — first purchase',
})

const deviceDetails = (request: RequestInfo): Details => {
  const details: Details = {
    Device: describeUserAgent(request.userAgent),
    IP: request.ip ?? 'unknown',
  }
  if (request.ip) details['IP lookup'] = `https://ipinfo.io/${request.ip}`
  if (request.clientHints) details['Client hints'] = request.clientHints
  if (request.acceptLanguage) details['Accept-Language'] = request.acceptLanguage
  for (const [key, label] of Object.entries(CLIENT_LABEL) as [ClientInfoKey, string][]) {
    const value = request.client[key]
    if (value) details[label] = value
  }
  if (request.referer) details.Referer = request.referer
  details['User agent'] = request.userAgent ?? 'none'
  return details
}

const who = ({ buyer }: PaymentFacts): string => `${buyer.fullName} <${buyer.email}>`

/**
 * One mail per event. `request` is the click on "Buy" for `started` / `startFailed`; the
 * webhook-driven events have no buyer request.
 */
export const buildPaymentMail = (event: PaymentMailEvent, facts: PaymentFacts, request: RequestInfo | null): InternalMailPayload => {
  const { payment } = facts
  const paid = formatMoney(payment.total, payment.currency)
  const sandbox = payment.sandbox ? ' [sandbox]' : ''

  const { subject, body } = ((): { subject: string; body: string } => {
    switch (event.kind) {
      case 'started':
        return {
          subject: `Checkout opened · ${payment.pack} · ${payment.credits} credits${sandbox}`,
          body: `${who(facts)} clicked "Buy" on the ${packLabel(payment)} pack and the Paddle checkout opened. A "Credits added" mail with the same transaction follows if they pay.`,
        }
      case 'startFailed':
        return {
          subject: `Checkout FAILED to open · ${payment.pack}${sandbox}`,
          body: `${who(facts)} clicked "Buy" on the ${packLabel(payment)} pack, but Paddle refused to open a transaction. Nothing was charged; the buyer saw "couldn't open the checkout". If this repeats, check the Paddle API key and price ids.`,
        }
      case 'completed':
        return {
          subject: `Credits added · ${payment.pack} · ${paid}${sandbox}`,
          body: `${who(facts)} paid ${paid} for the ${packLabel(payment)} pack. The credits were added to their balance.`,
        }
      case 'adjusted':
        return {
          subject: `${event.action === 'chargeback' ? 'CHARGEBACK' : 'Refund approved'} · ${payment.pack} · ${paid}${sandbox}`,
          body: `Paddle approved a ${event.action} on ${who(facts)}'s ${packLabel(payment)} purchase. ${event.taken} of ${event.back} credits were taken back${event.taken < event.back ? '; the rest had already been spent' : ''}.`,
        }
    }
  })()

  const details: Details = {
    '— Payment —': '',
    ...paymentDetails(facts, event),
    '— Buyer —': '',
    ...buyerDetails(facts),
    ...(request ? { '— Device —': '', ...deviceDetails(request) } : {}),
  }

  return { subject, body, firstName: event.kind === 'started' || event.kind === 'startFailed' ? 'Checkout' : 'Payment', details }
}

/**
 * A completed Paddle transaction this app cannot credit by itself: no `Payment` row (a sale
 * made in the dashboard?) or not the pack's price. The raw event is in `PaymentEvent`.
 */
export const buildUnmatchedMail = (transactionId: string, eventId: string, problem: string, sandbox: boolean): InternalMailPayload => ({
  subject: `Payment NOT credited — settle it by hand${sandbox ? ' [sandbox]' : ''}`,
  body: `Paddle reported a completed transaction that was not credited automatically: ${problem}. Find it in the Paddle dashboard, then add the credits by hand (with a CreditEntry row) or refund it.`,
  firstName: 'Payment',
  details: {
    'Paddle transaction': transactionId,
    'Webhook event (PaymentEvent.id)': eventId,
    Problem: problem,
    Environment: sandbox ? 'SANDBOX — not real money' : 'live',
  },
})
