import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Loads `server/.env.<NODE_ENV>.local` — `.env.development.local` unless NODE_ENV says
 * otherwise — never whatever `.env` sits in `process.cwd()`. `pnpm dev` runs concurrently
 * from the repo root, so `import 'dotenv/config'` would read the Next.js env and leave Prisma
 * with the wrong `DATABASE_URL`. Values already in the environment win, so on the production
 * host (no such file in the release) systemd's EnvironmentFile is all there is.
 */
const environment = process.env.NODE_ENV || 'development'

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), `../.env.${environment}.local`),
  quiet: true,
})
