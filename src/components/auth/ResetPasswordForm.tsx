'use client'

import { useState } from 'react'
import { Alert, Form, Input } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@store/auth/store'
import { PASSWORD_MAX_LENGTH } from '@constants/auth'
import { authErrorKey } from '@helpers/authError'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { confirmPasswordRules, passwordRules } from './passwordRules'
import { useAuthRedirect } from './useAuthRedirect'

type Values = { password: string; confirmPassword: string }

export const ResetPasswordForm = ({ token }: { token?: string }) => {
  const t = useTranslations('Auth')
  const resetPassword = useAuthStore.use.resetPassword()
  const pending = useAuthStore.use.isPending()
  const [error, setError] = useState<unknown>(null)
  useAuthRedirect(undefined)

  if (!token) return <Alert type='warning' showIcon title={t('resetInvalid')} />

  const onFinish = async ({ password }: Values) => {
    setError(null)
    try {
      await resetPassword(token, password)
    } catch (failure) {
      setError(failure)
    }
  }

  const messageKey = authErrorKey(error)

  return (
    <Form<Values> layout='vertical' noValidate requiredMark={false} onFinish={onFinish} disabled={pending}>
      <Form.Item name='password' label={t('password')} extra={t('passwordHint')} rules={passwordRules(t('required'), t('weakPassword'))}>
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
      {error ? <ErrorAlert error={error} message={messageKey ? t(messageKey) : undefined} className='mb-4' /> : null}
      <Button type='submit' fullWidth loading={pending} className='mt-4'>
        {t('submitReset')}
      </Button>
    </Form>
  )
}
