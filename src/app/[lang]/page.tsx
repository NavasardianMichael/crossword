import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { gameSchema, websiteSchema } from '@linkedDataSchema/index'
import { GeneratorForm } from '@components/generator/GeneratorForm'
import { SavedGames } from '@components/history/SavedGames'
import { FaqSection } from '@components/marketing/FaqSection'
import { FormatCards } from '@components/marketing/FormatCards'
import { Hero } from '@components/marketing/Hero'
import { HowItWorks } from '@components/marketing/HowItWorks'
import { TopicGrid } from '@components/marketing/TopicGrid'
import { JsonLd } from '@components/seo/JsonLd'
import { Section } from '@components/ui/layout/Section'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.home, title: t('homeTitle'), description: t('homeDescription') })
}

export default async function HomePage() {
  const locale = await currentLocale()
  const t = await getTranslations('Home')
  const seo = await getTranslations('Seo')
  const appName = (await getTranslations('Common'))('appName')

  return (
    <>
      <JsonLd data={websiteSchema(locale, appName, seo('homeDescription'))} />
      <JsonLd data={gameSchema(locale, appName, seo('homeDescription'), ROUTES.home)} />
      <Hero namespace='Home.hero'>
        <GeneratorForm />
      </Hero>

      <SavedGames limit={3} title={t('continueTitle')} className='container-page pt-10' />

      <Section id='formats' title={t('formatsTitle')} subtitle={t('formatsSubtitle')}>
        <FormatCards />
      </Section>

      <Section id='why' title={t('pointsTitle')}>
        <HowItWorks />
      </Section>

      <Section id='topics' title={t('topicsTitle')} subtitle={t('topicsSubtitle')}>
        <TopicGrid />
      </Section>

      <Section id='faq' title={t('faqTitle')} align='center'>
        <FaqSection namespace='Home' count={6} />
      </Section>
    </>
  )
}
