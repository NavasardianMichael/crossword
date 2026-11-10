import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { AuthShell } from '@components/auth/AuthShell'
import { SignUpForm } from '@components/auth/SignUpForm'

type Props = { searchParams: Promise<{ returnTo?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return pageMetadata({ path: ROUTES.signUp, title: t('signUpTitle'), description: t('signUpSubtitle'), noIndex: true })
}

export default async function SignUpPage({ searchParams }: Props) {
  const query = await searchParams
  const t = await getTranslations('Auth')
  return (
    <AuthShell title={t('signUpTitle')} subtitle={t('signUpSubtitle')}>
      <SignUpForm returnTo={query.returnTo} />
    </AuthShell>
  )
}
