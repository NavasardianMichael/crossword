'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'

/**
 * While a puzzle is being built, the rest of the page is inert — header, form, footer.
 * Cancel is the only control, and it aborts the request.
 */
export const CreatePendingShield = ({ active, onCancel }: { active: boolean; onCancel: () => void }) => {
  const t = useTranslations('Generator')
  const shieldRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!active) return
    const shield = shieldRef.current
    const blocked: { node: HTMLElement; inert: boolean }[] = []
    for (const node of document.body.children) {
      if (!(node instanceof HTMLElement) || node === shield) continue
      blocked.push({ node, inert: node.inert })
      node.inert = true
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onCancel()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      for (const { node, inert } of blocked) node.inert = inert
      document.body.style.overflow = previousOverflow
    }
  }, [active, onCancel])

  if (!active || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={shieldRef}
      role='alertdialog'
      aria-modal='true'
      aria-labelledby='create-pending-title'
      aria-describedby='create-pending-hint'
      className='fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4'
    >
      <div className='panel flex w-full max-w-md flex-col items-center gap-4 p-6 text-center sm:p-8'>
        <Spinner size='lg' />
        <h2 id='create-pending-title' className='font-display text-h3 font-bold'>
          {t('creating')}
        </h2>
        <p id='create-pending-hint' className='text-body-sm text-ink-700'>
          {t('creatingHint')}
        </p>
        <Button ref={cancelRef} variant='outline' size='lg' className='min-w-40' onClick={onCancel}>
          {t('cancel')}
        </Button>
      </div>
    </div>,
    document.body
  )
}
