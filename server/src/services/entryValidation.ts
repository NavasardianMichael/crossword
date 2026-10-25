import { createHash } from 'node:crypto'
import { cellCount, normalizeWord, SCRIPTS, toCells } from '../lib/alphabet.js'
import { minStem } from '../lib/layout/grid.js'
import {
  type Difficulty,
  type Locale,
  LOCALES,
  MAX_CLUE_LENGTH,
  MAX_SHORT_CLUE_LENGTH,
  MAX_WORD_LENGTH,
  MIN_WORD_LENGTH,
  PROPER_NOUN_TOPICS,
  type Topic,
} from '../lib/puzzle.js'

/**
 * The checks every word and clue passes before it reaches the pool — generated or seeded.
 * Each one is a reason a puzzle would be wrong or unfair; a failing item is dropped, never
 * repaired. The model writes, code decides.
 */

export type CandidateEntry = {
  word: string
  clue: string
  shortClue: string
  kind: 'common' | 'proper'
  difficulty: Difficulty
}

export type ValidEntry = CandidateEntry & {
  /** Normalized cell string. */
  answer: string
  length: number
  firstCell: string
}

export type Rejection =
  | 'notAWord'
  | 'length'
  | 'properNoun'
  | 'clueLength'
  | 'shortClueLength'
  | 'clueScript'
  | 'giveaway'
  | 'duplicate'

const MIN_CLUE_LENGTH = 6
const MIN_SHORT_CLUE_LENGTH = 3
const MAX_SHORT_CLUE_WORDS = 3
/** Letters an inflection or a close derivation adds to a stem: `лес` → `лесами`, `garden` → `gardener`. */
const MAX_INFLECTION = 3

/** Letters of another script in a clue mean the model mixed languages ("по-английски", a Latin brand). */
const FOREIGN_SCRIPTS: Record<Locale, RegExp> = {
  en: /[Ѐ-ӿԱ-և]/,
  ru: /[a-zԱ-և]/i,
  hy: /[a-zЀ-ӿ]/i,
}

/** Collapses whitespace and trims; non-strings become ''. */
export const clip = (text: unknown, maxLength: number): string =>
  typeof text === 'string' ? text.trim().replace(/\s+/g, ' ').slice(0, maxLength + 1) : ''

/** Clue words, folded the way answers are, so `Лесной` and `лес` compare. */
const clueTokens = (clue: string, locale: Locale): string[] =>
  clue
    .split(/[^\p{L}]+/u)
    .map((token) => normalizeWord(token, locale))
    .filter((token): token is string => Boolean(token))

const sharedPrefix = (a: readonly string[], b: readonly string[]): number => {
  let k = 0
  while (k < a.length && k < b.length && a[k] === b[k]) k++
  return k
}

/**
 * Whether a clue gives its answer away: the answer itself, a word of the same root (`лес` →
 * `лесник`), a long part of a compound (`пароход` → `ход`), or the answer hidden across words.
 */
export const isGiveaway = (answer: string, clue: string, locale: Locale): boolean => {
  const answerCells = toCells(answer, locale)
  const stem = minStem(answerCells.length)
  const tokens = clueTokens(clue, locale)
  // Long answers only: a short one turns up across word boundaries by chance ("greatest earn" → "tear").
  if (answerCells.length >= 6 && tokens.join('').includes(answer)) return true

  return tokens.some((token) => {
    // eslint-disable-next-line security/detect-possible-timing-attacks -- comparing words, not secrets
    if (token === answer) return true
    const tokenCells = toCells(token, locale)
    // Both must carry the whole stem, so "for" is no giveaway for "forest", but "лесной" is for "лес";
    // and an inflection adds a few letters at most, so "cardinal" is no giveaway for "car".
    // Deliberately strict for short answers: "часть" is wrongly caught for "час", but "лесной" for "лес"
    // must be — a dropped clue costs one retry, a giveaway spoils the grid.
    if (
      tokenCells.length >= stem &&
      tokenCells.length <= answerCells.length + MAX_INFLECTION &&
      sharedPrefix(tokenCells, answerCells) >= stem
    ) {
      return true
    }
    return tokenCells.length >= 4 && tokenCells.length * 2 >= answerCells.length && answer.includes(token)
  })
}

export const clueHash = (text: string): string =>
  createHash('sha1')
    .update(text.toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, ''))
    .digest('hex')

export type ValidationResult = { entry: ValidEntry } | { rejection: Rejection }

export const validateEntry = (candidate: CandidateEntry, locale: Locale, topic: Topic): ValidationResult => {
  const answer = normalizeWord(candidate.word, locale)
  if (!answer) return { rejection: 'notAWord' }

  const length = cellCount(answer, locale)
  if (length < MIN_WORD_LENGTH || length > MAX_WORD_LENGTH) return { rejection: 'length' }
  if (candidate.kind === 'proper' && !PROPER_NOUN_TOPICS.includes(topic)) return { rejection: 'properNoun' }

  const clue = clip(candidate.clue, MAX_CLUE_LENGTH)
  const shortClue = clip(candidate.shortClue, MAX_SHORT_CLUE_LENGTH)
  if (clue.length < MIN_CLUE_LENGTH || clue.length > MAX_CLUE_LENGTH) return { rejection: 'clueLength' }
  if (
    shortClue.length < MIN_SHORT_CLUE_LENGTH ||
    shortClue.length > MAX_SHORT_CLUE_LENGTH ||
    shortClue.split(' ').length > MAX_SHORT_CLUE_WORDS
  ) {
    return { rejection: 'shortClueLength' }
  }
  for (const text of [clue, shortClue]) {
    if (!SCRIPTS[locale].test(text) || FOREIGN_SCRIPTS[locale].test(text)) return { rejection: 'clueScript' }
    if (isGiveaway(answer, text, locale)) return { rejection: 'giveaway' }
  }

  return {
    entry: {
      ...candidate,
      clue,
      shortClue,
      answer,
      length,
      firstCell: toCells(answer, locale)[0]!,
    },
  }
}

/** Validates a batch, dropping failures and in-batch duplicates; also counts why items failed. */
export const validateBatch = (
  candidates: readonly CandidateEntry[],
  locale: Locale,
  topic: Topic
): { entries: ValidEntry[]; rejections: Partial<Record<Rejection, number>> } => {
  const entries: ValidEntry[] = []
  const rejections: Partial<Record<Rejection, number>> = {}
  const seen = new Set<string>()

  for (const candidate of candidates) {
    const result = validateEntry(candidate, locale, topic)
    const rejection = 'rejection' in result ? result.rejection : seen.has(result.entry.answer) ? 'duplicate' : null
    if (rejection) {
      rejections[rejection] = (rejections[rejection] ?? 0) + 1
      continue
    }
    if ('entry' in result) {
      seen.add(result.entry.answer)
      entries.push(result.entry)
    }
  }
  return { entries, rejections }
}

export const isContentLocale = (value: string): value is Locale => LOCALES.includes(value as Locale)
