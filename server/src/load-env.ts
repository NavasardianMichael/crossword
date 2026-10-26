import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Always load `server/.env`, not whatever `.env` sits in `process.cwd()`. `pnpm dev` runs
 * concurrently from the repo root, so `import 'dotenv/config'` would otherwise read the
 * Next.js env and leave Prisma with the wrong `DATABASE_URL`.
 */
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env'),
  quiet: true,
})
