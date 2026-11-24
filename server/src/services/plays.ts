import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { GRID_SPECS, type Locale, WORD_STATES } from '../lib/puzzle.js'

/**
 * The account's seen-list (`PuzzlePlay`): every puzzle a signed-in player was shown, with how
 * each word went. The device keeps its own list and still sends it as `exclude`; this one
 * follows the account to every device (`drawCandidates`' `player`).
 *
 * A row is written when the account builds a puzzle (`recordShown`, in the transaction that
 * stores it) and whenever a device reports progress (`savePlays`): a puzzle opened from a link,
 * words solved or revealed, games played as a guest before signing in.
 */

export type PlayReport = { id: string; states: number[] }

const OPEN = 0

/** The most words any grid holds: the longest `states` a report may carry. */
export const MAX_PUZZLE_WORDS = Math.max(...Object.values(GRID_SPECS).flatMap((sizes) => Object.values(sizes).map(({ maxWords }) => maxWords)))

const isWordState = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < WORD_STATES.length

export const isStateList = (value: unknown, maxLength: number): value is number[] =>
  Array.isArray(value) && value.length > 0 && value.length <= maxLength && value.every(isWordState)

/** The first outcome stays: a word solved on one device is not undone by an erased cell or a later reveal. */
export const mergeStates = (stored: Uint8Array | null | undefined, incoming: readonly number[]): Uint8Array<ArrayBuffer> =>
  Uint8Array.from(incoming, (state, index) => (stored?.[index] ? stored[index] : state))

export const recordShown = (tx: Prisma.TransactionClient, userId: string, puzzleId: string, locale: Locale, words: number) =>
  tx.puzzlePlay.create({ data: { userId, puzzleId, locale, states: new Uint8Array(words).fill(OPEN) } })

/** Stores what a device reports; a report for an unknown puzzle or of the wrong length is skipped. Returns how many were kept. */
export const savePlays = async (userId: string, reports: readonly PlayReport[]): Promise<number> => {
  const ids = [...new Set(reports.map(({ id }) => id))]
  const [puzzles, stored] = await Promise.all([
    prisma.puzzle.findMany({ where: { id: { in: ids } }, select: { id: true, locale: true, entryIds: true } }),
    prisma.puzzlePlay.findMany({ where: { userId, puzzleId: { in: ids } }, select: { puzzleId: true, states: true } }),
  ])
  const byId = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]))
  const storedStates = new Map(stored.map(({ puzzleId, states }) => [puzzleId, states]))

  let kept = 0
  for (const { id, states } of reports) {
    const puzzle = byId.get(id)
    if (!puzzle || puzzle.entryIds.length !== states.length) continue
    const merged = mergeStates(storedStates.get(id), states)
    await prisma.puzzlePlay.upsert({
      where: { userId_puzzleId: { userId, puzzleId: id } },
      create: { userId, puzzleId: id, locale: puzzle.locale, states: merged },
      update: { states: merged },
    })
    storedStates.set(id, merged)
    kept++
  }
  return kept
}
