import type { CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'
import { type Locale, LOCALES } from '@constants/puzzle'
import { cn } from '@helpers/cn'

/**
 * The page-opening band: a headline with a marker-pen word, and loose letter tiles floating in
 * the margins (decoration only — hidden from assistive tech, still under reduced motion).
 */
const TILE_CLASS =
  'absolute hidden size-14 animate-float items-center justify-center rounded-2xl border-2 border-ink-900 font-display text-h2 font-extrabold shadow-chunky'

const CORNER_TILES = [
  { letter: 'A', className: 'bg-coral-300 inset-s-[4%] top-8 [--tilt:-8deg]' },
  { letter: 'Ж', className: 'bg-teal-300 inset-e-[6%] top-14 [--tilt:10deg] [animation-delay:1.2s]' },
  { letter: 'Ք', className: 'bg-sun-300 inset-s-[10%] bottom-6 [--tilt:6deg] [animation-delay:2.1s]' },
  { letter: 'Z', className: 'bg-lavender-300 inset-e-[12%] bottom-10 [--tilt:-12deg] [animation-delay:0.6s]' },
]

/** A letter that belongs to each language — typed by `Locale`, so a new language needs its tile. */
const LANGUAGE_LETTERS: Record<Locale, string> = {
  en: 'W',
  ru: 'Ж',
  hy: 'Ք',
  es: 'Ñ',
  pt: 'Ã',
  fr: 'Ç',
  de: 'Ä',
  id: 'K',
  mr: 'ळ',
  it: 'È',
  pl: 'Ł',
  vi: 'Ư',
  uk: 'Ї',
  ar: 'ض',
  hi: 'ह',
  ko: '한',
  bn: 'অ',
  ja: 'あ',
  zh: '字',
  fa: 'پ',
  nl: 'Ë',
  ro: 'Ș',
  el: 'Ω',
  cs: 'Ř',
  sv: 'Å',
  hu: 'Ő',
  he: 'ש',
  fil: 'Ng',
  ms: 'M',
  ur: 'ڑ',
  th: 'ก',
  ta: 'ழ',
  sw: 'J',
}

const TILE_COLOURS = [
  'bg-coral-300',
  'bg-teal-300',
  'bg-sun-300',
  'bg-lavender-300',
  'bg-mint-300',
  'bg-sky-300',
  'bg-rose-300',
]

const ROWS = Math.ceil(LOCALES.length / 2)

/**
 * Tiles alternate between the two margins, zigzagging down each in two columns: the outer
 * column shows from `lg`, the inner one from `xl`, where the margin is wide enough for both.
 */
const LANGUAGE_TILES = LOCALES.map((locale, i) => {
  const row = Math.floor(i / 2)
  const inner = row % 2 === 1
  const inset = inner ? '8.5%' : '1.5%'
  const style = {
    top: `${2 + (row * 88) / (ROWS - 1)}%`,
    [i % 2 === 0 ? 'insetInlineStart' : 'insetInlineEnd']: inset,
    '--tilt': `${((i * 37) % 25) - 12}deg`,
    animationDelay: `${((i * 1.3) % 7).toFixed(1)}s`,
  } as CSSProperties
  return {
    key: locale,
    letter: LANGUAGE_LETTERS[locale],
    className: cn(TILE_COLOURS[i % TILE_COLOURS.length], inner ? 'xl:flex' : 'lg:flex'),
    style,
  }
})

type HeroProps = {
  namespace: string
  /** `languages`: a tile for every language, for a hero tall enough to hold them all. */
  tiles?: 'corners' | 'languages'
  children?: React.ReactNode
}

export const Hero = async ({ namespace, tiles = 'corners', children }: HeroProps) => {
  const t = await getTranslations(namespace)
  return (
    <section className='relative overflow-hidden'>
      {tiles === 'languages'
        ? LANGUAGE_TILES.map(({ key, letter, className, style }) => (
            <span key={key} aria-hidden className={cn(TILE_CLASS, className)} style={style}>
              {letter}
            </span>
          ))
        : CORNER_TILES.map(({ letter, className }) => (
            <span key={letter} aria-hidden className={cn(TILE_CLASS, 'md:flex', className)}>
              {letter}
            </span>
          ))}
      <div className='container-page relative flex flex-col items-center gap-5 pt-10 pb-8 text-center sm:pt-16'>
        <p className='eyebrow rounded-full border-2 border-teal-600 bg-teal-100 px-3 py-1'>{t('eyebrow')}</p>
        <h1 className='max-w-4xl text-display font-extrabold text-ink-900'>
          {t.rich('title', { mark: (chunks) => <span className='highlight-sun'>{chunks}</span> })}
        </h1>
        <p className='max-w-2xl text-body text-ink-700 sm:text-h3 sm:font-normal'>{t('subtitle')}</p>
        <p id='language-intro' className='max-w-3xl text-body-sm leading-relaxed text-ink-700'>
          {t('lede')}
        </p>
      </div>
      {children && <div className='container-page relative max-w-4xl pb-6'>{children}</div>}
    </section>
  )
}
