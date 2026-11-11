'use client'

import { LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@store/auth/store'
import { usePathname } from '@i18n/navigation'
import { RETURN_TO_QUERY } from '@constants/auth'
import { ROUTES } from '@constants/routes'
import { IconLink } from '@components/ui/IconLink'

/**
 * A guest's way to sign in, straight from the header, back to the same page afterwards — a
 * round icon with a tooltip like the header's other buttons, coloured as the primary button
 * (white on this coral would fall under 3:1). Not on a phone (the menu carries it).
 * Nothing on the auth pages, or until the session check has answered.
 */
export const HeaderSignIn = () => {
  const t = useTranslations('Auth')
  const pathname = usePathname()
  const user = useAuthStore.use.user()
  const resolved = useAuthStore.use.isResolved()
  if (!resolved || user || pathname.startsWith('/auth/')) return null

  return (
    <IconLink
      href={{ pathname: ROUTES.signIn, query: { [RETURN_TO_QUERY]: pathname } }}
      label={t('signIn')}
      icon={<LogIn aria-hidden className='size-5' />}
      className='hidden rounded-full border-2 border-coral-600 bg-coral-400 text-ink-900 hover:border-coral-600 hover:bg-coral-300 hover:text-ink-900 sm:inline-flex'
    />
  )
}
