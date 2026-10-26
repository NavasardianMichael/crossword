'use client'

import { useState } from 'react'
import { FileDown, Printer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePuzzlePdf } from '@hooks/usePuzzlePdf'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Toggle } from '@components/ui/Toggle'
import { BLANK_PRINT, type PrintOptions } from './PrintSheet'

/**
 * What goes on the sheet — a blank grid by default, the player's letters and an answer key on
 * request — then one action: `print` sends it to the printer, `pdf` builds it as a PDF that
 * opens in a new tab. Two menu items, one dialog each.
 */
type PrintDialogProps = { open: boolean; onClose: () => void } & (
  | { mode: 'print'; onPrint: (options: PrintOptions) => void }
  | { mode: 'pdf' }
)

export const PrintDialog = (props: PrintDialogProps) => {
  const { open, onClose, mode } = props
  const t = useTranslations('Play.print')
  const [options, setOptions] = useState<PrintOptions>(BLANK_PRINT)
  const { openPdf, pending, error } = usePuzzlePdf()
  const set = (key: keyof PrintOptions) => (value: boolean) => setOptions((current) => ({ ...current, [key]: value }))

  const pdf = async () => {
    if (await openPdf(options)) onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t(mode === 'pdf' ? 'pdfTitle' : 'title')}
      description={t(mode === 'pdf' ? 'pdfDescription' : 'description')}
      variant='sheet'
      pending={pending}
      footer={
        <>
          <Button variant='ghost' size='sm' onClick={onClose} disabled={pending}>
            {t('cancel')}
          </Button>
          {props.mode === 'pdf' ? (
            <Button variant='primary' size='sm' onClick={pdf} loading={pending} icon={<FileDown aria-hidden className='size-4' />}>
              {t('pdf')}
            </Button>
          ) : (
            <Button variant='primary' size='sm' onClick={() => props.onPrint(options)} icon={<Printer aria-hidden className='size-4' />}>
              {t('confirm')}
            </Button>
          )}
        </>
      }
    >
      <div className='flex flex-col gap-5'>
        <Toggle label={t('letters')} description={t('lettersHint')} checked={options.letters} onChange={set('letters')} />
        <Toggle label={t('answers')} description={t('answersHint')} checked={options.answers} onChange={set('answers')} />
      </div>
      {error ? <ErrorAlert error={error} message={t('pdfFailed')} onRetry={pdf} className='mt-4' /> : null}
    </Dialog>
  )
}
