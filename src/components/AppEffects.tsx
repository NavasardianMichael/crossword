'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { toast } from '@store/toast/store'

/**
 * App-wide side effects, mounted once:
 * - hydrate persisted play settings (the server render assumes defaults);
 * - say so when the connection comes back.
 */
export const AppEffects = () => {
  const hydrateSettings = usePlayStore.use.hydrateSettings()
  const t = useTranslations('Common')

  useEffect(() => {
    hydrateSettings()
  }, [hydrateSettings])

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
