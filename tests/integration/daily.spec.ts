import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'
import { createApp } from '../../server/src/app'
import { prisma } from '../../server/src/lib/prisma'
import { buildDaily, type DailyView, getDailyView, utcDay } from '../../server/src/services/daily'
import { buildPuzzle } from '../../server/src/services/puzzleBuilder'

/**
 * The daily crossword (`services/daily.ts`): one per language per UTC day, from the daily
 * reserve. German only, so no other file's pool is touched.
 */
const app = createApp()
const LOCALE = 'de'

afterAll(async () => {
  await prisma.$disconnect()
})

describe('the daily crossword', () => {
  it('builds one classic medium puzzle per day, from the reserve, and takes its words out of it', async () => {
    const today = utcDay(0)
    const id = await buildDaily(LOCALE, today)
    expect(await buildDaily(LOCALE, today)).toBe(id)
    expect(await prisma.dailyPuzzle.count({ where: { locale: LOCALE, date: today } })).toBe(1)

    const puzzle = await prisma.puzzle.findUniqueOrThrow({ where: { id } })
    expect(puzzle.format).toBe('classic')
    expect(puzzle.size).toBe('medium')
    const placed = await prisma.entry.findMany({ where: { id: { in: puzzle.entryIds } }, select: { dailyReserve: true } })
    expect(placed.every(({ dailyReserve }) => !dailyReserve)).toBe(true)
    // The reserve was filled from never-served words.
    expect(await prisma.entry.count({ where: { locale: LOCALE, dailyReserve: true } })).toBeGreaterThan(0)
  })

  it('serves today without answers, yesterday with them, and never tomorrow', async () => {
    const yesterdayId = await buildDaily(LOCALE, utcDay(-1))
    const tomorrowId = await buildDaily(LOCALE, utcDay(1))

    const response = await request(app).get(`/daily/${LOCALE}`)
    expect(response.status).toBe(200)
    const view = response.body.value as DailyView
    expect(view.date).toBe(utcDay(0))
    expect(view.today?.date).toBe(utcDay(0))
    expect(view.today?.words.length).toBeGreaterThan(10)
    expect(JSON.stringify(view.today)).not.toContain('solution')
    expect(view.today?.words.every((word) => !('answer' in word))).toBe(true)

    expect(view.yesterday?.id).toBe(yesterdayId)
    for (const word of view.yesterday!.words) expect(word.answer.every(Boolean)).toBe(true)

    expect(JSON.stringify(view)).not.toContain(tomorrowId)
    expect(view.previous.map(({ id }) => id)).toEqual([yesterdayId])
  })

  it('keeps custom puzzles away from the reserve', async () => {
    const reserved = new Set(
      (await prisma.entry.findMany({ where: { locale: LOCALE, dailyReserve: true }, select: { id: true } })).map(({ id }) => id)
    )
    expect(reserved.size).toBeGreaterThan(0)
    for (let round = 0; round < 3; round++) {
      const puzzle = await buildPuzzle({ locale: LOCALE, format: 'scanword', topic: 'any', difficulty: 2, size: 'small', exclude: [] })
      expect(puzzle.words.filter(({ entryId }) => reserved.has(entryId))).toEqual([])
    }
  })

  it('answers an unknown language with 400', async () => {
    expect((await request(app).get('/daily/xx')).status).toBe(400)
  })

  it('is empty, not an error, before the first daily', async () => {
    const view = await getDailyView('sw')
    expect(view).toEqual({ date: utcDay(0), today: null, yesterday: null, previous: [] })
  })
})
