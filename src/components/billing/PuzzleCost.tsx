'use client'

import { useTranslations } from 'next-intl'
import { useBillingStore } from '@store/billing/store'
import { usePathname } from '@i18n/navigation'
import { RETURN_TO_QUERY } from '@constants/auth'
import { type Difficulty, FREE_MONTHLY_CREDITS, puzzleCredits, type PuzzleSize } from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'

const linkClass = 'font-bold text-coral-600 underline underline-offset-2'

/**
 * What the chosen puzzle will cost, before it is made: its price in credits, and whether this
 * month's free credits cover it — else what the player has against it, and the way on (sign in
 * for a guest, buy credits for an account).
 */
export const PuzzleCost = ({ size, difficulty, className }: { size: PuzzleSize; difficulty: Difficulty; className?: string }) => {
  const t = useTranslations('Billing')
  const pathname = usePathname()
  const status = useBillingStore.use.status()
  const price = puzzleCredits(size, difficulty)
  const base = cn('text-center text-body-sm text-ink-700', className)

  if (status && price <= status.freeCredits) {
    return (
      <p className={base}>
        {t('cost', { count: price })} · {t('freeNow')}
      </p>
    )
  }

  if (status && !status.signedIn) {
    return (
      <p className={base}>
        {t('refusedSignIn', { count: FREE_MONTHLY_CREDITS })}{' '}
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
          {t('youHave', { count: status.credits + status.freeCredits })}
          {status.credits + status.freeCredits < price ? (
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
