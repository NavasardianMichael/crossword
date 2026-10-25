import { getTranslations } from 'next-intl/server'
import { cn } from '@helpers/cn'

/**
 * The page-opening band: a headline with a marker-pen word, and loose letter tiles floating in
 * the margins (decoration only — hidden from assistive tech, still under reduced motion).
 */
const TILES = [
  { letter: 'A', className: 'bg-coral-300 inset-s-[4%] top-8 [--tilt:-8deg]' },
  { letter: 'Ж', className: 'bg-teal-300 inset-e-[6%] top-14 [--tilt:10deg] [animation-delay:1.2s]' },
  { letter: 'Ք', className: 'bg-sun-300 inset-s-[10%] bottom-6 [--tilt:6deg] [animation-delay:2.1s]' },
  { letter: 'Z', className: 'bg-lavender-300 inset-e-[12%] bottom-10 [--tilt:-12deg] [animation-delay:0.6s]' },
]

type HeroProps = { namespace: string; children?: React.ReactNode }

export const Hero = async ({ namespace, children }: HeroProps) => {
  const t = await getTranslations(namespace)
  return (
    <section className='relative overflow-hidden'>
      {TILES.map(({ letter, className }) => (
        <span
          key={letter}
          aria-hidden
          className={cn(
            'absolute hidden size-14 animate-float items-center justify-center rounded-2xl border-2 border-ink-900 font-display text-h2 font-extrabold shadow-chunky md:flex',
            className
          )}
        >
          {letter}
        </span>
      ))}
      <div className='container-page relative flex flex-col items-center gap-5 pt-10 pb-8 text-center sm:pt-16'>
        <p className='eyebrow rounded-full border-2 border-teal-600 bg-teal-100 px-3 py-1'>{t('eyebrow')}</p>
        <h1 className='max-w-4xl text-display font-extrabold text-ink-900'>
          {t.rich('title', { mark: (chunks) => <span className='highlight-sun'>{chunks}</span> })}
        </h1>
        <p className='max-w-2xl text-body text-ink-700 sm:text-h3 sm:font-normal'>{t('subtitle')}</p>
      </div>
      {children && <div className='container-page relative max-w-4xl pb-6'>{children}</div>}
    </section>
  )
}
