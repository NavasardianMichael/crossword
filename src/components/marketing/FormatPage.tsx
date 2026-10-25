import { getTranslations } from 'next-intl/server'
import type { Locale, PuzzleFormat } from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { breadcrumbSchema, gameSchema } from '@linkedDataSchema/index'
import { GeneratorForm } from '@components/generator/GeneratorForm'
import { JsonLd } from '@components/seo/JsonLd'
import { Section } from '@components/ui/layout/Section'
import { FaqSection } from './FaqSection'
import { Hero } from './Hero'
import { MiniGrid } from './MiniGrid'
import { TopicGrid } from './TopicGrid'

/** A format's landing page: the generator preset to it, how the format plays, its FAQ. */
const RULE_COUNT = 4

export const FormatPage = async ({ format, locale }: { format: PuzzleFormat; locale: Locale }) => {
  const namespace = format === 'classic' ? 'CrosswordPage' : 'ScanwordPage'
  const t = await getTranslations(namespace)
  const nav = await getTranslations('Nav')
  const path = format === 'classic' ? ROUTES.crossword : ROUTES.scanword

  return (
    <>
      <JsonLd data={gameSchema(locale, t('hero.plainTitle'), t('hero.subtitle'), path)} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav(format === 'classic' ? 'crossword' : 'scanword'), path },
        ])}
      />
      <Hero namespace={`${namespace}.hero`}>
        <GeneratorForm preset={{ format }} />
      </Hero>

      <Section id='how' title={t('rulesTitle')}>
        <div className='grid items-center gap-8 md:grid-cols-[1fr_14rem]'>
          <ol className='flex flex-col gap-4'>
            {Array.from({ length: RULE_COUNT }, (_, index) => (
              <li key={index} className='flex gap-4'>
                <span className='flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-ink-900 bg-sun-300 font-display font-extrabold'>
                  {index + 1}
                </span>
                <p className='pt-1 text-ink-700'>{t(`rule${index + 1}`)}</p>
              </li>
            ))}
          </ol>
          <MiniGrid format={format} className='mx-auto w-48 rotate-2 md:w-full' />
        </div>
      </Section>

      <Section id='topics' title={t('topicsTitle')}>
        <TopicGrid />
      </Section>

      <Section id='faq' title={t('faqTitle')} align='center'>
        <FaqSection namespace={namespace} count={4} />
      </Section>
    </>
  )
}
