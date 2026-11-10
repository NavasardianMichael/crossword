import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { AuthShell } from '@components/auth/AuthShell'
import { ResetPasswordForm } from '@components/auth/ResetPasswordForm'

type Props = { searchParams: Promise<{ token?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return pageMetadata({ path: ROUTES.resetPassword, title: t('resetTitle'), description: t('resetSubtitle'), noIndex: true })
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const query = await searchParams
  const t = await getTranslations('Auth')
  return (
    <AuthShell title={t('resetTitle')} subtitle={t('resetSubtitle')}>
      <ResetPasswordForm token={query.token} />
    </AuthShell>
  )
}
