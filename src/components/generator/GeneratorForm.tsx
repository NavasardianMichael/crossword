'use client'

import { useEffect } from 'react'
import { Grid3x3, LayoutGrid, Shuffle, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useCreateStore } from '@store/puzzle/create/store'
import type { GeneratorOptions } from '@store/puzzle/create/types'
import { useRouter } from '@i18n/navigation'
import { DIFFICULTIES, FORMATS, isLocale, SIZES, type TopicChoice,TOPICS } from '@constants/puzzle'
import { puzzlePath } from '@constants/routes'
import { TOPIC_STYLES } from '@constants/topicStyles'
import { cn } from '@helpers/cn'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { SegmentedControl } from '@components/ui/SegmentedControl'

/**
 * Pick a format, a topic, a difficulty and a size, and get a puzzle of words this device has
 * never seen. A landing page can preset the format or the topic; the last choices are
 * remembered. A request the pool cannot fill waits for fresh words from the AI, so the button
 * says what is happening.
 */
type GeneratorFormProps = { preset?: Partial<GeneratorOptions>; className?: string }

const FORMAT_ICONS = { classic: Grid3x3, scanword: LayoutGrid } as const

export const GeneratorForm = ({ preset, className }: GeneratorFormProps) => {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const options = useCreateStore.use.options()
  const isPending = useCreateStore.use.isPending()
  const error = useCreateStore.use.error()
  const hydrateOptions = useCreateStore.use.hydrateOptions()
  const setOptions = useCreateStore.use.setOptions()
  const createPuzzle = useCreateStore.use.createPuzzle()

  useEffect(() => {
    hydrateOptions()
    if (preset) setOptions(preset)
    // The preset is a page constant; re-applying it on every render would undo the player's choice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async () => {
    if (!isLocale(locale)) return
    const puzzle = await createPuzzle(locale)
    if (puzzle) router.push(puzzlePath(puzzle.id))
  }

  const topicOptions: TopicChoice[] = ['any', ...TOPICS]

  return (
    <form
      className={cn('panel flex flex-col gap-6 p-5 sm:p-7', className)}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      aria-busy={isPending || undefined}
    >
      <fieldset>
        <legend className='mb-3 font-display text-h3 font-bold'>{t('Generator.format')}</legend>
        <div className='grid gap-3 sm:grid-cols-2'>
          {FORMATS.map((format) => {
            const Icon = FORMAT_ICONS[format]
            const selected = options.format === format
            return (
              <label
                key={format}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-panel border-2 p-4 transition-all has-focus-visible:ring-4 has-focus-visible:ring-sky-300',
                  selected ? 'border-ink-900 bg-sun-100 shadow-chunky' : 'border-line-strong bg-white hover:border-ink-300'
                )}
              >
                <input
                  type='radio'
                  name='format'
                  value={format}
                  checked={selected}
                  onChange={() => setOptions({ format })}
                  className='sr-only'
                />
                <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-control border-2 border-ink-900', selected ? 'bg-coral-400' : 'bg-cream-200')}>
                  <Icon aria-hidden className='size-6' />
                </span>
                <span>
                  <span className='block font-display font-bold'>{t(`Formats.${format}.name`)}</span>
                  <span className='block text-body-sm text-ink-700'>{t(`Formats.${format}.short`)}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className='mb-3 font-display text-h3 font-bold'>{t('Generator.topic')}</legend>
        <div className='flex flex-wrap gap-2'>
          {topicOptions.map((topic) => {
            const style = topic === 'any' ? null : TOPIC_STYLES[topic]
            const Icon = style?.icon ?? Shuffle
            const selected = options.topic === topic
            return (
              <label
                key={topic}
                className={cn(
                  'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-3.5 text-body-sm font-bold transition-all has-focus-visible:ring-4 has-focus-visible:ring-sky-300',
                  selected ? cn('border-ink-900 shadow-chunky', style?.chip ?? 'bg-sun-100') : 'border-line-strong bg-white hover:border-ink-300'
                )}
              >
                <input type='radio' name='topic' value={topic} checked={selected} onChange={() => setOptions({ topic })} className='sr-only' />
                <Icon aria-hidden className='size-4' />
                {t(topic === 'any' ? 'Topics.any' : `Topics.${topic}.name`)}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className='grid gap-5 sm:grid-cols-2'>
        <div>
          <p id='difficulty-label' className='mb-3 font-display text-h3 font-bold'>
            {t('Generator.difficulty')}
          </p>
          <SegmentedControl
            label={t('Generator.difficulty')}
            value={options.difficulty}
            onChange={(difficulty) => setOptions({ difficulty })}
            options={DIFFICULTIES.map((value) => ({ value, label: t(`Difficulty.${value}`) }))}
            block
          />
        </div>
        <div>
          <p className='mb-3 font-display text-h3 font-bold'>{t('Generator.size')}</p>
          <SegmentedControl
            label={t('Generator.size')}
            value={options.size}
            onChange={(size) => setOptions({ size })}
            options={SIZES.map((value) => ({ value, label: t(`Sizes.${value}`) }))}
            block
          />
        </div>
      </div>

      {error ? <ErrorAlert error={error} message={generatorError(t, error)} onRetry={submit} /> : null}

      <div className='flex flex-col items-center gap-2'>
        <Button
          type='submit'
          size='lg'
          fullWidth
          loading={isPending}
          icon={isPending ? undefined : <Sparkles aria-hidden className='size-6' />}
          className='sm:w-auto sm:min-w-80'
        >
          {isPending ? t('Generator.creating') : t('Generator.create')}
        </Button>
        <p className='text-center text-body-sm text-ink-500' aria-live='polite'>
          {isPending ? t('Generator.creatingHint') : t('Generator.freshHint')}
        </p>
      </div>
    </form>
  )
}

/** The pool's "every unseen word is used up" answer has its own, friendlier copy. */
const generatorError = (t: ReturnType<typeof useTranslations>, error: unknown): string | undefined => {
  const status = (error as { response?: { status?: number } })?.response?.status
  return status === 503 ? t('Generator.exhausted') : undefined
}
