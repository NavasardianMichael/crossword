'use client'

import { LogIn, LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@store/auth/store'
import { ROUTES } from '@constants/routes'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'

const row = 'flex min-h-12 w-full items-center gap-3 rounded-control border-2 border-transparent px-3 font-display font-bold hover:bg-cream-200'

/** Sign in, or the signed-in name and a way out. Nothing until the session check has answered. */
export const AuthMenu = ({ onNavigate }: { onNavigate?: () => void }) => {
  const t = useTranslations('Auth')
  const user = useAuthStore.use.user()
  const resolved = useAuthStore.use.isResolved()
  const pending = useAuthStore.use.isPending()
  const logout = useAuthStore.use.logout()

  if (!resolved) return null
  if (!user) {
    return (
      <AppLink href={ROUTES.signIn} onClick={onNavigate} className={row}>
        <LogIn aria-hidden className='size-5 text-coral-600' />
        {t('signIn')}
      </AppLink>
    )
  }

  return (
    <div className='flex flex-col gap-1'>
      <p className='truncate px-3 font-display font-bold text-ink-900'>{user.fullName}</p>
      <Button
        type='button'
        variant='ghost'
        loading={pending}
        className={cn(row, 'justify-start')}
        onClick={() => {
          void logout()
          onNavigate?.()
        }}
      >
        <LogOut aria-hidden className='size-5 text-coral-600' />
        {t('signOut')}
      </Button>
    </div>
  )
}
