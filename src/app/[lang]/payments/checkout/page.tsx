import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { PaddleCheckout } from '@components/billing/PaddleCheckout'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.paymentsCheckout, title: t('paymentTitle'), description: t('creditsDescription'), noIndex: true })
}

export default function PaymentsCheckoutPage() {
  return (
    <div className='container-page flex min-h-[50dvh] items-center justify-center py-12'>
      <PaddleCheckout />
    </div>
  )
}
