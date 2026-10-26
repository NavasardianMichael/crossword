'use client'

import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Dropdown, type MenuProps } from 'antd'
import { CheckCheck, Eraser, Eye, FileDown, Flag, ListOrdered, MoreHorizontal, Printer, Settings2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import type { Scope } from '@store/puzzle/play/types'
import { trackEvent } from '@helpers/analytics'
import { cn } from '@helpers/cn'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { Toggle } from '@components/ui/Toggle'
import { PrintDialog } from './PrintDialog'
import { BLANK_PRINT, type PrintOptions, PrintSheet } from './PrintSheet'
import { ReportDialog } from './ReportDialog'
import { Timer } from './Timer'

/**
 * Tools around the grid, in one row on every screen: the clock, the clue list (below `lg`),
 * check and reveal (letter, word or whole puzzle — a whole reveal asks first), and a "more"
 * menu with clearing wrong letters, settings, printing, a PDF and reporting a bad clue (sharing sits
 * beside the heading, in `PuzzleBoard`). Labels show from `sm` up; on phones the buttons are
 * icons with accessible names.
 */
type ToolbarProps = { onShowClues?: () => void; className?: string }

type Overlay = 'none' | 'confirmReveal' | 'settings' | 'print' | 'pdf' | 'report'

export const Toolbar = ({ onShowClues, className }: ToolbarProps) => {
  const t = useTranslations('Play')
  const puzzle = usePlayStore.use.puzzle()
  const status = usePlayStore.use.status()
  const settings = usePlayStore.use.settings()
  const check = usePlayStore.use.check()
  const reveal = usePlayStore.use.reveal()
  const clearWrong = usePlayStore.use.clearWrong()
  const setSetting = usePlayStore.use.setSetting()
  const [overlay, setOverlay] = useState<Overlay>('none')
  const [printOptions, setPrintOptions] = useState<PrintOptions>(BLANK_PRINT)

  if (!puzzle) return null
  const playing = status === 'playing'
  const close = () => setOverlay('none')

  const scopeItems = (action: 'check' | 'reveal'): MenuProps['items'] =>
    (['cell', 'word', 'puzzle'] as Scope[]).map((scope) => ({ key: scope, label: t(`${action}.${scope}`) }))

  const print = (options: PrintOptions) => {
    close()
    // The sheet must carry the new options before the browser lays the page out for paper.
    flushSync(() => setPrintOptions(options))
    trackEvent('puzzle_printed', { format: puzzle.format, ...options })
    window.print()
  }

  const moreItems: MenuProps['items'] = [
    { key: 'clearWrong', label: t('clearWrong'), icon: <Eraser aria-hidden className='size-4' />, disabled: !playing },
    { key: 'settings', label: t('settings.label'), icon: <Settings2 aria-hidden className='size-4' /> },
    { key: 'print', label: t('print.open'), icon: <Printer aria-hidden className='size-4' /> },
    { key: 'pdf', label: t('print.pdfOpen'), icon: <FileDown aria-hidden className='size-4' /> },
    { key: 'report', label: t('report.open'), icon: <Flag aria-hidden className='size-4' /> },
  ]
  const onMore: MenuProps['onClick'] = ({ key }) => {
    if (key === 'clearWrong') clearWrong()
    else setOverlay(key as Overlay)
  }

  const tool = 'h-11 gap-1.5 px-3 sm:px-4'
  const label = 'hidden sm:inline'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Timer />
      <div className='ms-auto flex items-center gap-2'>
        {onShowClues && (
          <Button variant='outline' size='sm' className={cn(tool, 'lg:hidden')} onClick={onShowClues} aria-label={t('allClues')}>
            <ListOrdered aria-hidden className='size-5' />
            <span className={label}>{t('allClues')}</span>
          </Button>
        )}
        <Dropdown disabled={!playing} trigger={['click']} menu={{ items: scopeItems('check'), onClick: ({ key }) => check(key as Scope) }}>
          <Button variant='secondary' size='sm' className={tool} aria-label={t('check.label')}>
            <CheckCheck aria-hidden className='size-5' />
            <span className={label}>{t('check.label')}</span>
          </Button>
        </Dropdown>
        <Dropdown
          disabled={!playing}
          trigger={['click']}
          menu={{
            items: scopeItems('reveal'),
            onClick: ({ key }) => (key === 'puzzle' ? setOverlay('confirmReveal') : reveal(key as Scope)),
          }}
        >
          <Button variant='sun' size='sm' className={tool} aria-label={t('reveal.label')}>
            <Eye aria-hidden className='size-5' />
            <span className={label}>{t('reveal.label')}</span>
          </Button>
        </Dropdown>
        <Dropdown trigger={['click']} placement='bottomRight' menu={{ items: moreItems, onClick: onMore }}>
          <Button variant='outline' size='sm' className='h-11 px-3' aria-label={t('more')}>
            <MoreHorizontal aria-hidden className='size-5' />
          </Button>
        </Dropdown>
      </div>

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
      <PrintDialog mode='print' open={overlay === 'print'} onClose={close} onPrint={print} />
      <PrintDialog mode='pdf' open={overlay === 'pdf'} onClose={close} />
      <PrintSheet options={printOptions} />
      <ReportDialog open={overlay === 'report'} onClose={close} />
    </div>
  )
}
