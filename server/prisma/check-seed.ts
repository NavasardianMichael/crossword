import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readSeedFiles } from './seedFiles.js'
import { toCells } from '../src/lib/alphabet.js'
import { LOCALE_CONTENT } from '../src/lib/content/index.js'
import type { SeedEntry } from '../src/lib/content/types.js'
import { DIFFICULTIES, isLocale, type Locale, LOCALES, PROPER_NOUN_TOPICS, TOPICS } from '../src/lib/puzzle.js'
import { validateEntry } from '../src/services/entryValidation.js'

/**
 * Validates a language's seed words (every file, `seedFiles.ts`) and prompt examples with the same
 * rules generated words must pass, and gates the **balance** of the Claude-written words: a skewed
 * seed builds poor grids even when every word is valid. Prints the mix, and pairs of words that
 * may share a root for a person to look at.
 *
 *   pnpm --filter crossword-server exec tsx prisma/check-seed.ts ru
 *
 * Exits non-zero on any error; `tests/unit/seed.spec.ts` runs it for every language.
 */

/** The topic a seed entry is validated under: one that allows its proper noun, if it is one. */
const topicFor = (entry: SeedEntry) => entry.topics.find((topic) => PROPER_NOUN_TOPICS.includes(topic)) ?? entry.topics[0]!

/** Balance is only judged once a language has this many Claude-written words. */
const BALANCE_FROM = 200
/** Words of 3–5 cells knit a grid together: at least this share. */
const MIN_SHORT_SHARE = 0.35
const MIN_TOPIC_SHARE = 0.02
const MIN_DIFFICULTY_SHARE = 0.15
/** No starting letter may begin more than this share of the words. */
const MAX_LETTER_SHARE = 0.15

type Mix = { lengths: Record<string, number>; perTopic: Record<string, number>; perDifficulty: Record<number, number>; perLetter: Map<string, number> }

const emptyMix = (): Mix => ({
  lengths: { '3-5': 0, '6-8': 0, '9+': 0 },
  perTopic: Object.fromEntries(TOPICS.map((topic) => [topic, 0])),
  perDifficulty: { 1: 0, 2: 0, 3: 0 },
  perLetter: new Map(),
})

const balanceErrors = (locale: Locale, mix: Mix, total: number): string[] => {
  if (total < BALANCE_FROM) return []
  const errors: string[] = []
  const share = (count: number) => count / total
  const pct = (value: number) => `${Math.round(value * 100)}%`
  if (share(mix.lengths['3-5']!) < MIN_SHORT_SHARE) errors.push(`${locale} claude: 3–5 cell words are ${pct(share(mix.lengths['3-5']!))}, need ${pct(MIN_SHORT_SHARE)}`)
  for (const [topic, count] of Object.entries(mix.perTopic)) {
    if (share(count) < MIN_TOPIC_SHARE) errors.push(`${locale} claude: topic ${topic} is ${pct(share(count))}, need ${pct(MIN_TOPIC_SHARE)}`)
  }
  for (const [difficulty, count] of Object.entries(mix.perDifficulty)) {
    if (share(count) < MIN_DIFFICULTY_SHARE) errors.push(`${locale} claude: difficulty ${difficulty} is ${pct(share(count))}, need ${pct(MIN_DIFFICULTY_SHARE)}`)
  }
  for (const [letter, count] of mix.perLetter) {
    if (share(count) > MAX_LETTER_SHARE) errors.push(`${locale} claude: ${pct(share(count))} of the words start with "${letter}", at most ${pct(MAX_LETTER_SHARE)}`)
  }
  return errors
}

/**
 * Pairs that may be forms or derivatives of one word: the longer begins with all but the last
 * cell of the shorter (at least 3 cells). For a person to look at — not every hit is a pair
 * (`car` / `carpet`), so they are not errors.
 */
const possibleSameRoot = (locale: Locale, answers: readonly string[]): string[][] => {
  const cells = answers.map((answer) => ({ answer, cells: toCells(answer, locale) })).sort((a, b) => a.cells.length - b.cells.length)
  const pairs: string[][] = []
  for (let i = 0; i < cells.length; i++) {
    const short = cells[i]!
    const stem = short.cells.slice(0, Math.max(3, short.cells.length - 1)).join('')
    if (short.cells.length < 4) continue
    for (let j = i + 1; j < cells.length; j++) {
      if (cells[j]!.answer.startsWith(stem)) pairs.push([short.answer, cells[j]!.answer])
    }
  }
  return pairs
}

