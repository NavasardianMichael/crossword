import { createHmac, randomBytes, randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'
import { createApp } from '../../server/src/app'
import { config } from '../../server/src/config'
import { prisma } from '../../server/src/lib/prisma'
import { BILLING_CODE, CREDIT_PACKS, FREE_MONTHLY_CREDITS, puzzleCredits, type PuzzleView } from '../../server/src/lib/puzzle'
import { signSession } from '../../server/src/lib/session'
import { monthOf } from '../../server/src/services/billing'

const ORIGIN = 'http://localhost:7007'
/** `PADDLE_WEBHOOK_SECRET` in vitest.config.mts. */
const SECRET = 'pdl_ntfset_test_secret'

const app = createApp()

afterAll(async () => {
  await prisma.$disconnect()
})

const newUser = async (credits = 0) => {
  const user = await prisma.user.create({
    data: { email: `${randomUUID()}@test.local`, fullName: 'Payer', emailVerifiedAt: new Date(), credits },
  })
  return { user, cookie: `crossword-session=${signSession({ userId: user.id, tokenVersion: user.tokenVersion })}` }
}

const build = (cookie: string, ip: string, body: Record<string, unknown> = {}) =>
  request(app)
    .post('/puzzles')
    .set('Origin', ORIGIN)
    .set('X-Forwarded-For', ip)
    .set('Cookie', cookie)
    .send({ locale: 'en', format: 'classic', topic: 'any', difficulty: 1, size: 'small', exclude: [], ...body })

const guestCookieOf = (response: request.Response): string => {
  const cookies = ([] as string[]).concat(response.headers['set-cookie'] ?? [])
  return cookies.find((cookie) => cookie.startsWith('crossword-guest='))!.split(';')[0]!
}

const creditsOf = async (userId: string) => (await prisma.user.findUniqueOrThrow({ where: { id: userId } })).credits

const freeSpentBy = async (holder: string) =>
  (await prisma.freeSpend.aggregate({ where: { month: monthOf(), holder }, _sum: { amount: true } }))._sum.amount ?? 0

/** Spends a holder's free credits for this month, as if earlier puzzles had. */
const spendFree = (holder: string, amount = FREE_MONTHLY_CREDITS) =>
  prisma.freeSpend.create({ data: { month: monthOf(), holder, ipKey: 'ip:test', puzzleId: 'earlier', amount } })

describe('free credits', () => {
  it('gives a guest the monthly free credits, then asks them to sign in', async () => {
    // Small easy (5) + small medium (6) = 11, the whole allowance.
    const first = await build('', '10.0.0.1')
    expect(first.status).toBe(201)
    const guest = guestCookieOf(first)
    expect((await build(guest, '10.0.0.1', { difficulty: 2 })).status).toBe(201)

    const puzzlesBefore = await prisma.puzzle.count()
    const third = await build(guest, '10.0.0.1')
    expect(third.status).toBe(402)
    expect(third.body.error.code).toBe(BILLING_CODE.signInRequired)
    expect(await prisma.puzzle.count()).toBe(puzzlesBefore)

    const status = await request(app).get('/billing').set('Cookie', guest).set('X-Forwarded-For', '10.0.0.1')
    expect(status.body.value).toMatchObject({ signedIn: false, credits: 0, freeCredits: 0 })
  })

  it('refuses a guest a puzzle the free credits cannot cover, and spends nothing', async () => {
    const response = await build('', '10.0.0.6', { size: 'large' })
    expect(response.status).toBe(402)
    expect(response.body.error.code).toBe(BILLING_CODE.signInRequired)
    const guestId = guestCookieOf(response).split('=')[1]
    expect(await freeSpentBy(`guest:${guestId}`)).toBe(0)
  })

  it('caps the guest devices of one address', async () => {
    for (let device = 0; device < 3; device++) expect((await build('', '10.0.0.2')).status).toBe(201)
    const fourth = await build('', '10.0.0.2')
    expect(fourth.status).toBe(402)
    expect(fourth.body.error.code).toBe(BILLING_CODE.signInRequired)
  })

  it('gives an account its own free credits, then charges bought ones by size and difficulty', async () => {
    const { user, cookie } = await newUser(100)

    expect((await build(cookie, '10.0.0.3', { size: 'medium', difficulty: 2 })).status).toBe(201)
    expect(await creditsOf(user.id)).toBe(100)
    expect(await freeSpentBy(`user:${user.id}`)).toBe(FREE_MONTHLY_CREDITS)

    const paid = await build(cookie, '10.0.0.3', { size: 'medium', difficulty: 3 })
    expect(paid.status).toBe(201)
    expect(await creditsOf(user.id)).toBe(88)
    const entries = await prisma.creditEntry.findMany({ where: { userId: user.id } })
    expect(entries).toMatchObject([{ delta: -12, balanceAfter: 88, reason: 'generation', puzzleId: (paid.body.value as PuzzleView).id }])
  })

  it('pays with what is left of the free credits first, and bought ones for the rest', async () => {
    const { user, cookie } = await newUser(100)
    await spendFree(`user:${user.id}`, 5)

    // Medium easy costs 10: the 6 free credits left, then 4 bought ones.
    const response = await build(cookie, '10.0.0.7', { size: 'medium' })
    expect(response.status).toBe(201)
    expect(await freeSpentBy(`user:${user.id}`)).toBe(FREE_MONTHLY_CREDITS)
    expect(await creditsOf(user.id)).toBe(96)
    expect(await prisma.creditEntry.findMany({ where: { userId: user.id } })).toMatchObject([{ delta: -4, balanceAfter: 96 }])

    const status = await request(app).get('/billing').set('Cookie', cookie).set('X-Forwarded-For', '10.0.0.7')
    expect(status.body.value).toMatchObject({ signedIn: true, credits: 96, freeCredits: 0 })
  })

  it('refuses a puzzle free and bought credits together cannot cover, and spends nothing', async () => {
    const { user, cookie } = await newUser(3)
    await spendFree(`user:${user.id}`, 5)

    const puzzlesBefore = await prisma.puzzle.count()
    // Medium easy costs 10: 6 free + 3 bought is one short.
    const response = await build(cookie, '10.0.0.4', { size: 'medium' })
    expect(response.status).toBe(402)
    expect(response.body.error.code).toBe(BILLING_CODE.insufficientCredits)
    expect(await creditsOf(user.id)).toBe(3)
    expect(await freeSpentBy(`user:${user.id}`)).toBe(5)
    expect(await prisma.puzzle.count()).toBe(puzzlesBefore)
  })

  it('pauses free credits past the hourly cap, but never puzzles paid with bought ones', async () => {
    const { user, cookie } = await newUser(100)
    const recent = await prisma.freeSpend.count({ where: { createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } } })
    const filler = Array.from({ length: Math.max(0, config.billing.freePuzzlesPerHour - recent) }, () => ({
      month: monthOf(),
      holder: `guest:cap-${randomUUID()}`,
      ipKey: 'ip:cap',
      puzzleId: 'cap',
      amount: 1,
    }))
    await prisma.freeSpend.createMany({ data: filler })

    try {
      const puzzlesBefore = await prisma.puzzle.count()
      const guest = await build('', '10.0.0.5')
      expect(guest.status).toBe(429)
      expect(guest.body.error.code).toBe(BILLING_CODE.freeBusy)
      // An account with bought credits is not charged them instead: its free credits wait for the hour to roll on.
      const account = await build(cookie, '10.0.0.5')
      expect(account.status).toBe(429)
      expect(await creditsOf(user.id)).toBe(100)
      expect(await prisma.puzzle.count()).toBe(puzzlesBefore)

      await spendFree(`user:${user.id}`)
      expect((await build(cookie, '10.0.0.5')).status).toBe(201)
      expect(await creditsOf(user.id)).toBe(100 - puzzleCredits('small', 1))
    } finally {
      await prisma.freeSpend.deleteMany({ where: { ipKey: 'ip:cap' } })
    }
  })
})

