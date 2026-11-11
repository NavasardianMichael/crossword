'use client'

import { useState } from 'react'
import { Alert, Form, Input } from 'antd'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { forgotPasswordAPI } from '@api/auth/main'
import { ROUTES } from '@constants/routes'
import { AppLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'

export const ForgotPasswordForm = () => {
  const t = useTranslations('Auth')
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const onFinish = async ({ email }: { email: string }) => {
    setPending(true)
    setError(null)
    try {
      await forgotPasswordAPI(email)
      setSent(true)
    } catch (failure) {
      setError(failure)
    } finally {
      setPending(false)
    }
  }

  if (sent) return <Alert type='success' showIcon title={t('forgotSent')} />

  const mailFailed = axios.isAxiosError(error) && error.response?.status === 503

  return (
    <Form<{ email: string }> layout='vertical' noValidate requiredMark={false} onFinish={onFinish} disabled={pending}>
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
      {error ? <ErrorAlert error={error} message={mailFailed ? t('mailFailed') : undefined} className='mb-4' /> : null}
      <Button type='submit' fullWidth loading={pending} className='mt-4'>
        {t('submitForgot')}
      </Button>
      <p className='mt-4 mb-0 text-center text-body-sm'>
        <AppLink href={ROUTES.signIn} className='font-bold text-teal-700 hover:underline'>
          {t('signInTitle')}
        </AppLink>
      </p>
    </Form>
  )
}
