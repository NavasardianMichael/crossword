// A config file opts the Prisma CLI out of loading `.env` implicitly, so it is loaded here.
import { defineConfig } from 'prisma/config'

import 'dotenv/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
