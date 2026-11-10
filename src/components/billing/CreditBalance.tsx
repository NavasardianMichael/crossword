'use client'

import { Coins } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useBillingStore } from '@store/billing/store'
import { ROUTES } from '@constants/routes'
import { AppLink } from '@components/ui/bare/AppLink'

/** The signed-in balance in the header, linking to the credits page. Nothing for guests. */
export const CreditBalance = () => {
  const t = useTranslations('Billing')
  const format = useFormatter()
  const status = useBillingStore.use.status()
  if (!status?.signedIn) return null

  return (
    <AppLink
      href={ROUTES.credits}
      aria-label={t('balance', { count: status.credits })}
      className='inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-ink-900 bg-sun-200 px-3 font-display text-body-sm font-bold text-ink-900 transition-colors hover:bg-sun-100'
    >
      <Coins aria-hidden className='size-4' />
      {format.number(status.credits)}
    </AppLink>
  )
}
