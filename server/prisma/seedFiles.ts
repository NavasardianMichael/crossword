import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SeedEntry } from '../src/lib/content/types.js'
import type { Locale } from '../src/lib/puzzle.js'

/**
 * The seed words of a language, shared by the loader (`seed.ts`) and the checker
 * (`check-seed.ts`):
 * - `seed/entries.<locale>.json` — hand-written and hand-checked (`origin: 'seed'`, never retired
 *   by reports);
 * - `seed/claude/<locale>/*.json` — written by Claude agents in development
 *   (`docs/WORD_SEEDING_BRIEF.md`; `origin: 'claude'`, retired by reports like AI words), in file
 *   name order.
 */
export type SeedOrigin = 'seed' | 'claude'
export type SeedFile = { file: string; origin: SeedOrigin; entries: SeedEntry[] }

/** Beside this file under tsx; from the working directory in a compiled release (`dist/prisma`). */
const seedDir = (): string => {
  const candidates = [
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed'),
    path.resolve(process.cwd(), 'prisma', 'seed'),
  ]
  return candidates.find((candidate) => existsSync(path.join(candidate, 'entries.en.json'))) ?? candidates[0]!
}

export const readSeedFiles = async (locale: Locale): Promise<SeedFile[]> => {
  const dir = seedDir()
  const files: { file: string; origin: SeedOrigin }[] = [{ file: path.join(dir, `entries.${locale}.json`), origin: 'seed' }]
  const claudeDir = path.join(dir, 'claude', locale)
  if (existsSync(claudeDir)) {
    const names = readdirSync(claudeDir).filter((name) => name.endsWith('.json')).sort()
    files.push(...names.map((name) => ({ file: path.join(claudeDir, name), origin: 'claude' as const })))
  }
  return Promise.all(
    files.map(async ({ file, origin }) => ({
      file,
      origin,
      entries: JSON.parse(await readFile(file, 'utf8')) as SeedEntry[],
    }))
  )
}
