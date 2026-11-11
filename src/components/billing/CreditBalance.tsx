'use client'

import { Tooltip } from 'antd'
import { WandSparkles } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useBillingStore } from '@store/billing/store'
import { ROUTES } from '@constants/routes'
import { AppLink } from '@components/ui/bare/AppLink'

/**
 * The header chip, linking to the credits page: the credit balance, for everyone — a guest holds
 * none, so 0. This month's free puzzle (`docs/BILLING.md`) is only in the tooltip and hidden text.
 * Nothing until the first billing answer.
 */
export const CreditBalance = () => {
  const t = useTranslations('Billing')
  const tCredits = useTranslations('Credits')
  const format = useFormatter()
  const status = useBillingStore.use.status()
  if (!status) return null

  const freeLine = status.freeAvailable
    ? tCredits('freeAvailable')
    : status.signedIn
      ? tCredits('freeUsed', {
          date: format.dateTime(new Date(status.freeResetsAt), { day: 'numeric', month: 'long', timeZone: 'UTC' }),
        })
      : t('guestUsed')
  // Separate sentences, never joined here: each catalogue punctuates its own.
  const lines = [t('balance', { count: status.credits }), freeLine]

  return (
    <Tooltip
      title={lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
      mouseEnterDelay={0.4}
    >
      <AppLink
        href={ROUTES.credits}
        className='inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-sun-700 bg-sun-200 px-2.5 font-display text-body-sm font-bold text-ink-900 tabular-nums transition-colors hover:bg-sun-100'
      >
        {lines.map((line) => (
          <span key={line} className='sr-only'>
            {line}
          </span>
        ))}
        <span aria-hidden className='inline-flex items-center gap-1'>
          <WandSparkles aria-hidden className='size-4' />
          {format.number(status.credits)}
        </span>
      </AppLink>
    </Tooltip>
  )
}
