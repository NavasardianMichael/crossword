import { readSeedFiles } from './seedFiles.js'
import { prisma } from '../src/lib/prisma.js'
import { type Locale, LOCALES, PROPER_NOUN_TOPICS } from '../src/lib/puzzle.js'
import { insertEntries } from '../src/services/entryPool.js'
import { validateEntry } from '../src/services/entryValidation.js'

/**
 * Loads the seed words (`seedFiles.ts`: the hand-written file, then the Claude-written ones) into
 * the pool, through the same validation and upsert as generated words. Idempotent: re-running only
 * adds new words and clues, so growing a file and seeding again is safe. A word the pool already
 * has — from Gemini or an earlier file — keeps its id and gains the new clues; a retired one stays
 * retired. Every deploy runs it (`node dist/prisma/seed.js`).
 */
const seedLocale = async (locale: Locale) => {
  let inserted = 0
  let existing = 0
  let retired = 0
  let total = 0
  const invalid: string[] = []

  for (const { origin, entries } of await readSeedFiles(locale)) {
    total += entries.length
    for (const entry of entries) {
      const topic = entry.topics.find((each) => PROPER_NOUN_TOPICS.includes(each)) ?? entry.topics[0]!
      const result = validateEntry(entry, locale, topic)
      if ('rejection' in result) {
        invalid.push(`${entry.word} (${result.rejection})`)
        continue
      }
      const stored = await insertEntries(locale, entry.topics, [result.entry], { origin, model: null, verified: true })
      inserted += stored.inserted
      if (!stored.ids.length) retired++
      else if (!stored.inserted) existing++
    }
  }

  console.log(`${locale}: ${inserted} new seed words, ${existing} already in the pool, ${retired} retired (${total} in the files).`)
  if (invalid.length) console.warn(`${locale}: skipped invalid seed words: ${invalid.join(', ')}`)
}

const main = async () => {
  for (const locale of LOCALES) await seedLocale(locale)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
