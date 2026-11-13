'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@store/auth/store'
import { usePendingRouter } from '@hooks/useNavigationPending'
import { safeReturnPath } from '@constants/auth'
import { ROUTES } from '@constants/routes'

/** Leaves an auth page once a session exists: `returnTo` when it is a same-site path, home otherwise. */
export const useAuthRedirect = (returnTo: string | undefined): void => {
  const router = usePendingRouter()
  const user = useAuthStore.use.user()
  const destination = safeReturnPath(returnTo) ?? ROUTES.home

  useEffect(() => {
    if (user) router.replace(destination)
  }, [user, destination, router])
}
