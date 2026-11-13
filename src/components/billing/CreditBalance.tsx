'use client'

import { Tooltip } from 'antd'
import { Coins } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useBillingStore } from '@store/billing/store'
import { FREE_MONTHLY_CREDITS } from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { AppLink } from '@components/ui/bare/AppLink'

/**
 * The header chip, linking to the credits page: every credit the player can spend now — this
 * month's free ones plus bought ones (`docs/BILLING.md`). How many of them are free is in the
 * tooltip and hidden text. Nothing until the first billing answer.
 */
export const CreditBalance = () => {
  const t = useTranslations('Billing')
  const tCredits = useTranslations('Credits')
  const format = useFormatter()
  const status = useBillingStore.use.status()
  if (!status) return null

  const total = status.credits + status.freeCredits
  const date = format.dateTime(new Date(status.freeResetsAt), { day: 'numeric', month: 'long', timeZone: 'UTC' })
  const freeLine =
    status.freeCredits > 0
      ? tCredits('freeAvailable', { count: status.freeCredits, date })
      : status.signedIn
        ? tCredits('freeUsed', { count: FREE_MONTHLY_CREDITS, date })
        : t('guestUsed', { count: FREE_MONTHLY_CREDITS })
  // Separate sentences, never joined here: each catalogue punctuates its own.
  const lines = [t('balance', { count: total }), freeLine]

  return (
    <Tooltip
      title={lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
      mouseEnterDelay={0.4}
    >
      <AppLink
        href={ROUTES.credits}
        className='inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-sun-600 bg-sun-200 px-2.5 font-display text-body-sm font-bold text-ink-900 tabular-nums transition-colors hover:bg-sun-100'
      >
        {lines.map((line) => (
          <span key={line} className='sr-only'>
            {line}
          </span>
        ))}
        <span aria-hidden className='inline-flex items-center gap-1'>
          <Coins aria-hidden className='size-4 text-coral-600' />
          {format.number(total)}
        </span>
      </AppLink>
    </Tooltip>
  )
}
