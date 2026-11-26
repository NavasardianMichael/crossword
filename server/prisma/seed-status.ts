import path from 'node:path'
import { readSeedFiles } from './seedFiles.js'
import { LOCALES } from '../src/lib/puzzle.js'

/**
 * Where the word seeding stands, per language: hand-written words, Claude-written files and words,
 * and the next file a writer should create. What a session continuing the seeding reads first
 * (`docs/WORD_SEEDING_PLAN.md`, "Continuing the seeding").
 *
 *   pnpm --filter crossword-server exec tsx prisma/seed-status.ts
 */
const rows = await Promise.all(
  LOCALES.map(async (locale) => {
    const files = await readSeedFiles(locale)
    const claude = files.filter(({ origin }) => origin === 'claude')
    const last = claude.map(({ file }) => Number.parseInt(path.basename(file), 10)).filter(Number.isFinite)
    const next = String((last.length ? Math.max(...last) : 0) + 1).padStart(2, '0')
    return {
      locale,
      handWritten: files.find(({ origin }) => origin === 'seed')?.entries.length ?? 0,
      claudeFiles: claude.length,
      claudeWords: claude.reduce((sum, { entries }) => sum + entries.length, 0),
      next: `seed/claude/${locale}/${next}.json`,
    }
  })
)

console.table(rows.sort((a, b) => a.claudeWords - b.claudeWords || a.locale.localeCompare(b.locale)))
console.log(`Claude-written words in all: ${rows.reduce((sum, row) => sum + row.claudeWords, 0)}`)
