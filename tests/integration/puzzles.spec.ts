import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from '../../server/src/app'
import { prisma } from '../../server/src/lib/prisma'
import { LOCALES, type PuzzleView } from '../../server/src/lib/puzzle'
import { signSession } from '../../server/src/lib/session'

/** Requests from the web app carry its Origin; the CSRF guard refuses any other. */
const ORIGIN = 'http://localhost:7007'

const app = createApp()

/** Building is paid (`billing.spec.ts` covers that); these tests build as an account with credits to spare. */
let cookie = ''

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { email: 'puzzles@test.local', fullName: 'Puzzle Tester', emailVerifiedAt: new Date(), credits: 1_000_000 },
  })
  cookie = `crossword-session=${signSession({ userId: user.id, tokenVersion: user.tokenVersion })}`
})

afterAll(async () => {
  await prisma.$disconnect()
})

const create = (body: Record<string, unknown>) =>
  request(app)
    .post('/puzzles')
    .set('Origin', ORIGIN)
    .set('Cookie', cookie)
    .send({ locale: 'en', format: 'classic', topic: 'any', difficulty: 3, size: 'small', exclude: [], ...body })

describe('health', () => {
  it('reports Gemini off and the seeded pool', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.value.gemini).toBe(false)
    for (const locale of LOCALES) expect(response.body.value.pool[locale]).toBeGreaterThan(100)
  })

  it('answers unknown routes in the envelope', async () => {
    const response = await request(app).get('/nope')
    expect(response.status).toBe(404)
    expect(response.body.error).toEqual({ code: 404, message: 'Not found' })
  })
})

describe('POST /puzzles', () => {
  it.each([
    ['en', 'classic'],
    ['ru', 'classic'],
    ['hy', 'classic'],
    ['en', 'scanword'],
    ['ru', 'scanword'],
    ['hy', 'scanword'],
  ])('builds a %s %s from the seed pool, with a clue and a solution for every word', async (locale, format) => {
    const response = await create({ locale, format })
    expect(response.status).toBe(201)
    const puzzle = response.body.value as PuzzleView
    expect(puzzle.id).toMatch(/^[0-9A-Za-z]{10}$/)
    expect(puzzle.cells).toHaveLength(puzzle.width * puzzle.height)
    expect(puzzle.solution).toHaveLength(puzzle.cells.length)
    for (const word of puzzle.words) {
      expect(word.clue.length).toBeGreaterThan(2)
      if (format === 'scanword') expect(puzzle.cells[word.clueCell!]!.k).toBe('C')
      else expect(word.number).toBeGreaterThan(0)
    }
  })

  it('never returns an excluded word, until the pool runs out', async () => {
    const seen: number[] = []
    for (let round = 0; round < 6; round++) {
      const response = await create({ locale: 'ru', exclude: seen })
      if (response.status === 503) break
      expect(response.status).toBe(201)
      const ids = (response.body.value as PuzzleView).words.map(({ entryId }) => entryId)
      expect(ids.filter((id) => seen.includes(id))).toEqual([])
      seen.push(...ids)
    }
    expect(seen.length).toBeGreaterThan(30)
  })

  it('answers pool_exhausted when even the oldest-seen words cannot fill it', async () => {
    // Swahili has only its hand-written words, so its whole pool fits among the newest 500 seen:
    // none of it may come back.
    const all = await prisma.entry.findMany({ where: { locale: 'sw' }, select: { id: true } })
    expect(all.length).toBeLessThan(500)
    const response = await create({ locale: 'sw', exclude: all.map(({ id }) => id) })
    expect(response.status).toBe(503)
    expect(response.body.error.message).toBe('pool_exhausted')
    // …and the gap is recorded for the refill job.
    const demand = await prisma.poolDemand.findUnique({ where: { locale_topic_difficulty: { locale: 'sw', topic: 'any', difficulty: 3 } } })
    expect(demand?.shortfall).toBeGreaterThan(0)
  })

  it('brings back the oldest-seen words once unseen ones run out, never the newest', async () => {
    const all = (await prisma.entry.findMany({ where: { locale: 'ru' }, select: { id: true }, orderBy: { id: 'asc' } })).map(({ id }) => id)
    const oldest = all.slice(0, Math.floor(all.length / 2))
    const newest = all.slice(oldest.length)
    // Seen-list order is oldest first: the old half, many words since (ids no pool has), the new half.
    const since = Array.from({ length: 1500 }, (_, index) => 900_000_000 + index)
    const response = await create({ locale: 'ru', difficulty: 1, exclude: [...oldest, ...since, ...newest] })
    expect(response.status).toBe(201)
    const ids = (response.body.value as PuzzleView).words.map(({ entryId }) => entryId)
    const newestSet = new Set(newest)
    expect(ids.filter((id) => newestSet.has(id))).toEqual([])
  })

  it('looks one puzzle ahead in both buckets a themed puzzle draws from', async () => {
    expect((await create({ locale: 'en', topic: 'food', difficulty: 1, exclude: [] })).status).toBe(201)
    const key = (topic: string) => ({ locale_topic_difficulty: { locale: 'en', topic, difficulty: 1 } })
    const [themed, glue] = await Promise.all([
      prisma.poolDemand.findUnique({ where: key('food') }),
      prisma.poolDemand.findUnique({ where: key('general') }),
    ])
    expect(themed?.requests).toBe(1)
    expect(glue?.requests).toBe(1)
    // A gap names the length band most short; no gap, no band.
    for (const row of [themed!, glue!]) expect(row.lengthBand === null).toBe(row.shortfall === 0)
  })

  it('rejects unsupported options', async () => {
    expect((await create({ locale: 'xx' })).status).toBe(400)
    expect((await create({ format: 'sudoku' })).status).toBe(400)
    expect((await create({ topic: 'cars' })).status).toBe(400)
    expect((await create({ difficulty: 4 })).status).toBe(400)
  })

  it('refuses a cross-origin request', async () => {
    const response = await request(app).post('/puzzles').set('Origin', 'https://evil.example').send({})
    expect(response.status).toBe(403)
  })
})

