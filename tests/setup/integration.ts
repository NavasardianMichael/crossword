import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'

/**
 * Prepares the throwaway `crossword_test` database: create it if missing, apply the migrations
 * (additive `migrate deploy`, never `reset`), clear its rows, seed the hand-written words.
 *
 * **Fail-safe by construction.** Vitest does not pass a project's `test.env` to globalSetup,
 * so this file resolves the URL itself and refuses to touch any database not named
 * `crossword_test` — an unset variable must never fall through to
 * `server/.env.development.local` and the developer's real data.
 */
const SERVER_DIR = path.resolve(__dirname, '../../server')
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://crossword:crossword@localhost:5007/crossword_test?schema=public'

const databaseName = (url: string) => new URL(url).pathname.replace(/^\//, '')

/** The slice of PrismaClient this setup uses; the type itself lives in the server package. */
type SetupClient = {
  $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>
  $executeRawUnsafe: (query: string) => Promise<number>
  $disconnect: () => Promise<void>
}

// The server package owns @prisma/client; resolve it from there.
const { PrismaClient } = createRequire(path.join(SERVER_DIR, 'package.json'))('@prisma/client') as {
  PrismaClient: new (options: { datasources: { db: { url: string } } }) => SetupClient
}

const TABLES = ['EntryReport', 'Clue', 'Entry', 'Puzzle', 'PoolDemand', 'GenerationLog']

export default async function setup() {
  if (databaseName(TEST_DATABASE_URL) !== 'crossword_test') {
    throw new Error(`Refusing to prepare "${databaseName(TEST_DATABASE_URL)}": integration tests only run against crossword_test.`)
  }

  const adminUrl = TEST_DATABASE_URL.replace('/crossword_test', '/crossword')
  const admin = new PrismaClient({ datasources: { db: { url: adminUrl } } })
  try {
    const rows = await admin.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) AS count FROM pg_database WHERE datname = 'crossword_test'`
    if (!Number(rows[0]?.count)) await admin.$executeRawUnsafe('CREATE DATABASE crossword_test')
  } finally {
    await admin.$disconnect()
  }

  const env = { ...process.env, DATABASE_URL: TEST_DATABASE_URL }
  execSync('npx prisma migrate deploy', { cwd: SERVER_DIR, env, stdio: 'pipe' })

  const test = new PrismaClient({ datasources: { db: { url: TEST_DATABASE_URL } } })
  try {
    await test.$executeRawUnsafe(`TRUNCATE ${TABLES.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE`)
  } finally {
    await test.$disconnect()
  }

  execSync('npx tsx prisma/seed.ts', { cwd: SERVER_DIR, env, stdio: 'pipe' })
}
