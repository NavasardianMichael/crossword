import { defineConfig, devices } from '@playwright/test'

/**
 * E2E is opt-in, not part of `pnpm test`: it needs the whole stack running.
 *
 *   pnpm db:up && pnpm db:setup
 *   RATE_LIMIT_ENABLED=false pnpm dev    # web :7007 + api :9007; every test shares one IP
 *   pnpm test:e2e
 *
 * Three viewports, because the board has three layouts: desktop (clue columns either side),
 * tablet (clue panel beside or below), phone (clue bar + on-screen keyboard, clue sheet).
 */
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:7007'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'blob' : 'list',
  timeout: 90_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'tablet', use: { ...devices['iPad (gen 7)'], browserName: 'chromium' } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
})
