'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from '@i18n/navigation'
import { trackPageView } from '@helpers/analytics'

/** One GA4 page view per route (the automatic one is off). The query string never reaches GA. */
export const PageViewTracker = () => {
  const pathname = usePathname()
  const locale = useLocale()

  useEffect(() => {
    trackPageView(`/${locale}${pathname === '/' ? '' : pathname}`)
  }, [pathname, locale])

  return null
}
