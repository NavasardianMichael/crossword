'use client'

import { useState } from 'react'
import { Radio } from 'antd'
import { useTranslations } from 'next-intl'
import { reportWordAPI } from '@api/puzzles/main'
import { usePlayStore } from '@store/puzzle/play/store'
import { toast } from '@store/toast/store'
import { MAX_REPORT_NOTE, REPORT_REASONS, type ReportReason } from '@constants/puzzle'
import { activeWord } from '@helpers/puzzle/cursor'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { ErrorAlert } from '@components/ui/ErrorAlert'

/**
 * "This clue is wrong" for the word under the cursor. Reports are what retire a bad clue —
 * three from different people and an AI-written one is gone from every future puzzle.
 */
export const ReportDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations('Play.report')
  const puzzle = usePlayStore.use.puzzle()
  const model = usePlayStore.use.model()
  const cursor = usePlayStore.use.cursor()
  const [reason, setReason] = useState<ReportReason>('wrongClue')
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<unknown>(null)

  if (!puzzle || !model) return null
  const wordId = activeWord(model, cursor)
  const word = puzzle.words[wordId]!
  const noteText = note.trim()
  const needsNote = reason === 'other' && !noteText

  const close = () => {
    setReason('wrongClue')
    setNote('')
    setError(null)
    onClose()
  }

  const send = async () => {
    if (needsNote) return
    setPending(true)
    setError(null)
    try {
      await reportWordAPI({ puzzleId: puzzle.id, wordId, reason, note: reason === 'other' ? noteText : undefined })
      toast(t('thanks'), 'success')
      close()
    } catch (caught) {
      setError(caught)
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={t('title')}
      description={<span lang={puzzle.locale}>{word.clue}</span>}
      pending={pending}
      variant='sheet'
      footer={
        <>
          <Button variant='ghost' size='sm' onClick={close} disabled={pending}>
            {t('cancel')}
          </Button>
          <Button variant='primary' size='sm' onClick={send} loading={pending} disabled={needsNote}>
            {t('send')}
          </Button>
        </>
      }
    >
      <Radio.Group
        value={reason}
        onChange={(event) => setReason(event.target.value as ReportReason)}
        className='flex flex-col gap-3'
        options={REPORT_REASONS.map((value) => ({ value, label: t(`reasons.${value}`) }))}
      />
      {reason === 'other' && (
        <label className='mt-4 block'>
          <span className='block font-semibold text-ink-900'>{t('note')}</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={MAX_REPORT_NOTE}
            rows={3}
            required
            placeholder={t('notePlaceholder')}
            className='mt-2 w-full resize-y rounded-control border-2 border-line-strong bg-cream-50 px-3 py-2 text-body text-ink-900 placeholder:text-ink-500 focus:border-ink-900 focus:outline-none'
          />
        </label>
      )}
      {error ? <ErrorAlert error={error} className='mt-4' /> : null}
    </Dialog>
  )
}
