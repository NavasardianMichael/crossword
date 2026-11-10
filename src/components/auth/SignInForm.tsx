'use client'

import { useState } from 'react'
import { Alert, Form, Input } from 'antd'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { resendVerificationAPI } from '@api/auth/main'
import { useAuthStore } from '@store/auth/store'
import { AUTH_CODE, type GoogleErrorCode, isSafeReturnPath, RETURN_TO_QUERY } from '@constants/auth'
import { ROUTES } from '@constants/routes'
import { authErrorKey } from '@helpers/authError'
import { AppLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { GoogleButton } from './GoogleButton'
import { useAuthRedirect } from './useAuthRedirect'

type Values = { email: string; password: string }

type SignInFormProps = { returnTo?: string; googleError?: GoogleErrorCode; verified?: boolean }

export const SignInForm = ({ returnTo, googleError, verified }: SignInFormProps) => {
  const t = useTranslations('Auth')
  const login = useAuthStore.use.login()
  const pending = useAuthStore.use.isPending()
  const [error, setError] = useState<unknown>(null)
  const [unverified, setUnverified] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const safeReturn = isSafeReturnPath(returnTo) ? returnTo : undefined
  useAuthRedirect(safeReturn)
  const query = safeReturn ? `?${RETURN_TO_QUERY}=${encodeURIComponent(safeReturn)}` : ''

  const onFinish = async (values: Values) => {
    setError(null)
    setUnverified(null)
    setResent(false)
    try {
      await login(values)
    } catch (failure) {
      const code = axios.isAxiosError(failure) ? failure.response?.data?.error?.code : undefined
      if (code === AUTH_CODE.emailNotVerified) setUnverified(values.email)
      else setError(failure)
    }
  }

  const resend = async () => {
    if (!unverified) return
    setError(null)
    try {
      await resendVerificationAPI(unverified, safeReturn)
      setResent(true)
    } catch (failure) {
      setError(failure)
    }
  }

  const messageKey = authErrorKey(error)

  return (
    <div className='flex flex-col gap-4'>
      {verified && <Alert type='success' showIcon title={t('verifiedNotice')} />}
      {googleError && <Alert type='warning' showIcon title={t(`googleErrors.${googleError}`)} />}
      <GoogleButton returnTo={safeReturn} />
      <p className='text-center text-caption font-bold tracking-wide text-ink-500 uppercase'>{t('or')}</p>
      <Form<Values> layout='vertical' requiredMark={false} onFinish={onFinish} disabled={pending}>
        <Form.Item
          name='email'
          label={t('email')}
          rules={[
            { required: true, message: t('required') },
            { type: 'email', message: t('invalidEmail') },
          ]}
        >
          <Input size='large' type='email' autoComplete='email' />
        </Form.Item>
        <Form.Item name='password' label={t('password')} rules={[{ required: true, message: t('required') }]}>
          <Input.Password size='large' autoComplete='current-password' />
        </Form.Item>
        <div className='-mt-2 mb-4 text-end'>
          <AppLink href={ROUTES.forgotPassword} className='text-body-sm font-semibold text-teal-700 hover:underline'>
            {t('forgot')}
          </AppLink>
        </div>
        {error ? <ErrorAlert error={error} message={messageKey ? t(messageKey) : undefined} className='mb-4' /> : null}
        {unverified && (
          <Alert
            type='warning'
            showIcon
            className='mb-4'
            title={t('checkInbox', { email: unverified })}
            description={
              <div>
                <p className='mb-3'>{t('checkInboxText')}</p>
                <Button type='button' variant='outline' size='sm' onClick={() => void resend()}>
                  {resent ? t('resent') : t('resend')}
                </Button>
              </div>
            }
          />
        )}
        <Button type='submit' fullWidth loading={pending}>
          {t('submitSignIn')}
        </Button>
      </Form>
      <p className='text-center text-body-sm text-ink-700'>
        {t('noAccount')}{' '}
        <AppLink href={`${ROUTES.signUp}${query}`} className='font-bold text-teal-700 hover:underline'>
          {t('signUpTitle')}
        </AppLink>
      </p>
    </div>
  )
}
