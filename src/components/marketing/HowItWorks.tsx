import { Languages, Repeat2, Sparkles, WifiOff } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cn } from '@helpers/cn'

const POINTS = [
  { key: 'fresh', icon: Repeat2, tone: 'bg-coral-300' },
  { key: 'native', icon: Languages, tone: 'bg-teal-300' },
  { key: 'ai', icon: Sparkles, tone: 'bg-sun-300' },
  { key: 'offline', icon: WifiOff, tone: 'bg-lavender-300' },
] as const

/** Why this generator: four promises, each a sticker. */
export const HowItWorks = async () => {
  const t = await getTranslations('Home.points')
  return (
    <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {POINTS.map(({ key, icon: Icon, tone }) => (
        <li key={key} className='panel flex flex-col gap-3 p-5'>
          <span className={cn('flex size-12 items-center justify-center rounded-2xl border-2 border-ink-900 shadow-chunky', tone)}>
            <Icon aria-hidden className='size-6' />
          </span>
          <h3 className='text-h3 font-bold'>{t(`${key}.title`)}</h3>
          <p className='text-body-sm text-ink-700'>{t(`${key}.text`)}</p>
        </li>
      ))}
    </ul>
  )
}
