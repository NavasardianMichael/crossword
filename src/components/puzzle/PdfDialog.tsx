'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type PdfOptions, usePuzzlePdf } from '@hooks/usePuzzlePdf'
import { PDF_APPEARANCES, type PdfAppearance } from '@helpers/puzzle/pdf'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { SegmentedControl } from '@components/ui/SegmentedControl'
import { Toggle } from '@components/ui/Toggle'

const BLANK: PdfOptions = { letters: false, answers: false, appearance: 'default' }

const LOOK_LABEL: Record<PdfAppearance, 'appearanceDefault' | 'appearanceColorful' | 'appearanceMono'> = {
  default: 'appearanceDefault',
  colorful: 'appearanceColorful',
  mono: 'appearanceMono',
}

/**
 * What goes in the PDF — the light-purple grid, a colourful one, or black and white; the
 * player's letters and an answer key on request — then the file opens in a new tab.
 */
export const PdfDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations('Play.pdf')
  const [options, setOptions] = useState<PdfOptions>(BLANK)
  const { openPdf, pending, error } = usePuzzlePdf()
  const set = (key: 'letters' | 'answers') => (value: boolean) => setOptions((current) => ({ ...current, [key]: value }))

  const pdf = async () => {
    if (await openPdf(options)) onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('title')}
      description={t('description')}
      variant='sheet'
      pending={pending}
      footer={
        <>
          <Button variant='ghost' size='sm' onClick={onClose} disabled={pending}>
            {t('cancel')}
          </Button>
          <Button variant='primary' size='sm' onClick={pdf} loading={pending} icon={<FileDown aria-hidden className='size-4' />}>
            {t('confirm')}
          </Button>
        </>
      }
    >
      <div className='flex flex-col gap-5'>
        <div>
          <p className='mb-3 font-display text-h3 font-bold'>{t('appearance')}</p>
          <SegmentedControl
            label={t('appearance')}
            value={options.appearance}
            onChange={(appearance) => setOptions((current) => ({ ...current, appearance }))}
            options={PDF_APPEARANCES.map((value) => ({ value, label: t(LOOK_LABEL[value]) }))}
            size='sm'
            block
          />
        </div>
        <Toggle label={t('letters')} description={t('lettersHint')} checked={options.letters} onChange={set('letters')} />
        <Toggle label={t('answers')} description={t('answersHint')} checked={options.answers} onChange={set('answers')} />
      </div>
      {error ? <ErrorAlert error={error} message={t('failed')} onRetry={pdf} className='mt-4' /> : null}
    </Dialog>
  )
}
