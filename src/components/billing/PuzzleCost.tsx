'use client'

import { useTranslations } from 'next-intl'
import { useBillingStore } from '@store/billing/store'
import { usePathname } from '@i18n/navigation'
import { RETURN_TO_QUERY } from '@constants/auth'
import { type Difficulty, puzzleCredits,type PuzzleSize } from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'

const linkClass = 'font-bold text-coral-600 underline underline-offset-2'

/**
 * What the chosen puzzle will cost, before it is made: free (this month's free puzzle), or its
 * price in credits against the balance — and, once a guest's free puzzle is used, the way on.
 */
export const PuzzleCost = ({ size, difficulty, className }: { size: PuzzleSize; difficulty: Difficulty; className?: string }) => {
  const t = useTranslations('Billing')
  const pathname = usePathname()
  const status = useBillingStore.use.status()
  const price = puzzleCredits(size, difficulty)
  const base = cn('text-center text-body-sm text-ink-700', className)

  if (status?.freeAvailable) return <p className={base}>{t('freeNow')}</p>

  if (status && !status.signedIn) {
    return (
      <p className={base}>
        {t('guestUsed')}{' '}
        <AppLink href={{ pathname: ROUTES.signIn, query: { [RETURN_TO_QUERY]: pathname } }} className={linkClass}>
          {t('signIn')}
        </AppLink>
      </p>
    )
  }

  return (
    <p className={base}>
      {t('cost', { count: price })}
      {status ? (
        <>
          {' · '}
          {t('youHave', { count: status.credits })}
          {status.credits < price ? (
            <>
              {' '}
              <AppLink href={ROUTES.credits} className={linkClass}>
                {t('buyCredits')}
              </AppLink>
            </>
          ) : null}
        </>
      ) : null}
    </p>
  )
}
