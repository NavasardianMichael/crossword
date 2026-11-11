'use client'

import { useEffect, useId, useMemo, useTransition } from 'react'
import { useNavigationProgressStoreBase } from '@store/navigation/progress/store'
import { useRouter } from '@i18n/navigation'

/** Shows the page-top progress bar while `pending` is true (or until the caller unmounts). */
export const useNavigationPending = (pending: boolean) => {
  const id = useId()
  const setPending = useNavigationProgressStoreBase((state) => state.setPending)

  useEffect(() => {
    setPending(id, pending)
    return () => setPending(id, false)
  }, [id, pending, setPending])
}

/**
 * `useRouter` from `@i18n/navigation` whose `push` and `replace` run in a transition, so the
 * progress bar shows until the next page has rendered. Every router navigation goes through it.
 */
export const usePendingRouter = () => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  useNavigationPending(pending)

  return useMemo(
    () => ({
      ...router,
      push: (...args: Parameters<typeof router.push>) => startTransition(() => router.push(...args)),
      replace: (...args: Parameters<typeof router.replace>) => startTransition(() => router.replace(...args)),
    }),
    [router]
  )
}
