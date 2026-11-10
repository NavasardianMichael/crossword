import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { AuthShell } from '@components/auth/AuthShell'
import { VerifyEmailForm } from '@components/auth/VerifyEmailForm'

type Props = { searchParams: Promise<{ token?: string; returnTo?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return pageMetadata({ path: ROUTES.verifyEmail, title: t('verifyTitle'), description: t('verifySubtitle'), noIndex: true })
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const query = await searchParams
  const t = await getTranslations('Auth')
  return (
    <AuthShell title={t('verifyTitle')} subtitle={t('verifySubtitle')}>
      <VerifyEmailForm token={query.token} returnTo={query.returnTo} />
    </AuthShell>
  )
}
