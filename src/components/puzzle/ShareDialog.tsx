'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Check, Copy, Mail, Share2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { toast } from '@store/toast/store'
import type { Locale } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { puzzlePath } from '@constants/routes'
import { trackEvent } from '@helpers/analytics'
import { reportError } from '@helpers/reportError'
import { SHARE_BRAND_NAMES, SHARE_ORDER, type ShareTarget, shareTargetUrl } from '@helpers/share'
import { absoluteUrl } from '@helpers/url'
import { ShareLogo } from '@components/brand/ShareLogo'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'

/**
 * Sending the puzzle to a friend: the link to copy, the apps people actually message in (in
 * the order the language's speakers use them), and the system share sheet where the browser
 * has one. A friend who opens the link gets the very same grid and clues.
 */
type ShareDialogProps = { open: boolean; onClose: () => void }

const COPIED_MS = 2000

// The server render cannot know whether the browser has a share sheet; it never changes after.
const hasShareSheet = () => typeof navigator.share === 'function'
const noop = () => () => undefined

const tile =
  'flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-control border-2 border-line-strong bg-white px-2 py-3 text-caption font-bold text-ink-900 transition-colors hover:border-ink-300 hover:bg-cream-50 focus-visible:border-ink-900'

export const ShareDialog = ({ open, onClose }: ShareDialogProps) => {
  const t = useTranslations('Play')
  const topics = useTranslations('Topics')
  // The apps follow the reader's language; the link follows the puzzle's.
  const uiLocale = useLocale() as Locale
  const puzzle = usePlayStore.use.puzzle()
  const canShareNatively = useSyncExternalStore(noop, hasShareSheet, () => false)
  const [copied, setCopied] = useState(false)
  const linkRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  if (!puzzle) return null

  const url = absoluteUrl(localePath(puzzle.locale, puzzlePath(puzzle.id)))
  const text =
    puzzle.topic === 'any'
      ? t('shareDialog.textAny', { format: puzzle.format })
      : t('shareDialog.text', { format: puzzle.format, topic: topics(`${puzzle.topic}.name`) })
  const payload = { url, text, title: t('shareTitle') }
  const track = (method: ShareTarget | 'copy' | 'native') =>
    trackEvent('puzzle_shared', { locale: puzzle.locale, format: puzzle.format, topic: puzzle.topic, method })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast(t('linkCopied'), 'success')
      track('copy')
    } catch (error) {
      // No clipboard access (an old browser, an insecure origin): leave the link selected to copy by hand.
      linkRef.current?.select()
      toast(t('shareDialog.copyFailed'), 'error')
      reportError(error, 'puzzle:share', { silent: true })
    }
  }

  const shareNatively = async () => {
    try {
      await navigator.share(payload)
      track('native')
      onClose()
    } catch (error) {
      // A dismissed share sheet rejects too; only a real failure is worth reporting.
      if ((error as Error)?.name !== 'AbortError') reportError(error, 'puzzle:share', { silent: true })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('shareDialog.title')}
      description={t('shareDialog.description')}
      variant='sheet'
    >
      <div className='flex flex-col gap-5'>
        <div className='flex gap-2'>
          <label htmlFor='share-link' className='sr-only'>
            {t('shareDialog.link')}
          </label>
          <input
            ref={linkRef}
            id='share-link'
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
            className='h-11 min-w-0 flex-1 rounded-control border-2 border-line-strong bg-cream-50 px-3 text-body-sm text-ink-700 focus:border-ink-900 focus:outline-none'
          />
          <Button
            variant={copied ? 'secondary' : 'primary'}
            size='sm'
            className='h-11 shrink-0 px-4'
            onClick={copy}
            icon={copied ? <Check aria-hidden className='size-5' /> : <Copy aria-hidden className='size-5' />}
          >
            {copied ? t('shareDialog.copied') : t('shareDialog.copy')}
          </Button>
        </div>

        <ul className='grid grid-cols-3 gap-2' aria-label={t('shareDialog.apps')}>
          {SHARE_ORDER[uiLocale].map((target) => (
            <li key={target}>
              <a
                href={shareTargetUrl(target, payload)}
                // A mail client opens from the same tab; every app link gets its own.
                {...(target === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                onClick={() => track(target)}
                className={tile}
              >
                {target === 'email' ? (
                  <Mail aria-hidden className='size-8 text-ink-700' />
                ) : (
                  <ShareLogo target={target} className='size-8' />
                )}
                {target === 'email' ? t('shareDialog.email') : SHARE_BRAND_NAMES[target]}
              </a>
            </li>
          ))}
        </ul>
        {canShareNatively && (
          <Button
            variant='outline'
            size='sm'
            fullWidth
            onClick={shareNatively}
            icon={<Share2 aria-hidden className='size-5' />}
          >
            {t('shareDialog.more')}
          </Button>
        )}
      </div>
    </Dialog>
  )
}
