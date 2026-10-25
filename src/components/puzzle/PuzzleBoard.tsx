'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { Plus, WifiOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCreateStore } from '@store/puzzle/create/store'
import { usePlayStore, usePlayStoreBase } from '@store/puzzle/play/store'
import { useCoarsePointer } from '@hooks/useCoarsePointer'
import { useRouter } from '@i18n/navigation'
import type { PuzzleView } from '@constants/puzzle'
import { puzzlePath } from '@constants/routes'
import { loadProgress, loadPuzzle, savePuzzle } from '@helpers/offline/db'
import { addSeen } from '@helpers/puzzle/seen'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Spinner } from '@components/ui/Spinner'
import { ClueBar } from './ClueBar'
import { ClueLists } from './ClueLists'
import { Grid } from './Grid'
import { OnScreenKeyboard } from './OnScreenKeyboard'
import { PuzzleHeading } from './PuzzleHeading'
import { SolvedDialog } from './SolvedDialog'
import { Toolbar } from './Toolbar'

/**
 * One puzzle, playable on any screen:
 * - **phone**: toolbar, grid, then — within thumb reach at the bottom — the active clue and the
 *   language's keyboard; the clue list opens as a sheet;
 * - **tablet / small desktop** (`lg`): the grid with a clue panel beside it;
 * - **wide desktop** (`xl`): Across | grid | Down.
 *
 * The puzzle comes from the server render when online, otherwise from the device (it was saved
 * when it arrived), so a started game reopens offline. Progress is restored and saved as you go.
 */
type PuzzleBoardProps = { id: string; initial: PuzzleView | null }

type LoadState = { status: 'loading' } | { status: 'ready' } | { status: 'missing' }

