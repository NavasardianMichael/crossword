'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { serviceWorkerUrl } from '@helpers/pwa'
import { reportError } from '@helpers/reportError'

/**
 * Registers the service worker in production (bookie's pattern, plus hangman's hand-off of
 * already-loaded assets).
 *
 * Skipped in `next dev`: a worker intercepting requests fights HMR. Verify offline play with
 * `pnpm build && pnpm start`. `updateViaCache: 'none'` stops the browser HTTP-caching
 * `/sw.js` itself, and `update()` on visibility change is how an installed app left open for
 * days still picks up a new deploy. The URL names the page's language, so the worker precaches
 * that language's play shell; switching language registers that language's worker instead.
 */
export const ServiceWorkerRegistrar = () => {
  const locale = useLocale()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return

    let registration: ServiceWorkerRegistration | undefined

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register(serviceWorkerUrl(locale), { scope: '/', updateViaCache: 'none' })
        const ready = await navigator.serviceWorker.ready
        // Assets this page loaded before the worker controlled it would otherwise be missing offline.
        const urls = performance.getEntriesByType('resource').map((entry) => entry.name)
        ready.active?.postMessage({ type: 'CACHE_URLS', urls: [window.location.pathname, ...urls] })
      } catch (error) {
        reportError(error, 'sw:register', { silent: true })
      }
    }
    void register()

    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !registration) return
      registration.update().catch((error: unknown) => reportError(error, 'sw:update', { silent: true }))
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [locale])

  return null
}
