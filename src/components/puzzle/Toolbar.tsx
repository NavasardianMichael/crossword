'use client'

import { useState } from 'react'
import { Dropdown, type MenuProps } from 'antd'
import { CheckCheck, ChevronRight, Eraser, Eye, FileDown, Flag, ListOrdered, MoreHorizontal, Plus, Settings2, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import type { Scope } from '@store/puzzle/play/types'
import { cn } from '@helpers/cn'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { Toggle } from '@components/ui/Toggle'
import { PdfDialog } from './PdfDialog'
import { ReportDialog } from './ReportDialog'
import { Timer } from './Timer'

/**
 * Tools around the grid, in one row: the clock, check and reveal (letter, word or whole
 * puzzle — a whole reveal asks first), and a "more" menu with clearing wrong letters,
 * settings, a PDF and reporting a bad clue (sharing and a new puzzle sit beside the
 * heading, in `PuzzleBoard`).
 *
 * `compact` (the game layout's top bar): the clock and one menu holding every action — a new
 * puzzle, sharing and the clue list first, then check and reveal as submenus, then the rest.
 */
type ToolbarProps = {
  compact?: { onNewPuzzle: () => void; onShare: () => void; onShowClues?: () => void; creating: boolean }
  className?: string
}

type Overlay = 'none' | 'confirmReveal' | 'settings' | 'pdf' | 'report'

const icon = 'size-4'

export const Toolbar = ({ compact, className }: ToolbarProps) => {
  const t = useTranslations('Play')
  const puzzle = usePlayStore.use.puzzle()
  const status = usePlayStore.use.status()
  const settings = usePlayStore.use.settings()
  const check = usePlayStore.use.check()
  const reveal = usePlayStore.use.reveal()
  const clearWrong = usePlayStore.use.clearWrong()
  const setSetting = usePlayStore.use.setSetting()
  const [overlay, setOverlay] = useState<Overlay>('none')

  if (!puzzle) return null
  const playing = status === 'playing'
  const close = () => setOverlay('none')

  // Keyed `check:word`, `reveal:puzzle`…: the compact menu holds both sets at once.
  const scopeItems = (action: 'check' | 'reveal') =>
    (['cell', 'word', 'puzzle'] as Scope[]).map((scope) => ({ key: `${action}:${scope}`, label: t(`${action}.${scope}`) }))

  const moreItems: MenuProps['items'] = [
    { key: 'clearWrong', label: t('clearWrong'), icon: <Eraser aria-hidden className={icon} />, disabled: !playing },
    { key: 'settings', label: t('settings.label'), icon: <Settings2 aria-hidden className={icon} /> },
    { key: 'pdf', label: t('pdf.open'), icon: <FileDown aria-hidden className={icon} /> },
    { key: 'report', label: t('report.open'), icon: <Flag aria-hidden className={icon} /> },
  ]
  const compactItems: MenuProps['items'] = [
    { key: 'newPuzzle', label: t('newPuzzle'), icon: <Plus aria-hidden className={icon} /> },
    { key: 'share', label: t('share'), icon: <Share2 aria-hidden className={icon} /> },
    ...(compact?.onShowClues ? [{ key: 'clues', label: t('allClues'), icon: <ListOrdered aria-hidden className={icon} /> }] : []),
    { type: 'divider' },
    { key: 'check', label: t('check.label'), icon: <CheckCheck aria-hidden className={icon} />, disabled: !playing, children: scopeItems('check') },
    { key: 'reveal', label: t('reveal.label'), icon: <Eye aria-hidden className={icon} />, disabled: !playing, children: scopeItems('reveal') },
    { type: 'divider' },
    ...moreItems,
  ]

  const onMenu: MenuProps['onClick'] = ({ key }) => {
    const [action, scope] = key.split(':') as [string, Scope | undefined]
    if (action === 'check') check(scope!)
    else if (action === 'reveal') {
      if (scope === 'puzzle') setOverlay('confirmReveal')
      else reveal(scope!)
    } else if (action === 'clearWrong') clearWrong()
    else if (action === 'clues') compact?.onShowClues?.()
    else if (action === 'share') compact?.onShare()
    else if (action === 'newPuzzle') compact?.onNewPuzzle()
    else setOverlay(action as Overlay)
  }

  const tool = 'h-11 gap-1.5 px-3 sm:px-4'
  const label = 'hidden sm:inline'

  const tools = compact ? (
    <Dropdown
      trigger={['click']}
      placement='bottomRight'
      // Submenus open on a tap, not a hover; a short screen scrolls the menu, not the page.
      menu={{
        items: compactItems,
        onClick: onMenu,
        triggerSubMenuAction: 'click',
        // antd's own arrow is labelled "right", which would join the item's name.
        expandIcon: <ChevronRight aria-hidden className='ms-auto size-4 text-ink-500 rtl:-scale-x-100' />,
        className: 'max-h-[calc(100dvh-5rem)] overflow-y-auto',
      }}
    >
      <Button
        variant='outline'
        size='sm'
        className='h-11 px-3'
        aria-label={t('more')}
        loading={compact.creating}
        icon={<MoreHorizontal aria-hidden className='size-5' />}
      />
    </Dropdown>
  ) : (
    <>
      <Dropdown disabled={!playing} trigger={['click']} menu={{ items: scopeItems('check'), onClick: onMenu }}>
        <Button variant='secondary' size='sm' className={tool} aria-label={t('check.label')}>
          <CheckCheck aria-hidden className='size-5' />
          <span className={label}>{t('check.label')}</span>
        </Button>
      </Dropdown>
      <Dropdown disabled={!playing} trigger={['click']} menu={{ items: scopeItems('reveal'), onClick: onMenu }}>
        <Button variant='sun' size='sm' className={tool} aria-label={t('reveal.label')}>
          <Eye aria-hidden className='size-5' />
          <span className={label}>{t('reveal.label')}</span>
        </Button>
      </Dropdown>
      <Dropdown trigger={['click']} placement='bottomRight' menu={{ items: moreItems, onClick: onMenu }}>
        <Button variant='outline' size='sm' className='h-11 px-3' aria-label={t('more')}>
          <MoreHorizontal aria-hidden className='size-5' />
        </Button>
      </Dropdown>
    </>
  )

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Timer />
      <div className='ms-auto flex items-center gap-2'>{tools}</div>

      <Dialog
        open={overlay === 'confirmReveal'}
        onClose={close}
        title={t('reveal.confirmTitle')}
        description={t('reveal.confirmText')}
        footer={
          <>
            <Button variant='ghost' size='sm' onClick={close}>
              {t('reveal.cancel')}
            </Button>
            <Button
              variant='sun'
              size='sm'
              onClick={() => {
                close()
                reveal('puzzle')
              }}
            >
              {t('reveal.confirm')}
            </Button>
          </>
        }
      />
      <Dialog open={overlay === 'settings'} onClose={close} title={t('settings.label')} variant='sheet'>
        <div className='flex flex-col gap-5'>
          <Toggle
            label={t('settings.autoCheck')}
            description={t('settings.autoCheckHint')}
            checked={settings.autoCheck}
            onChange={(value) => setSetting('autoCheck', value)}
          />
          <Toggle
            label={t('settings.skipFilled')}
            description={t('settings.skipFilledHint')}
            checked={settings.skipFilled}
            onChange={(value) => setSetting('skipFilled', value)}
          />
        </div>
      </Dialog>
      <PdfDialog open={overlay === 'pdf'} onClose={close} />
      <ReportDialog open={overlay === 'report'} onClose={close} />
    </div>
  )
}
