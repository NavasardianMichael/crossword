// A config file opts the Prisma CLI out of loading `.env` implicitly; the API's own loader
// picks `.env.<NODE_ENV>.local` here too, so the CLI and the server read the same file.
import { defineConfig } from 'prisma/config'

import './src/load-env.js'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
