import { Lightbulb } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { displayWord, normalizeWord } from '@constants/alphabet'
import type { Locale } from '@constants/puzzle'
import type { ContentBlock, ContentSection } from '@content/types'
import { RichText } from './RichText'

type Labels = { weak: string; strong: string; tip: string; showAnswer: string }

/**
 * Answers are printed as the board prints them: normalized (Russian ё as е) and through
 * `displayWord`, never CSS `uppercase` (Armenian `և`).
 */
const Block = ({ block, labels, locale }: { block: ContentBlock; labels: Labels; locale: Locale }) => {
  switch (block.kind) {
    case 'p':
      return (
        <p className='mt-4 leading-relaxed'>
          <RichText text={block.text} />
        </p>
      )
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul'
      return (
        <List className={`mt-4 flex flex-col gap-2 ps-6 leading-relaxed marker:font-bold marker:text-coral-600 ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </List>
      )
    }
    case 'tip':
      return (
        <aside className='mt-5 flex gap-3 rounded-panel border-2 border-ink-900 bg-sun-100 p-4 leading-relaxed'>
          <Lightbulb aria-hidden className='mt-0.5 size-5 shrink-0 text-sun-700' />
          <p>
            <span className='sr-only'>{labels.tip}: </span>
            <RichText text={block.text} />
          </p>
        </aside>
      )
    case 'compare':
      return (
        <div className='mt-5 grid gap-3 sm:grid-cols-2'>
          <figure className='rounded-panel border-2 border-rose-300 bg-rose-100 p-4'>
            <figcaption className='text-caption font-bold text-rose-700'>✕ {labels.weak}</figcaption>
            <blockquote className='mt-2 leading-relaxed text-ink-700'>
              <RichText text={block.weak} />
            </blockquote>
          </figure>
          <figure className='rounded-panel border-2 border-mint-400 bg-mint-100 p-4'>
            <figcaption className='text-caption font-bold text-mint-700'>✓ {labels.strong}</figcaption>
            <blockquote className='mt-2 leading-relaxed text-ink-900'>
              <RichText text={block.strong} />
            </blockquote>
          </figure>
        </div>
      )
    case 'clues':
      return (
        <ul className='mt-5 grid gap-3 sm:grid-cols-2'>
          {block.items.map(({ clue, answer }) => (
            <li key={clue} className='rounded-panel border-2 border-ink-900 bg-surface p-4'>
              <p className='font-semibold text-ink-900'>{clue}</p>
              <details className='mt-2'>
                <summary className='cursor-pointer text-body-sm font-bold text-teal-700'>{labels.showAnswer}</summary>
                <p className='mt-1 font-display text-h3 font-extrabold tracking-wider text-ink-900'>{displayWord(normalizeWord(answer, locale) ?? answer, locale)}</p>
              </details>
            </li>
          ))}
        </ul>
      )
  }
}

/** A guide's sections: an `<h2>` each, anchored for the table of contents. */
export const ContentSections = async ({ sections, locale }: { sections: ContentSection[]; locale: Locale }) => {
  const t = await getTranslations('Content')
  const labels: Labels = { weak: t('weak'), strong: t('strong'), tip: t('tip'), showAnswer: t('showAnswer') }
  return sections.map((section) => (
    <section key={section.id} id={section.id} className='mt-10 scroll-mt-24' aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`} className='font-display text-h2 font-extrabold text-ink-900'>
        {section.heading}
      </h2>
      {section.blocks.map((block, index) => (
        <Block key={index} block={block} labels={labels} locale={locale} />
      ))}
    </section>
  ))
}
