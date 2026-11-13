'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { verifyEmailAPI } from '@api/auth/main'
import { usePendingRouter } from '@hooks/useNavigationPending'
import { RETURN_TO_QUERY, safeReturnPath, VERIFIED_QUERY } from '@constants/auth'
import { ROUTES } from '@constants/routes'
import { authErrorKey } from '@helpers/authError'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'

export const VerifyEmailForm = ({ token, returnTo }: { token?: string; returnTo?: string }) => {
  const t = useTranslations('Auth')
  const router = usePendingRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const safeReturn = safeReturnPath(returnTo)

  const submit = async () => {
    if (!token) return setError(new Error('missing'))
    setPending(true)
    setError(null)
    try {
      await verifyEmailAPI(token)
      router.replace({
        pathname: ROUTES.signIn,
        query: { [VERIFIED_QUERY]: '1', ...(safeReturn ? { [RETURN_TO_QUERY]: safeReturn } : {}) },
      })
    } catch (failure) {
      setError(failure)
      setPending(false)
    }
  }

  const messageKey = !token ? 'verifyInvalid' : authErrorKey(error)

  return (
    <div className='flex flex-col gap-4'>
      {error || !token ? <ErrorAlert error={error ?? new Error('missing')} message={messageKey ? t(messageKey) : undefined} /> : null}
      <Button type='button' fullWidth loading={pending} disabled={!token} onClick={() => void submit()}>
        {t('submitVerify')}
      </Button>
    </div>
  )
}
