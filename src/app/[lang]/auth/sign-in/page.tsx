import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { isGoogleError } from '@constants/auth'
import { ROUTES } from '@constants/routes'
import { AuthShell } from '@components/auth/AuthShell'
import { SignInForm } from '@components/auth/SignInForm'

type Props = { searchParams: Promise<{ returnTo?: string; error?: string; verified?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return pageMetadata({ path: ROUTES.signIn, title: t('signInTitle'), description: t('signInSubtitle'), noIndex: true })
}

export default async function SignInPage({ searchParams }: Props) {
  const query = await searchParams
  const t = await getTranslations('Auth')
  return (
    <AuthShell title={t('signInTitle')} subtitle={t('signInSubtitle')}>
      <SignInForm returnTo={query.returnTo} googleError={isGoogleError(query.error) ? query.error : undefined} verified={query.verified === '1'} />
    </AuthShell>
  )
}
