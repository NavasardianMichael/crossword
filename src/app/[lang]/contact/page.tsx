import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { CONTENT_UPDATED_AT } from '@constants/legal'
import { ROUTES } from '@constants/routes'
import { breadcrumbSchema, webPageSchema } from '@linkedDataSchema/index'
import { ContactForm } from '@components/contact/ContactForm'
import { JsonLd } from '@components/seo/JsonLd'
import { PageHeader } from '@components/ui/layout/PageHeader'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.contact, title: t('contactTitle'), description: t('contactDescription') })
}

export default async function ContactPage() {
  const locale = await currentLocale()
  const t = await getTranslations('Contact')
  const seo = await getTranslations('Seo')
  const nav = await getTranslations('Nav')

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          name: t('title'),
          description: seo('contactDescription'),
          path: ROUTES.contact,
          dateModified: CONTENT_UPDATED_AT,
        })}
      />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav('contact'), path: ROUTES.contact },
        ])}
      />
      <div className='container-page max-w-lg pb-16'>
        <PageHeader title={t('title')} subtitle={t('subtitle')} />
        <div className='panel p-5 sm:p-7'>
          <ContactForm />
        </div>
      </div>
    </>
  )
}