export const checkLocale = async (locale: Locale, { quiet = false } = {}): Promise<string[]> => {
  const errors: string[] = []
  const answers = new Map<string, string>()
  const claudeAnswers: string[] = []
  const mix = { seed: emptyMix(), claude: emptyMix() }
  let claudeTotal = 0

  for (const { file, origin, entries } of await readSeedFiles(locale)) {
    const where = path.basename(path.dirname(file)) === locale ? `${locale}/${path.basename(file)}` : path.basename(file)
    if (!Array.isArray(entries)) {
      errors.push(`${where}: not a JSON array`)
      continue
    }
    for (const entry of entries) {
      const label = `${where} "${entry.word}"`
      if (!Array.isArray(entry.topics) || !entry.topics.length || entry.topics.some((topic) => !TOPICS.includes(topic))) {
        errors.push(`${label}: unknown topics ${JSON.stringify(entry.topics)}`)
        continue
      }
      if (!DIFFICULTIES.includes(entry.difficulty)) errors.push(`${label}: difficulty ${entry.difficulty}`)
      // Hand-written words may carry a proper noun into a neighbouring topic (a poet under history); agents' may not.
      if (origin === 'claude' && entry.kind === 'proper' && entry.topics.some((topic) => !PROPER_NOUN_TOPICS.includes(topic))) {
        errors.push(`${label}: a proper noun may only be in ${PROPER_NOUN_TOPICS.join(' / ')}`)
      }
      const result = validateEntry(entry, locale, topicFor(entry))
      if ('rejection' in result) {
        errors.push(`${label}: ${result.rejection}`)
        continue
      }
      const previous = answers.get(result.entry.answer)
      if (previous) errors.push(`${label}: duplicate of ${previous}`)
      answers.set(result.entry.answer, label)

      const counts = mix[origin]
      const { length, firstCell } = result.entry
      counts.lengths[length <= 5 ? '3-5' : length <= 8 ? '6-8' : '9+']!++
      for (const topic of entry.topics) counts.perTopic[topic]!++
      counts.perDifficulty[entry.difficulty]!++
      counts.perLetter.set(firstCell, (counts.perLetter.get(firstCell) ?? 0) + 1)
      if (origin === 'claude') {
        claudeTotal++
        claudeAnswers.push(result.entry.answer)
      }
    }
  }
  errors.push(...balanceErrors(locale, mix.claude, claudeTotal))

  const content = LOCALE_CONTENT[locale]
  for (const example of content.examples) {
    const result = validateEntry({ ...example, kind: 'common' }, locale, 'general')
    if ('rejection' in result) errors.push(`${locale} example "${example.word}": ${result.rejection}`)
  }
  for (const topic of TOPICS) {
    if ((content.subtopics[topic]?.length ?? 0) < 10) errors.push(`${locale}: fewer than 10 subtopics for ${topic}`)
  }

  if (!quiet) {
    const { perLetter: _seedLetters, ...seedMix } = mix.seed
    console.log(`${locale}: ${answers.size} seed words (${claudeTotal} by Claude)`, { handWritten: seedMix })
    if (claudeTotal) {
      const { perLetter, ...claudeMix } = mix.claude
      const topLetters = [...perLetter].sort((a, b) => b[1] - a[1]).slice(0, 5)
      console.log(`${locale} claude mix`, { ...claudeMix, topLetters })
      const pairs = possibleSameRoot(locale, claudeAnswers)
      if (pairs.length) console.log(`${locale}: ${pairs.length} possible same-root pair(s) to look at:\n  ${pairs.map((pair) => pair.join(' / ')).join('\n  ')}`)
    }
  }
  return errors
}

const main = async () => {
  const requested = process.argv.slice(2).filter(isLocale)
  const errors = (await Promise.all((requested.length ? requested : [...LOCALES]).map((locale) => checkLocale(locale)))).flat()
  for (const error of errors) console.error(error)
  if (errors.length) {
    console.error(`${errors.length} invalid item(s)`)
    process.exitCode = 1
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) void main()
