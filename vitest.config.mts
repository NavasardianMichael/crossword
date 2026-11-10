import { defineConfig } from 'vitest/config'

/**
 * Two projects:
 * - `unit` — pure logic, no network, no database; runs anywhere in a couple of seconds. The
 *   layout engine and the alphabet rules live on the server but are pure, so they are unit-tested.
 * - `integration` — the real Express app (supertest) against a throwaway `crossword_test`
 *   database that `tests/setup/integration.ts` recreates and seeds on every run. Needs the
 *   Postgres container (`pnpm db:up`); Gemini is forced off so no test spends quota.
 */
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://crossword:crossword@localhost:5007/crossword_test?schema=public'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.spec.ts'],
          env: { TZ: 'UTC' },
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          environment: 'node',
          include: ['tests/integration/**/*.spec.ts'],
          globalSetup: ['tests/setup/integration.ts'],
          // One database: files must not interleave their writes.
          fileParallelism: false,
          env: {
            TZ: 'UTC',
            NODE_ENV: 'test',
            DATABASE_URL: TEST_DATABASE_URL,
            TEST_DATABASE_URL,
            GEMINI_KEY: '',
            CORS_ORIGIN: 'http://localhost:7007',
            POOL_REFILL_ENABLED: 'false',
            RATE_LIMIT_ENABLED: 'false',
            // Paddle: no API key (the shop is closed), but webhooks verify against this secret.
            PADDLE_API_KEY: '',
            PADDLE_WEBHOOK_SECRET: 'pdl_ntfset_test_secret',
            PADDLE_PRICE_ID_STARTER: 'pri_test_starter',
            PADDLE_PRICE_ID_POPULAR: 'pri_test_popular',
            PADDLE_PRICE_ID_BIG: 'pri_test_big',
          },
        },
      },
    ],
  },
})
