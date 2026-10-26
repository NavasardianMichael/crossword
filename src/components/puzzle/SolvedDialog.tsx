'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { PartyPopper, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { CONFETTI_COLORS } from '@styles/tokens'
import { formatDuration } from './Timer'

/**
 * The finish: confetti in the crayon colours (skipped under reduced motion), the time, how
 * much help it took, and the way to the next puzzle.
 */
type SolvedDialogProps = { open: boolean; onClose: () => void; onNewPuzzle: () => void; pending: boolean }

export const SolvedDialog = ({ open, onClose, onNewPuzzle, pending }: SolvedDialogProps) => {
  const t = useTranslations('Play.solved')
  const elapsedMs = usePlayStore.use.elapsedMs()
  const checks = usePlayStore.use.checks()
  const reveals = usePlayStore.use.reveals()
  const fired = useRef(false)

  useEffect(() => {
    if (!open || fired.current) return
    fired.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    void confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 }, colors: CONFETTI_COLORS, disableForReducedMotion: true })
  }, [open])

  const stats = [
    { label: t('time'), value: formatDuration(elapsedMs) },
    { label: t('checks'), value: String(checks) },
    { label: t('reveals'), value: String(reveals) },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <span className='flex items-center gap-2'>
          <PartyPopper aria-hidden className='size-6 text-coral-500' />
          {reveals ? t('titleHelped') : t('title')}
        </span>
      }
      footer={
        <>
          <Button variant='ghost' size='sm' onClick={onClose}>
            {t('admire')}
          </Button>
          <Button variant='primary' size='sm' onClick={onNewPuzzle} loading={pending} icon={<Plus aria-hidden className='size-5' />}>
            {t('next')}
          </Button>
        </>
      }
    >
      <dl className='grid grid-cols-3 gap-3'>
        {stats.map(({ label, value }) => (
          <div key={label} className='rounded-control border-2 border-line-subtle bg-white p-3 text-center'>
            <dt className='text-caption font-bold text-ink-700 uppercase'>{label}</dt>
            <dd className='font-display text-h2 font-extrabold text-ink-900 tabular'>{value}</dd>
          </div>
        ))}
      </dl>
    </Dialog>
  )
}