export const PuzzleBoard = ({ id, initial }: PuzzleBoardProps) => {
  const t = useTranslations('Play')
  const router = useRouter()
  const coarse = useCoarsePointer()
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [cluesOpen, setCluesOpen] = useState(false)
  const [dismissedSolve, setDismissedSolve] = useState<number | null>(null)
  const puzzle = usePlayStore.use.puzzle()
  const status = usePlayStore.use.status()
  const announcement = usePlayStore.use.announcement()
  const start = usePlayStore.use.start()
  const createPuzzle = useCreateStore.use.createPuzzle()
  const creating = useCreateStore.use.isPending()
  const createError = useCreateStore.use.error()

  useEffect(() => {
    let cancelled = false
    const open = async () => {
      const stored = await loadPuzzle(id)
      const found = initial ?? stored ?? null
      if (cancelled) return
      if (!found) return setLoad({ status: 'missing' })
      // Opened from a shared link: its words are seen now, and it is kept for offline play.
      if (!stored) {
        addSeen(
          found.locale,
          found.words.map(({ entryId }) => entryId)
        )
        await savePuzzle(found)
      }
      const progress = await loadProgress(id)
      if (cancelled) return
      start(found, progress)
      setLoad({ status: 'ready' })
    }
    void open()
    return () => {
      cancelled = true
      usePlayStoreBase.getState().flush()
    }
  }, [id, initial, start])

  // The clock stops while nobody is looking; progress is written before the page can be killed.
  useEffect(() => {
    const onVisibility = () => {
      const play = usePlayStoreBase.getState()
      if (document.visibilityState === 'hidden') play.flush()
      else play.resume()
    }
    const onPageHide = () => usePlayStoreBase.getState().flush()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [])

  // Solved just now (not reopened solved): celebrate, until dismissed.
  const solvedOpen = announcement?.key === 'solved' && announcement.id !== dismissedSolve
  const closeSolved = () => setDismissedSolve(announcement?.id ?? null)

  const newPuzzle = async () => {
    if (!puzzle) return
    const next = await createPuzzle(puzzle.locale, { format: puzzle.format, topic: puzzle.topic, difficulty: puzzle.difficulty })
    if (next) {
      closeSolved()
      router.push(puzzlePath(next.id))
    }
  }

  if (load.status === 'loading' || (load.status === 'ready' && puzzle?.id !== id)) {
    return (
      <div className='flex min-h-[50dvh] items-center justify-center'>
        <Spinner size='lg' label={t('loading')} />
      </div>
    )
  }

  if (load.status === 'missing' || !puzzle) {
    return (
      <div className='container-page flex min-h-[50dvh] flex-col items-center justify-center gap-4 text-center'>
        <WifiOff aria-hidden className='size-12 text-ink-300' />
        <h1 className='text-h2 font-extrabold'>{t('missingTitle')}</h1>
        <p className='max-w-md text-ink-700'>{t('missingText')}</p>
      </div>
    )
  }

  const announcementText = announcement
    ? t(`announce.${announcement.key}`, announcement.values as Record<string, number>)
    : ''
  const showKeyboard = coarse && status === 'playing'
  // How much of the viewport the grid must leave to the chrome around it (header, heading,
  // toolbar, clue bar — and the keyboard, four rows for Armenian), so it never scrolls away.
  const keyboardRows = puzzle.locale === 'hy' ? 4 : 3
  const chrome = showKeyboard ? `${20 + keyboardRows * 3.25}rem` : '21rem'
  const boardStyle = {
    maxWidth: `min(100%, 46rem, calc((100dvh - ${chrome}) * ${puzzle.width} / ${puzzle.height}))`,
  } as CSSProperties

  return (
    <div className='flex flex-col'>
      <div className='container-page flex flex-col gap-3 pt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6 lg:pt-6 xl:grid-cols-[17rem_minmax(0,1fr)_17rem]'>
        <aside aria-label={t('across')} className='hidden xl:block xl:sticky xl:top-20'>
          <ClueLists only='across' className='panel max-h-[calc(100dvh-7rem)] overflow-y-auto p-4' />
        </aside>

        <div className='flex min-w-0 flex-col gap-3'>
          <div className='flex items-center gap-3'>
            <PuzzleHeading puzzle={puzzle} />
            <Button
              variant='primary'
              size='sm'
              className='ms-auto shrink-0 px-3 sm:px-4'
              onClick={newPuzzle}
              loading={creating}
              aria-label={t('newPuzzle')}
              icon={<Plus aria-hidden className='size-5' />}
            >
              <span className='hidden sm:inline'>{t('newPuzzle')}</span>
            </Button>
          </div>
          {createError ? <ErrorAlert error={createError} onRetry={newPuzzle} /> : null}
          <Toolbar onShowClues={() => setCluesOpen(true)} />
          {!coarse && <ClueBar />}
          <div className='mx-auto w-full' style={boardStyle}>
            <Grid focusOnOpen={!coarse} />
          </div>
        </div>

        <aside aria-label={t('allClues')} className='hidden lg:sticky lg:top-20 lg:block'>
          <ClueLists className='panel max-h-[calc(100dvh-7rem)] overflow-y-auto p-4 xl:hidden' />
          <ClueLists only='down' className='panel hidden max-h-[calc(100dvh-7rem)] overflow-y-auto p-4 xl:flex' />
        </aside>
      </div>

      {coarse && (
        <div className='sticky bottom-0 z-30 mt-3 flex flex-col gap-2'>
          <div className='container-page'>
            <ClueBar />
          </div>
          {showKeyboard && <OnScreenKeyboard />}
        </div>
      )}

      <div aria-live='polite' aria-atomic className='sr-only'>
        {announcementText}
      </div>

      <Dialog open={cluesOpen} onClose={() => setCluesOpen(false)} title={t('allClues')} variant='sheet' size='lg'>
        <ClueLists layout='columns' onChoose={() => setCluesOpen(false)} />
      </Dialog>
      <SolvedDialog open={solvedOpen} onClose={closeSolved} onNewPuzzle={newPuzzle} pending={creating} />
    </div>
  )
}
