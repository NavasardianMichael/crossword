import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { PaymentReturn } from '@components/billing/PaymentReturn'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.paymentsReturn, title: t('paymentTitle'), description: t('creditsDescription'), noIndex: true })
}

export default function PaymentsReturnPage() {
  return (
    <div className='container-page flex min-h-[50dvh] items-center justify-center py-12'>
      <PaymentReturn />
    </div>
  )
}
