'use client'

import { useEffect, useState } from 'react'
import { Alert, Form, Input } from 'antd'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { sendContactMessageAPI } from '@api/contact/main'
import type { ContactPayload } from '@api/contact/types'
import { useAuthStore } from '@store/auth/store'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'

/** Twin of `MAX_CONTACT_MESSAGE_LENGTH` in `server/src/routes/contact.ts`. */
export const MAX_CONTACT_MESSAGE_LENGTH = 5000

/**
 * The contact form. A signed-in visitor finds their name and email filled in. `website` is a
 * honeypot: moved off-screen and out of the tab order, so only a bot fills it, and the API
 * then drops the message while answering as if it went.
 */
export const ContactForm = () => {
  const t = useTranslations('Contact')
  const user = useAuthStore.use.user()
  const [form] = Form.useForm<ContactPayload>()
  const [error, setError] = useState<unknown>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // The session resolves after the first render; fill only what the visitor has not typed.
  useEffect(() => {
    if (!user) return
    if (!form.getFieldValue('fullName')) form.setFieldValue('fullName', user.fullName)
    if (!form.getFieldValue('email')) form.setFieldValue('email', user.email)
  }, [user, form])

  const onFinish = async (values: ContactPayload) => {
    setError(null)
    setSending(true)
    try {
      await sendContactMessageAPI({ ...values, website: values.website ?? '' })
      setSent(true)
      form.resetFields(['message'])
    } catch (failure) {
      setError(failure)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className='flex flex-col items-start gap-4'>
        <Alert type='success' showIcon className='w-full' title={t('sent')} description={t('sentText')} />
        <Button type='button' variant='outline' onClick={() => setSent(false)}>
          {t('sendAnother')}
        </Button>
      </div>
    )
  }

  const tooMany = axios.isAxiosError(error) && error.response?.status === 429

  return (
    <Form<ContactPayload> form={form} layout='vertical' requiredMark={false} onFinish={onFinish} disabled={sending}>
      <Form.Item name='fullName' label={t('fullName')} rules={[{ required: true, whitespace: true, message: t('required') }]}>
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
      <Form.Item name='message' label={t('message')} rules={[{ required: true, whitespace: true, message: t('required') }]}>
        <Input.TextArea
          rows={6}
          style={{ resize: 'none' }}
          placeholder={t('messagePlaceholder')}
          maxLength={MAX_CONTACT_MESSAGE_LENGTH}
          showCount
        />
      </Form.Item>
      <div className='absolute -left-[10000px] h-px w-px overflow-hidden' aria-hidden='true'>
        <Form.Item name='website' label='Website'>
          <Input tabIndex={-1} autoComplete='off' />
        </Form.Item>
      </div>
      {error ? <ErrorAlert error={error} message={tooMany ? t('tooMany') : undefined} className='mb-4' /> : null}
      <Button type='submit' fullWidth loading={sending}>
        {t('submit')}
      </Button>
    </Form>
  )
}
