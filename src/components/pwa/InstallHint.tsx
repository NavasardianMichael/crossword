'use client'

import { useEffect, useState } from 'react'
import { Steps } from 'antd'
import { PlusSquare, Share } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { STORAGE_KEYS } from '@constants/app'
import { isInstalledApp, isIos } from '@helpers/device'
import { readJson, writeJson } from '@helpers/storage'
import { Emblem } from '@components/brand/Emblem'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'

/**
 * iOS cannot prompt for installation, so — as in hangman — iPhone and iPad visitors get a
 * one-time explainer for Safari's Add to Home Screen. Shown once per visit at most, never
 * again for three days after it is closed, and never for an installed app.
 */
const IOS_HINT_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000
const SHOW_AFTER_MS = 20_000

let shownThisVisit = false

const closedRecently = (): boolean => {
  const closedAt = readJson<number>(STORAGE_KEYS.iosHintClosedAt, 0)
  return Boolean(closedAt) && Date.now() - closedAt < IOS_HINT_COOLDOWN_MS
}

export const InstallHint = () => {
  const [open, setOpen] = useState(false)
  const t = useTranslations('Pwa')

  useEffect(() => {
    if (shownThisVisit || !isIos() || isInstalledApp() || closedRecently()) return
    // Not on arrival: let the visitor see what the app is before asking them to install it.
    const timer = setTimeout(() => {
      shownThisVisit = true
      setOpen(true)
    }, SHOW_AFTER_MS)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    setOpen(false)
    writeJson(STORAGE_KEYS.iosHintClosedAt, Date.now())
  }

  const steps = [
    { icon: <Share aria-hidden className='size-5' />, text: t('iosStep1') },
    { icon: <PlusSquare aria-hidden className='size-5' />, text: t('iosStep2') },
    { icon: <Emblem className='size-5' />, text: t('iosStep3') },
  ]

  return (
    <Dialog
      open={open}
      onClose={close}
      title={t('iosTitle')}
      description={t('benefit')}
      variant='sheet'
      footer={
        <Button onClick={close} size='sm'>
          {t('gotIt')}
        </Button>
      }
    >
      <Steps
        orientation='vertical'
        current={-1}
        items={steps.map(({ icon, text }) => ({
          title: <span className='text-body-sm text-ink-900'>{text}</span>,
          icon: (
            <span className='flex size-8 items-center justify-center rounded-control bg-coral-100 text-coral-700'>
              {icon}
            </span>
          ),
        }))}
      />
    </Dialog>
  )
}
