'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@store/auth/store'
import { useBillingStore } from '@store/billing/store'
import { usePlayStore } from '@store/puzzle/play/store'
import { toast } from '@store/toast/store'

/**
 * App-wide side effects, mounted once:
 * - hydrate persisted play settings (the server render assumes defaults);
 * - read the session, then the balance and free puzzle of whoever it turned out to be;
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
