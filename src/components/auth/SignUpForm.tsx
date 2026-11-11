'use client'

import { useState } from 'react'
import { Form, Input } from 'antd'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { resendVerificationAPI } from '@api/auth/main'
import { useAuthStore } from '@store/auth/store'
import { isSafeReturnPath, PASSWORD_MAX_LENGTH, RETURN_TO_QUERY } from '@constants/auth'
import { ROUTES } from '@constants/routes'
import { authErrorKey } from '@helpers/authError'
import { AppLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { GoogleButton } from './GoogleButton'
import { confirmPasswordRules, passwordRules } from './passwordRules'

type Values = { fullName: string; email: string; password: string; confirmPassword: string }

export const SignUpForm = ({ returnTo }: { returnTo?: string }) => {
  const t = useTranslations('Auth')
  const register = useAuthStore.use.register()
  const pending = useAuthStore.use.isPending()
  const [error, setError] = useState<unknown>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const safeReturn = isSafeReturnPath(returnTo) ? returnTo : undefined
  const query = safeReturn ? `?${RETURN_TO_QUERY}=${encodeURIComponent(safeReturn)}` : ''

  const onFinish = async ({ fullName, email, password }: Values) => {
    setError(null)
    try {
      const result = await register({ fullName: fullName.trim(), email, password, returnTo: safeReturn })
      setSentTo(result.email)
    } catch (failure) {
      setError(failure)
    }
  }

  const resend = async () => {
    if (!sentTo) return
    setError(null)
    try {
      await resendVerificationAPI(sentTo, safeReturn)
      setResent(true)
    } catch (failure) {
      setError(failure)
    }
  }

  if (sentTo) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='font-display text-h3 font-bold'>{t('checkInbox', { email: sentTo })}</p>
        <p className='text-ink-700'>{t('checkInboxText')}</p>
        <Button type='button' variant='outline' onClick={() => void resend()}>
          {resent ? t('resent') : t('resend')}
        </Button>
        {error ? <ErrorAlert error={error} message={authErrorKey(error) ? t(authErrorKey(error)!) : t('mailFailed')} /> : null}
      </div>
    )
  }

  const messageKey = authErrorKey(error)
  const mailFailed = axios.isAxiosError(error) && error.response?.status === 503

  return (
    <div className='flex flex-col gap-4'>
      <GoogleButton returnTo={safeReturn} />
      <Form<Values> layout='vertical' requiredMark={false} onFinish={onFinish} disabled={pending}>
        <Form.Item name='fullName' label={t('name')} rules={[{ required: true, whitespace: true, message: t('required') }]}>
          <Input size='large' autoComplete='name' maxLength={100} />
        </Form.Item>
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
        <Form.Item
          name='password'
          label={t('password')}
          extra={t('passwordHint')}
          dependencies={['email']}
          rules={passwordRules(t('required'), t('weakPassword'), 'email')}
        >
          <Input.Password size='large' autoComplete='new-password' maxLength={PASSWORD_MAX_LENGTH} />
        </Form.Item>
        <Form.Item
          name='confirmPassword'
          label={t('confirmPassword')}
          dependencies={['password']}
          rules={confirmPasswordRules('password', t('required'), t('passwordMismatch'))}
        >
          <Input.Password size='large' autoComplete='new-password' maxLength={PASSWORD_MAX_LENGTH} />
        </Form.Item>
        {error ? (
          <ErrorAlert error={error} message={messageKey ? t(messageKey) : mailFailed ? t('mailFailed') : undefined} className='mb-4' />
        ) : null}
        <Button type='submit' fullWidth loading={pending}>
          {t('submitSignUp')}
        </Button>
      </Form>
      <p className='text-center text-body-sm text-ink-700'>
        {t('hasAccount')}{' '}
        <AppLink href={`${ROUTES.signIn}${query}`} className='font-bold text-teal-700 hover:underline'>
          {t('signInTitle')}
        </AppLink>
      </p>
    </div>
  )
}
