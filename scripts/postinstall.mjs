#!/usr/bin/env node
/**
 * Runs after every `pnpm install` (root `postinstall`):
 *
 *   1. `prisma generate` — always. @prisma/client's own postinstall runs from the workspace
 *      root, finds no schema there and generates nothing, so without this every typecheck and
 *      build sees no PrismaClient. It writes code into node_modules only; it never connects to
 *      a database.
 *   2. `prisma migrate deploy` — applies pending migrations to the database that
 *      `server/.env.<NODE_ENV>.local` points at (the dev one by default). Additive only: never
 *      `migrate dev`, never a reset. Skipped, without failing the install, in CI (no database
 *      at install time), when that env file has no DATABASE_URL, or when Postgres is not
 *      reachable (Docker off) — `pnpm db:migrate` applies them later.
 *
 * The production host installs the API release in its own directory, without this script;
 * the deploy migrates there.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SERVER_DIR = path.join(ROOT, 'server')

const run = (command) => execSync(command, { cwd: ROOT, stdio: 'inherit' })
const skip = (reason) => console.log(`postinstall: migrations skipped — ${reason}`)

const ENV_FILE = `.env.${process.env.NODE_ENV || 'development'}.local`

const reachable = (host, port) =>
  new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout: 1500 })
    const done = (result) => {
      socket.destroy()
      resolve(result)
    }
    socket.once('connect', () => done(true))
    socket.once('timeout', () => done(false))
    socket.once('error', () => done(false))
  })

const databaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  const file = path.join(SERVER_DIR, ENV_FILE)
  if (!existsSync(file)) return ''
  const dotenv = createRequire(path.join(SERVER_DIR, 'package.json'))('dotenv')
  return dotenv.parse(readFileSync(file, 'utf8')).DATABASE_URL ?? ''
}

run('pnpm --filter crossword-server db:generate')

const main = async () => {
  if (process.env.CI) return skip('CI')
  const url = databaseUrl()
  if (!url) return skip(`no DATABASE_URL in server/${ENV_FILE}`)
  const { hostname, port } = new URL(url)
  if (!(await reachable(hostname, Number(port) || 5432))) return skip(`Postgres is not reachable at ${hostname}:${port} (pnpm db:up)`)
  try {
    run('pnpm --filter crossword-server db:deploy')
  } catch {
    console.error('postinstall: WARNING — `prisma migrate deploy` failed (see above). The install itself is fine.')
  }
}

await main()
