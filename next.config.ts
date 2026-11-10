import { withSentryConfig } from '@sentry/nextjs/config'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Without the explicit path next-intl looks for `./i18n/request.ts` at the project root.
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // `.next/standalone`: server.js plus only the traced node_modules, so a release carries its
  // own runtime. `public/` and `.next/static` are copied in by the deploy (docs/DEPLOYMENT.md).
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

/**
 * Sentry's build step. Source maps go up only when the build has `SENTRY_AUTH_TOKEN` (with
 * `SENTRY_ORG` / `SENTRY_PROJECT`, which the plugin reads itself), and are then removed from
 * the bundle. Events reach Sentry through a tunnel route on this origin, so ad blockers that
 * drop requests to sentry.io do not drop the errors with them. The tunnel is a fixed path, not
 * a random one: `proxy.ts` must know it to leave it without a locale prefix.
 */
export default withSentryConfig(withNextIntl(nextConfig), {
  silent: !process.env.CI,
  telemetry: false,
  tunnelRoute: '/monitoring',
  widenClientFileUpload: true,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
})