describe('packs and checkout', () => {
  it('lists the packs at their list price while Paddle is not configured', async () => {
    const response = await request(app).get('/billing/packs')
    expect(response.status).toBe(200)
    expect(response.body.value).toEqual(CREDIT_PACKS.map(({ id, credits, usd }) => ({ id, credits, usd, price: null, available: false })))
  })

  it('needs an account, and is closed without a Paddle key', async () => {
    const anonymous = await request(app).post('/billing/checkout').set('Origin', ORIGIN).send({ pack: 'starter', locale: 'en' })
    expect(anonymous.status).toBe(401)

    const { cookie } = await newUser()
    const closed = await request(app).post('/billing/checkout').set('Origin', ORIGIN).set('Cookie', cookie).send({ pack: 'starter', locale: 'en' })
    expect(closed.status).toBe(503)
    expect(closed.body.error.message).toBe('shop_closed')
  })
})

describe('Paddle webhook', () => {
  const transactionId = () => `txn_${randomBytes(13).toString('hex')}`

  const deliver = (event: Record<string, unknown>, secret = SECRET) => {
    const body = JSON.stringify(event)
    const ts = Math.floor(Date.now() / 1000)
    const h1 = createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex')
    return request(app).post('/billing/webhook').set('Content-Type', 'application/json').set('Paddle-Signature', `ts=${ts};h1=${h1}`).send(body)
  }

  const event = (type: string, data: Record<string, unknown>, id = `evt_${randomUUID()}`) => ({
    event_id: id,
    event_type: type,
    occurred_at: new Date().toISOString(),
    notification_id: `ntf_${randomUUID()}`,
    data,
  })

  const completed = (id: string, priceId = 'pri_test_starter') => ({
    id,
    status: 'completed',
    customer_id: 'ctm_test',
    currency_code: 'EUR',
    billed_at: new Date().toISOString(),
    items: [{ price: { id: priceId }, quantity: 1 }],
    details: {
      totals: { grand_total: '599', tax: '100', fee: '80', earnings: '419', currency_code: 'EUR' },
      payout_totals: { earnings: '455', currency_code: 'USD' },
    },
    payments: [{ status: 'captured', method_details: { type: 'card' } }],
  })

  const pendingPayment = async (credits = 0) => {
    const { user, cookie } = await newUser(credits)
    const payment = await prisma.payment.create({
      data: { id: transactionId(), userId: user.id, pack: 'starter', priceId: 'pri_test_starter', credits: 200 },
    })
    return { user, cookie, payment }
  }

  it('refuses a bad signature and stores nothing', async () => {
    const response = await deliver(event('transaction.completed', completed(transactionId())), 'wrong-secret')
    expect(response.status).toBe(401)
    expect(await prisma.paymentEvent.count({ where: { type: 'transaction.completed' } })).toBe(0)
  })

  it('adds a pack once, however often Paddle delivers', async () => {
    const { user, payment } = await pendingPayment()
    const first = event('transaction.completed', completed(payment.id))

    expect((await deliver(first)).status).toBe(200)
    expect((await deliver(first)).status).toBe(200)
    expect((await deliver(event('transaction.completed', completed(payment.id)))).status).toBe(200)

    expect(await creditsOf(user.id)).toBe(200)
    expect(await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).toMatchObject({
      status: 'completed',
      currency: 'EUR',
      total: 599,
      tax: 100,
      fee: 80,
      earnings: 419,
      payoutCurrency: 'USD',
      payoutEarnings: 455,
      paymentMethod: 'card',
    })
    expect(await prisma.creditEntry.findMany({ where: { userId: user.id } })).toMatchObject([
      { delta: 200, balanceAfter: 200, reason: 'purchase', paymentId: payment.id },
    ])
    const events = await prisma.paymentEvent.findMany({ where: { transactionId: payment.id } })
    expect(events).toHaveLength(2)
    expect(events.every(({ processedAt }) => processedAt)).toBe(true)
  })

  it('adds nothing for a transaction that does not carry the pack price', async () => {
    const { user, payment } = await pendingPayment()
    expect((await deliver(event('transaction.completed', completed(payment.id, 'pri_other')))).status).toBe(200)
    expect(await creditsOf(user.id)).toBe(0)
  })

  it('records a declined attempt, and still completes on a later success', async () => {
    const { user, cookie, payment } = await pendingPayment()
    await deliver(event('transaction.payment_failed', { id: payment.id, status: 'ready' }))
    expect((await request(app).get(`/billing/payments/${payment.id}`).set('Cookie', cookie)).body.value).toEqual({ status: 'failed', credits: 200 })

    await deliver(event('transaction.completed', completed(payment.id)))
    expect((await request(app).get(`/billing/payments/${payment.id}`).set('Cookie', cookie)).body.value).toEqual({ status: 'completed', credits: 200 })
    expect(await creditsOf(user.id)).toBe(200)
  })

  it("shows a payment to its payer only", async () => {
    const { payment } = await pendingPayment()
    const { cookie: stranger } = await newUser()
    expect((await request(app).get(`/billing/payments/${payment.id}`).set('Cookie', stranger)).status).toBe(404)
  })

  it('takes a refund back once, never below zero', async () => {
    const { user, payment } = await pendingPayment()
    await deliver(event('transaction.completed', completed(payment.id)))
    // 150 of the 200 credits were spent before the refund.
    await prisma.user.update({ where: { id: user.id }, data: { credits: 50 } })

    const adjustment = { id: 'adj_test_refund', action: 'refund', type: 'full', transaction_id: payment.id, totals: { total: '599', currency_code: 'EUR' } }
    await deliver(event('adjustment.created', { ...adjustment, status: 'pending_approval' }))
    expect(await creditsOf(user.id)).toBe(50)

    await deliver(event('adjustment.updated', { ...adjustment, status: 'approved' }))
    await deliver(event('adjustment.updated', { ...adjustment, status: 'approved' }))
    expect(await creditsOf(user.id)).toBe(0)
    expect(await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).toMatchObject({ status: 'refunded', refundedCredits: 200 })
    expect(await prisma.creditEntry.findMany({ where: { userId: user.id, reason: 'refund' } })).toMatchObject([
      { delta: -50, balanceAfter: 0, adjustmentId: 'adj_test_refund' },
    ])
  })

  it('takes back the refunded share of a partial refund', async () => {
    const { user, payment } = await pendingPayment()
    await deliver(event('transaction.completed', completed(payment.id)))
    const partial = { id: 'adj_test_partial', action: 'refund', type: 'partial', status: 'approved', transaction_id: payment.id, totals: { total: '300' } }
    await deliver(event('adjustment.created', partial))
    expect(await creditsOf(user.id)).toBe(100)
    expect(await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).toMatchObject({ status: 'completed', refundedCredits: 100 })
  })
})
