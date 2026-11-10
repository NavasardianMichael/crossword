import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { AuthShell } from '@components/auth/AuthShell'
import { ForgotPasswordForm } from '@components/auth/ForgotPasswordForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return pageMetadata({ path: ROUTES.forgotPassword, title: t('forgotTitle'), description: t('forgotSubtitle'), noIndex: true })
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations('Auth')
  return (
    <AuthShell title={t('forgotTitle')} subtitle={t('forgotSubtitle')}>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