describe('GET /puzzles/:id', () => {
  it('returns the identical snapshot', async () => {
    const created = (await create({ locale: 'en', format: 'scanword' })).body.value as PuzzleView
    const response = await request(app).get(`/puzzles/${created.id}`)
    expect(response.status).toBe(200)
    expect(response.body.value).toEqual(created)
    expect(response.headers['cache-control']).toContain('immutable')
  })

  it('answers 404 for an unknown id and 400 for a malformed one', async () => {
    expect((await request(app).get('/puzzles/ZZZZZZZZZZ')).status).toBe(404)
    expect((await request(app).get('/puzzles/nope')).status).toBe(400)
  })
})

describe('reports and results', () => {
  it('counts one report per reporter and retires an AI clue after three', async () => {
    const puzzle = (await create({ locale: 'en' })).body.value as PuzzleView
    const word = puzzle.words[0]!
    // Make the word AI-written: seed words are hand-checked and never retired by reports.
    await prisma.entry.update({ where: { id: word.entryId }, data: { origin: 'ai' } })

    for (const ip of ['1.1.1.1', '2.2.2.2', '2.2.2.2', '3.3.3.3']) {
      const response = await request(app)
        .post(`/puzzles/${puzzle.id}/report`)
        .set('Origin', ORIGIN)
        .set('X-Forwarded-For', ip)
        .send({ wordId: word.id, reason: 'wrongClue' })
      expect(response.status).toBe(200)
    }

    const stored = await prisma.puzzle.findUniqueOrThrow({ where: { id: puzzle.id } })
    const clue = await prisma.clue.findUniqueOrThrow({ where: { id: stored.clueIds[word.id]! } })
    expect(clue.reportCount).toBe(3)
    expect(clue.retiredAt).not.toBeNull()
  })

  it('records a result and the words revealed', async () => {
    const puzzle = (await create({ locale: 'en' })).body.value as PuzzleView
    const response = await request(app)
      .post(`/puzzles/${puzzle.id}/result`)
      .set('Origin', ORIGIN)
      .send({ solved: true, revealedWordIds: [0] })
    expect(response.status).toBe(200)

    const stored = await prisma.puzzle.findUniqueOrThrow({ where: { id: puzzle.id } })
    expect(stored.solveCount).toBe(1)
    const entry = await prisma.entry.findUniqueOrThrow({ where: { id: puzzle.words[0]!.entryId } })
    expect(entry.revealCount).toBe(1)
  })
})
