import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { TOPICS } from '@constants/puzzle'
import { ROUTES, TOPIC_SLUGS, topicFromSlug, topicPath } from '@constants/routes'
import { TOPIC_STYLES } from '@constants/topicStyles'
import { cn } from '@helpers/cn'
import { fetchTopicSamples } from '@helpers/serverData'
import { breadcrumbSchema, sampleCluesSchema } from '@linkedDataSchema/index'
import { GeneratorForm } from '@components/generator/GeneratorForm'
import { TopicGrid } from '@components/marketing/TopicGrid'
import { JsonLd } from '@components/seo/JsonLd'
import { PageHeader } from '@components/ui/layout/PageHeader'
import { Section } from '@components/ui/layout/Section'

/** Sample clues come from the pool: re-read hourly, so a page built while the API was down fills in. */
export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: TOPIC_SLUGS[topic] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = topicFromSlug((await params).slug)
  if (!topic) return {}
  const t = await getTranslations('Topics')
  const seo = await getTranslations('Seo')
  return pageMetadata({
    path: topicPath(topic),
    title: seo('topicTitle', { topic: t(`${topic}.name`) }),
    description: seo('topicDescription', { topic: t(`${topic}.name`), description: t(`${topic}.description`) }),
  })
}

export default async function TopicPage({ params }: Props) {
  const topic = topicFromSlug((await params).slug)
  if (!topic) notFound()

  const locale = await currentLocale()
  const t = await getTranslations('TopicPage')
  const topics = await getTranslations('Topics')
  const nav = await getTranslations('Nav')
  const samples = await fetchTopicSamples(locale, topic)
  const name = topics(`${topic}.name`)
  const { icon: Icon, iconTone, tile } = TOPIC_STYLES[topic]

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav('topics'), path: ROUTES.topics },
          { name, path: topicPath(topic) },
        ])}
      />
      {samples.length > 0 && (
        <JsonLd data={sampleCluesSchema(t('samplesTitle', { topic: name }), samples.map(({ clue, word }) => ({ clue, answer: word })))} />
      )}
      <PageHeader
        eyebrow={
          <span className='inline-flex items-center gap-2'>
            <span className={cn('flex size-7 items-center justify-center rounded-lg border-2 border-ink-900', iconTone)}>
              <Icon aria-hidden className='size-4' />
            </span>
            {nav('topics')}
          </span>
        }
        title={t('title', { topic: name })}
        subtitle={topics(`${topic}.description`)}
      />
      <div className='container-page max-w-4xl'>
        <GeneratorForm preset={{ topic }} />
      </div>

      {samples.length > 0 && (
        <Section id='samples' title={t('samplesTitle', { topic: name })} subtitle={t('samplesSubtitle')}>
          <ul className='grid gap-3 sm:grid-cols-2' lang={locale}>
            {samples.map(({ word, clue, length }) => (
              <li key={word} className={cn('rounded-panel border-2 p-4', tile)}>
                <p className='font-semibold text-ink-900'>
                  {clue} <span className='text-body-sm text-ink-500'>({length})</span>
                </p>
                <details className='mt-2'>
                  <summary className='text-body-sm font-bold text-teal-700'>{t('showAnswer')}</summary>
                  <p className='mt-1 font-display text-h3 font-extrabold tracking-wider uppercase'>{word}</p>
                </details>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id='more' title={t('moreTopics')}>
        <TopicGrid />
      </Section>
    </>
  )
}
