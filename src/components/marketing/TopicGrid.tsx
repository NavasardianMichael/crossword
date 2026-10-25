import { getTranslations } from 'next-intl/server'
import { TOPICS } from '@constants/puzzle'
import { topicPath } from '@constants/routes'
import { TOPIC_STYLES } from '@constants/topicStyles'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'

/** Every topic as a coloured sticker linking to its landing page (crawlable from every page that shows it). */
export const TopicGrid = async ({ withDescriptions = false }: { withDescriptions?: boolean }) => {
  const t = await getTranslations('Topics')
  return (
    <ul className={cn('grid gap-3', withDescriptions ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')}>
      {TOPICS.map((topic) => {
        const { icon: Icon, tile, iconTone } = TOPIC_STYLES[topic]
        return (
          <li key={topic}>
            <AppLink
              href={topicPath(topic)}
              className={cn('flex h-full items-start gap-3 rounded-panel border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-chunky', tile)}
            >
              <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink-900', iconTone)}>
                <Icon aria-hidden className='size-5' />
              </span>
              <span className='min-w-0'>
                <span className='block font-display font-bold text-ink-900'>{t(`${topic}.name`)}</span>
                {withDescriptions && <span className='mt-1 block text-body-sm text-ink-700'>{t(`${topic}.description`)}</span>}
              </span>
            </AppLink>
          </li>
        )
      })}
    </ul>
  )
}
