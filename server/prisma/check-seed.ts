import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { LocaleContent, SeedEntry } from '../src/lib/content/types.js'
import { DIFFICULTIES, isLocale, type Locale, PROPER_NOUN_TOPICS, TOPICS } from '../src/lib/puzzle.js'
import { validateEntry } from '../src/services/entryValidation.js'

/**
 * Validates a locale's hand-written material — the seed words and the prompt examples — with
 * the same rules generated words must pass, and prints the mix the layouts depend on.
 *
 *   pnpm --filter crossword-server exec tsx prisma/check-seed.ts ru
 *
 * Exits non-zero on any invalid item, so it can gate CI.
 */
const seedFile = (locale: Locale) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed', `entries.${locale}.json`)

/** The topic a seed entry is validated under: one that allows its proper noun, if it is one. */
const topicFor = (entry: SeedEntry) => entry.topics.find((topic) => PROPER_NOUN_TOPICS.includes(topic)) ?? entry.topics[0]!

export const checkLocale = async (locale: Locale): Promise<string[]> => {
  const errors: string[] = []
  const entries = JSON.parse(await readFile(seedFile(locale), 'utf8')) as SeedEntry[]
  const answers = new Map<string, string>()
  const lengths: Record<string, number> = { '3-5': 0, '6-8': 0, '9+': 0 }
  const perTopic = Object.fromEntries(TOPICS.map((topic) => [topic, 0]))
  const perDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0 }

  for (const entry of entries) {
    const label = `${locale} seed "${entry.word}"`
    if (!Array.isArray(entry.topics) || !entry.topics.length || entry.topics.some((topic) => !TOPICS.includes(topic))) {
      errors.push(`${label}: unknown topics ${JSON.stringify(entry.topics)}`)
      continue
    }
    if (!DIFFICULTIES.includes(entry.difficulty)) errors.push(`${label}: difficulty ${entry.difficulty}`)
    const result = validateEntry(entry, locale, topicFor(entry))
    if ('rejection' in result) {
      errors.push(`${label}: ${result.rejection}`)
      continue
    }
    const previous = answers.get(result.entry.answer)
    if (previous) errors.push(`${label}: duplicate of "${previous}"`)
    answers.set(result.entry.answer, entry.word)

    const { length } = result.entry
    lengths[length <= 5 ? '3-5' : length <= 8 ? '6-8' : '9+']!++
    for (const topic of entry.topics) perTopic[topic]!++
    perDifficulty[entry.difficulty]!++
  }

  // Loaded per locale, so one language's material can be checked before the others exist.
  const loaded = (await import(`../src/lib/content/${locale}.js`)) as Record<string, LocaleContent>
  const content = loaded[`${locale.toUpperCase()}_CONTENT`]!
  for (const example of content.examples) {
    const result = validateEntry({ ...example, kind: 'common' }, locale, 'general')
    if ('rejection' in result) errors.push(`${locale} example "${example.word}": ${result.rejection}`)
  }
  for (const topic of TOPICS) {
    if ((content.subtopics[topic]?.length ?? 0) < 10) errors.push(`${locale}: fewer than 10 subtopics for ${topic}`)
  }

  console.log(`${locale}: ${entries.length} seed entries`, { lengths, perTopic, perDifficulty })
  return errors
}

const main = async () => {
  const requested = process.argv.slice(2).filter(isLocale)
  const errors = (await Promise.all((requested.length ? requested : (['en', 'ru', 'hy'] as const)).map(checkLocale))).flat()
  for (const error of errors) console.error(error)
  if (errors.length) {
    console.error(`${errors.length} invalid item(s)`)
    process.exitCode = 1
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) void main()
