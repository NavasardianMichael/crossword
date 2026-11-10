'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@store/auth/store'
import { useRouter } from '@i18n/navigation'
import { isSafeReturnPath } from '@constants/auth'
import { ROUTES } from '@constants/routes'

/** Leaves an auth page once a session exists: `returnTo` when it is a same-site path, home otherwise. */
export const useAuthRedirect = (returnTo: string | undefined): void => {
  const router = useRouter()
  const user = useAuthStore.use.user()
  const destination = isSafeReturnPath(returnTo) ? returnTo : ROUTES.home

  useEffect(() => {
    if (user) router.replace(destination)
  }, [user, destination, router])
}
