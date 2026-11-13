'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@store/auth/store'
import { useBillingStore, useBillingStoreBase } from '@store/billing/store'
import { usePlayStore } from '@store/puzzle/play/store'
import { toast } from '@store/toast/store'

/** Re-reading the balance on every tab switch would be wasteful; this often is plenty. */
const BILLING_REFRESH_GAP_MS = 30_000

/**
 * App-wide side effects, mounted once:
 * - hydrate persisted play settings (the server render assumes defaults);
 * - read the session, then the balance and free puzzle of whoever it turned out to be, and
 *   re-read them when the tab comes back into view or the connection returns;
 * - say so when the connection comes back.
 */
export const AppEffects = () => {
  const hydrateSettings = usePlayStore.use.hydrateSettings()
  const getMe = useAuthStore.use.getMe()
  const resolved = useAuthStore.use.isResolved()
  const userId = useAuthStore((state) => state.user?.id)
  const refreshBilling = useBillingStore.use.refresh()
  const t = useTranslations('Common')

  useEffect(() => {
    hydrateSettings()
  }, [hydrateSettings])

  useEffect(() => {
    void getMe()
  }, [getMe])

  // Signing in or out changes who pays: the account's credits, or this device's free puzzle.
  useEffect(() => {
    if (resolved) void refreshBilling()
  }, [resolved, userId, refreshBilling])

  // The header balance also changes away from this tab: credits spent or bought in another tab,
  // a purchase whose webhook landed after the payment page stopped waiting, a refund. Coming back
  // to the tab, or back online (which also retries a balance that never loaded), re-reads it.
  useEffect(() => {
    if (!resolved) return
    let lastRefresh = Date.now()
    const refreshIfStale = () => {
      if (document.visibilityState !== 'visible') return
      const missing = !useBillingStoreBase.getState().status
      if (!missing && Date.now() - lastRefresh < BILLING_REFRESH_GAP_MS) return
      lastRefresh = Date.now()
      void refreshBilling()
    }
    document.addEventListener('visibilitychange', refreshIfStale)
    window.addEventListener('online', refreshIfStale)
    return () => {
      document.removeEventListener('visibilitychange', refreshIfStale)
      window.removeEventListener('online', refreshIfStale)
    }
  }, [resolved, refreshBilling])

  useEffect(() => {
    const onOnline = () => toast(t('backOnline'), 'success')
    const onOffline = () => toast(t('offline'), 'info')
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [t])

  return null
}
