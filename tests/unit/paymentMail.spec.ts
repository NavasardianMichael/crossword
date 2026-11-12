import { describe, expect, it } from 'vitest'
import type { ClientInfo } from '@helpers/clientInfo'
import { asClientInfo, describeUserAgent, type RequestInfo } from '../../server/src/lib/request-info'
import { buildPaymentMail, buildUnmatchedMail, formatDuration, formatMoney, type PaymentFacts } from '../../server/src/services/paymentMail'

const UA = {
  chromeWindows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  safariIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  samsungTablet:
    'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Safari/537.36',
  edgeMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
}

describe('describeUserAgent', () => {
  it('names browser, OS and device', () => {
    expect(describeUserAgent(UA.chromeWindows)).toBe('Chrome 130 · Windows 10/11 · desktop')
    expect(describeUserAgent(UA.safariIphone)).toBe('Safari 17.4 · iOS 17.4 · mobile')
    expect(describeUserAgent(UA.samsungTablet)).toBe('Samsung Internet 25 · Android 13 · tablet')
    expect(describeUserAgent(UA.edgeMac)).toBe('Edge 130 · macOS · desktop')
    expect(describeUserAgent(null)).toBe('unknown')
  })
})

describe('asClientInfo', () => {
  it('keeps known keys as short strings and drops everything else', () => {
    expect(
      asClientInfo({ timezone: 'Asia/Yerevan', mobile: true, cores: 8, pixelRatio: Infinity, evil: 'x', screen: 'a'.repeat(500) })
    ).toEqual({ timezone: 'Asia/Yerevan', mobile: 'yes', cores: '8', screen: 'a'.repeat(100) })
    expect(asClientInfo(undefined)).toEqual({})
    expect(asClientInfo(['timezone'])).toEqual({})
  })

  it('keeps every device fact the web sends', () => {
    // `Required` makes a new web key fail to compile here until the server keeps it too.
    const everything: Required<ClientInfo> = {
      timezone: 'Asia/Yerevan',
      languages: 'hy-AM, en',
      platform: 'Android',
      mobile: true,
      screen: '412×915',
      viewport: '412×800',
      pixelRatio: 2.625,
      touchPoints: 5,
      cores: 8,
      memoryGb: 8,
      connection: '4g, ~10 Mbps',
      standalone: false,
    }
    expect(Object.keys(asClientInfo(everything)).sort()).toEqual(Object.keys(everything).sort())
  })
})

describe('formatting', () => {
  it('reads Paddle amounts in the lowest unit', () => {
    expect(formatMoney(1199, 'USD')).toBe('11.99 USD')
    expect(formatMoney(1200, 'JPY')).toBe('1,200 JPY')
    expect(formatMoney(null, 'USD')).toBe('—')
  })

  it('shortens durations', () => {
    expect(formatDuration(42_000)).toBe('42s')
    expect(formatDuration(125_000)).toBe('2m 5s')
    expect(formatDuration(3 * 3600_000 + 60_000)).toBe('3h 1m')
  })
})

const facts = (payment: Partial<PaymentFacts['payment']> = {}): PaymentFacts => ({
  payment: {
    id: 'txn_01',
    pack: 'popular',
    credits: 600,
    priceId: 'pri_01',
    status: 'pending',
    sandbox: false,
    createdAt: new Date('2026-11-12T10:00:00Z'),
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
    ...payment,
  },
  buyer: {
    id: 'u1',
    email: 'ann@example.com',
    fullName: 'Ann <b>Lee</b>',
    emailVerified: true,
    signIn: 'Google',
    createdAt: new Date('2026-11-01T00:00:00Z'),
    credits: 12,
    paidBefore: 0,
  },
})

const request: RequestInfo = {
  ip: '203.0.113.7',
  userAgent: UA.safariIphone,
  acceptLanguage: 'hy-AM,hy;q=0.9',
  clientHints: null,
  referer: null,
  client: { timezone: 'Asia/Yerevan' },
}

describe('buildPaymentMail', () => {
  it('keeps visitor text out of the subject and sender', () => {
    const mail = buildPaymentMail({ kind: 'started' }, facts(), request)
    expect(mail.subject).toBe('Checkout opened · popular · 600 credits')
    expect(mail.subject).not.toContain('Ann')
    expect(mail.firstName).toBe('Checkout')
    expect(mail.body).toContain('Ann <b>Lee</b> <ann@example.com>')
    expect(mail.details).toMatchObject({ 'Paddle transaction': 'txn_01', Device: 'Safari 17.4 · iOS 17.4 · mobile', Timezone: 'Asia/Yerevan' })
  })

  it('says when Paddle refused to open a checkout', () => {
    const mail = buildPaymentMail({ kind: 'startFailed', reason: 'price not found' }, facts({ id: null, createdAt: null }), request)
    expect(mail.subject).toBe('Checkout FAILED to open · popular')
    expect(mail.details).toMatchObject({ 'Paddle transaction': '— (none: Paddle refused)', 'Paddle answer': 'price not found' })
  })

  it('reports the money of a completed payment, flagging the sandbox', () => {
    const paid = facts({
      status: 'completed',
      sandbox: true,
      completedAt: new Date('2026-11-12T10:02:05Z'),
      currency: 'USD',
      total: 1199,
      tax: 200,
      fee: 110,
      earnings: 889,
    })
    const mail = buildPaymentMail({ kind: 'completed' }, paid, null)
    expect(mail.subject).toBe('Credits added · popular · 11.99 USD [sandbox]')
    expect(mail.firstName).toBe('Payment')
    expect(mail.details).toMatchObject({ Paid: '11.99 USD', 'Our earnings': '8.89 USD', 'Time to pay': '2m 5s' })
    expect(Object.keys(mail.details ?? {})).not.toContain('— Device —')
  })

  it('tells a chargeback from a refund, and what was already spent', () => {
    const refunded = facts({ status: 'refunded', currency: 'USD', total: 1199, refundedCredits: 600 })
    const mail = buildPaymentMail({ kind: 'adjusted', action: 'chargeback', adjustmentId: 'adj_1', back: 600, taken: 12 }, refunded, null)
    expect(mail.subject).toBe('CHARGEBACK · popular · 11.99 USD')
    expect(mail.body).toContain('12 of 600 credits were taken back; the rest had already been spent')
    expect(mail.details).toMatchObject({ 'Credits taken': '12 (the rest was already spent)' })
  })
})

describe('buildUnmatchedMail', () => {
  it('asks for a hand, naming the transaction and the stored event', () => {
    const mail = buildUnmatchedMail('txn_x', 'evt_1', 'no Payment row', false)
    expect(mail.subject).toBe('Payment NOT credited — settle it by hand')
    expect(mail.details).toMatchObject({ 'Paddle transaction': 'txn_x', 'Webhook event (PaymentEvent.id)': 'evt_1' })
  })
})
