import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'
import { createApp } from '../../server/src/app'
import { prisma } from '../../server/src/lib/prisma'
import { MAX_SYNCED_PLAYS, type PuzzleView, WORD_STATES } from '../../server/src/lib/puzzle'
import { signSession } from '../../server/src/lib/session'

/** Requests from the web app carry its Origin; the CSRF guard refuses any other. */
const ORIGIN = 'http://localhost:7007'

const app = createApp()

afterAll(async () => {
  await prisma.$disconnect()
})

let players = 0
const newPlayer = async (): Promise<{ id: string; cookie: string }> => {
  const user = await prisma.user.create({
    data: { email: `player${++players}@test.local`, fullName: 'Player', emailVerifiedAt: new Date(), credits: 1_000_000 },
  })
  return { id: user.id, cookie: `crossword-session=${signSession({ userId: user.id, tokenVersion: user.tokenVersion })}` }
}

const create = (cookie: string, body: Record<string, unknown> = {}) =>
  request(app)
    .post('/puzzles')
    .set('Origin', ORIGIN)
    .set('Cookie', cookie)
    .send({ locale: 'en', format: 'classic', topic: 'any', difficulty: 3, size: 'small', exclude: [], ...body })

const sync = (cookie: string | null, plays: unknown) => {
  const call = request(app).post('/puzzles/plays').set('Origin', ORIGIN)
  return (cookie ? call.set('Cookie', cookie) : call).send({ plays })
}

const storedStates = async (userId: string, puzzleId: string) => {
  const play = await prisma.puzzlePlay.findUnique({ where: { userId_puzzleId: { userId, puzzleId } } })
  return play ? [...play.states].map((code) => WORD_STATES[code]) : null
}

const code = (state: (typeof WORD_STATES)[number]) => WORD_STATES.indexOf(state)

describe('the account seen-list', () => {
  it('joins a puzzle the account builds, every word open', async () => {
    const player = await newPlayer()
    const puzzle = (await create(player.cookie)).body.value as PuzzleView
    expect(await storedStates(player.id, puzzle.id)).toEqual(puzzle.words.map(() => 'open'))
    const play = await prisma.puzzlePlay.findUniqueOrThrow({ where: { userId_puzzleId: { userId: player.id, puzzleId: puzzle.id } } })
    expect(play.locale).toBe('en')
  })

  it('never repeats a word to the account, even from a device that sends no seen-list', async () => {
    const player = await newPlayer()
    const seen: number[] = []
    let built = 0
    for (let round = 0; round < 60; round++) {
      const response = await create(player.cookie, { locale: 'hy', exclude: [] })
      if (response.status === 503) break
      expect(response.status).toBe(201)
      const ids = (response.body.value as PuzzleView).words.map(({ entryId }) => entryId)
      expect(ids.filter((id) => seen.includes(id))).toEqual([])
      seen.push(...ids)
      built++
    }
    expect(built).toBeGreaterThan(3)

    // Another account has seen none of them.
    const other = await newPlayer()
    expect((await create(other.cookie, { locale: 'hy', exclude: [] })).status).toBe(201)
  })

  it('leaves out the words of a puzzle the account opened from a link', async () => {
    const author = await newPlayer()
    const shared = (await create(author.cookie, { locale: 'ru' })).body.value as PuzzleView

    const reader = await newPlayer()
    const report = await sync(reader.cookie, [{ id: shared.id, states: shared.words.map(() => 0) }])
    expect(report.status).toBe(200)
    expect(report.body.value).toEqual({ kept: 1 })

    const next = (await create(reader.cookie, { locale: 'ru', exclude: [] })).body.value as PuzzleView
    const sharedIds = new Set(shared.words.map(({ entryId }) => entryId))
    expect(next.words.filter(({ entryId }) => sharedIds.has(entryId))).toEqual([])
  })

  it('stores how each word went, and keeps a word’s first outcome', async () => {
    const player = await newPlayer()
    const puzzle = (await create(player.cookie)).body.value as PuzzleView
    const rest = puzzle.words.slice(2).map(() => code('open'))

    await sync(player.cookie, [{ id: puzzle.id, states: [code('solved'), code('open'), ...rest] }])
    // Later the solved word is revealed on another device, and the open one is revealed too.
    await sync(player.cookie, [{ id: puzzle.id, states: [code('revealed'), code('helped'), ...rest] }])

    expect(await storedStates(player.id, puzzle.id)).toEqual(['solved', 'helped', ...rest.map(() => 'open')])
  })

  it('skips a puzzle it does not know, and states of the wrong length', async () => {
    const player = await newPlayer()
    const puzzle = (await create(player.cookie)).body.value as PuzzleView
    const response = await sync(player.cookie, [
      { id: 'ZZZZZZZZZZ', states: [0, 0, 0] },
      { id: puzzle.id, states: [code('solved')] },
    ])
    expect(response.status).toBe(200)
    expect(response.body.value).toEqual({ kept: 0 })
    expect(await storedStates(player.id, puzzle.id)).toEqual(puzzle.words.map(() => 'open'))
  })

  it('refuses a guest and a malformed report', async () => {
    const player = await newPlayer()
    expect((await sync(null, [{ id: 'ZZZZZZZZZZ', states: [0] }])).status).toBe(401)
    expect((await sync(player.cookie, [])).status).toBe(400)
    expect((await sync(player.cookie, [{ id: 'nope', states: [0] }])).status).toBe(400)
    expect((await sync(player.cookie, [{ id: 'ZZZZZZZZZZ', states: [WORD_STATES.length] }])).status).toBe(400)
    const tooMany = Array.from({ length: MAX_SYNCED_PLAYS + 1 }, () => ({ id: 'ZZZZZZZZZZ', states: [0] }))
    expect((await sync(player.cookie, tooMany)).status).toBe(400)
  })

  it('refuses a cross-origin report', async () => {
    const player = await newPlayer()
    const response = await request(app)
      .post('/puzzles/plays')
      .set('Origin', 'https://evil.example')
      .set('Cookie', player.cookie)
      .send({ plays: [{ id: 'ZZZZZZZZZZ', states: [0] }] })
    expect(response.status).toBe(403)
  })
})
