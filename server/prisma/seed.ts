import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SeedEntry } from '../src/lib/content/types.js'
import { prisma } from '../src/lib/prisma.js'
import { type Locale, LOCALES, PROPER_NOUN_TOPICS } from '../src/lib/puzzle.js'
import { insertEntries } from '../src/services/entryPool.js'
import { validateEntry } from '../src/services/entryValidation.js'

/**
 * Loads the hand-written words (`seed/entries.<locale>.json`) into the pool as `origin: 'seed'`,
 * through the same validation and upsert as generated words. Idempotent: re-running only adds
 * new words and clues, so growing a file and seeding again is safe.
 */

/** Beside this file under tsx; from the working directory in a compiled release. */
const seedFile = (locale: Locale): string => {
  const candidates = [
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed', `entries.${locale}.json`),
    path.resolve(process.cwd(), 'prisma', 'seed', `entries.${locale}.json`),
  ]
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0]!
}

const seedLocale = async (locale: Locale) => {
  const entries = JSON.parse(await readFile(seedFile(locale), 'utf8')) as SeedEntry[]
  let inserted = 0
  const invalid: string[] = []

  for (const entry of entries) {
    const topic = entry.topics.find((each) => PROPER_NOUN_TOPICS.includes(each)) ?? entry.topics[0]!
    const result = validateEntry(entry, locale, topic)
    if ('rejection' in result) {
      invalid.push(`${entry.word} (${result.rejection})`)
      continue
    }
    const stored = await insertEntries(locale, entry.topics, [result.entry], { origin: 'seed', model: null, verified: true })
    inserted += stored.inserted
  }

  console.log(`${locale}: ${inserted} new seed words (${entries.length} in the file).`)
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
