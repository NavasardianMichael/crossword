'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { House, Plus, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBillingStore } from '@store/billing/store'
import { useLeaveGuardStoreBase } from '@store/navigation/guard/store'
import { useCreateStore } from '@store/puzzle/create/store'
import { usePlayStore, usePlayStoreBase } from '@store/puzzle/play/store'
import { useCoarsePointer } from '@hooks/useCoarsePointer'
import { useGameLayout } from '@hooks/useGameLayout'
import { confirmLeave, useLeaveGuard } from '@hooks/useLeaveGuard'
import { usePendingRouter } from '@hooks/useNavigationPending'
import { puzzleCredits, type PuzzleView } from '@constants/puzzle'
import { puzzlePath } from '@constants/routes'
import { cn } from '@helpers/cn'
import { loadProgress, loadPuzzle, savePuzzle } from '@helpers/offline/db'
import { addSeen } from '@helpers/puzzle/seen'
import { CreateErrorAlert } from '@components/billing/CreateErrorAlert'
import { PuzzleCost } from '@components/billing/PuzzleCost'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'
import { IconLink } from '@components/ui/IconLink'
import { Spinner } from '@components/ui/Spinner'
import { BoardViewport } from './BoardViewport'
import { ClueBar } from './ClueBar'
import { ClueLists } from './ClueLists'
import { Grid } from './Grid'
import { MissingPuzzle } from './MissingPuzzle'
import { OnScreenKeyboard } from './OnScreenKeyboard'
import { PuzzleHeading } from './PuzzleHeading'
import { ShareDialog } from './ShareDialog'
import { SolvedDialog } from './SolvedDialog'
import { Toolbar } from './Toolbar'

/**
 * One puzzle, playable on any screen:
 * - **phones, tablets, narrow windows** (`useGameLayout`): a full-screen game that never scrolls —
 *   a slim bar (home, the heading, the clock and one menu with every action), the grid in all
 *   the room left, then — within thumb reach — the active clue and, on touch, the language's
 *   keyboard. The clue list opens as a sheet from the menu, or sits beside the grid from `lg`.
 *   The site's header and footer step aside (globals.css `game-layout`, `game-page`);
 * - **desktop** (`lg`, a mouse): a page — heading, toolbar, clue bar and grid, with a clue
 *   panel beside it; from `xl` Across | grid | Down.
 *
 * The puzzle comes from the server render when online, otherwise from the device (it was saved
 * when it arrived), so a started game reopens offline. Progress is restored and saved as you go.
 */
type PuzzleBoardProps = { id: string; initial: PuzzleView | null }

type LoadState = { status: 'loading' } | { status: 'ready' } | { status: 'missing' }

export const PuzzleBoard = ({ id, initial }: PuzzleBoardProps) => {
  const t = useTranslations('Play')
  const tNav = useTranslations('Nav')
  const router = usePendingRouter()
  const coarse = useCoarsePointer()
  const game = useGameLayout()
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [cluesOpen, setCluesOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [costOpen, setCostOpen] = useState(false)
  const [dismissedSolve, setDismissedSolve] = useState<number | null>(null)
  const puzzle = usePlayStore.use.puzzle()
  const status = usePlayStore.use.status()
  const announcement = usePlayStore.use.announcement()
  const start = usePlayStore.use.start()
  // A game with letters in it and not yet solved: leaving asks first.
  const unfinished = usePlayStore((state) => state.status === 'playing' && state.entries.some(Boolean))
  const createPuzzle = useCreateStore.use.createPuzzle()
  const creating = useCreateStore.use.isPending()
  const createError = useCreateStore.use.error()
  const options = useCreateStore.use.options()
  const hydrateOptions = useCreateStore.use.hydrateOptions()
  const billing = useBillingStore.use.status()

  // "New puzzle" keeps this puzzle's format, topic and difficulty, and the player's last size.
  useEffect(() => {
    hydrateOptions()
  }, [hydrateOptions])

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

  useLeaveGuard(unfinished)

  // Solved just now (not reopened solved): celebrate, until dismissed.
  const solvedOpen = announcement?.key === 'solved' && announcement.id !== dismissedSolve
  const closeSolved = () => setDismissedSolve(announcement?.id ?? null)

  const newPuzzle = async () => {
    if (!puzzle) return
    // The clock is already running, so this asks even before the first letter. A solved puzzle does not.
    if (!(await confirmLeave(status === 'playing'))) return
    const next = await createPuzzle(puzzle.locale, { format: puzzle.format, topic: puzzle.topic, difficulty: puzzle.difficulty })
    // Solved or not, the dialog steps aside: a refusal's sign-in / buy-credits alert sits behind it.
    closeSolved()
    if (!next) {
      useLeaveGuardStoreBase.getState().keepGuarding()
      return
    }
    router.push(puzzlePath(next.id))
  }

  // A puzzle that spends bought credits is never one tap away: the price is shown and confirmed
  // first. One the free credits cover needs no confirmation, and a guest's refusal explains itself.
  const requestNewPuzzle = () => {
    if (puzzle && billing?.signedIn && puzzleCredits(options.size, puzzle.difficulty) > billing.freeCredits) setCostOpen(true)
    else void newPuzzle()
  }
  const confirmNewPuzzle = () => {
    setCostOpen(false)
    void newPuzzle()
  }

  if (load.status === 'loading' || (load.status === 'ready' && puzzle?.id !== id)) {
    return (
      // Marked as a board already, so on a phone the site's header never flashes in and out.
      <div data-game-board className='flex min-h-[50dvh] items-center justify-center game:h-dvh'>
        <Spinner size='lg' label={t('loading')} />
      </div>
    )
  }

  if (load.status === 'missing' || !puzzle) return <MissingPuzzle />

  const announcementText = announcement
    ? t(`announce.${announcement.key}`, announcement.values as Record<string, number>)
    : ''

  const dialogs = (
    <>
      <div aria-live='polite' aria-atomic className='sr-only'>
        {announcementText}
      </div>
      <SolvedDialog
        open={solvedOpen}
        onClose={closeSolved}
        onNewPuzzle={newPuzzle}
        pending={creating}
        cost={<PuzzleCost size={options.size} difficulty={puzzle.difficulty} />}
      />
      <Dialog
        open={costOpen}
        onClose={() => setCostOpen(false)}
        title={t('newPuzzleConfirm.title')}
        description={t('newPuzzleConfirm.text')}
        footer={
          <>
            <Button variant='ghost' size='sm' onClick={() => setCostOpen(false)}>
              {t('newPuzzleConfirm.cancel')}
            </Button>
            <Button variant='primary' size='sm' onClick={confirmNewPuzzle} icon={<Plus aria-hidden className='size-5' />}>
              {t('newPuzzleConfirm.create')}
            </Button>
          </>
        }
      >
        <PuzzleCost size={options.size} difficulty={puzzle.difficulty} />
      </Dialog>
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  )

  if (game) {
    const showKeyboard = coarse && status === 'playing'
    return (
      <div data-game-board className='game-layout'>
        <div className='container-page flex flex-col gap-2 pt-[calc(var(--safe-top)+0.5rem)] pb-2 [grid-area:bar]'>
          <div className='flex items-center gap-2'>
            <IconLink href='/' label={tNav('home')} icon={<House aria-hidden className='size-5' />} />
            <PuzzleHeading puzzle={puzzle} compact />
            <Toolbar
              compact={{ onNewPuzzle: requestNewPuzzle, onShare: () => setShareOpen(true), onShowClues: () => setCluesOpen(true), creating }}
              className='ms-auto shrink-0'
            />
          </div>
          {createError ? <CreateErrorAlert error={createError} onRetry={newPuzzle} /> : null}
        </div>

        <div className='flex min-h-0 items-center justify-center p-2 ps-[max(0.5rem,var(--safe-left))] [container-type:size] [grid-area:board]'>
          <BoardViewport key={puzzle.id} columns={puzzle.width} rows={puzzle.height} fit>
            <Grid focusOnOpen={!coarse} />
          </BoardViewport>
        </div>

        <aside aria-label={t('allClues')} className='hidden min-h-0 py-2 pe-6 lg:block [grid-area:clues]'>
          <ClueLists className='panel thin-scrollbar h-full overflow-y-auto p-4' />
        </aside>

        {/* Tall enough for a two-line clue, so the grid keeps still from word to word. */}
        <div className={cn('container-page [grid-area:clue]', showKeyboard ? 'pb-2' : 'pb-[max(0.75rem,var(--safe-bottom))]')}>
          <ClueBar className='min-h-20' />
        </div>
        {showKeyboard && <OnScreenKeyboard className='[grid-area:keys]' />}

        <Dialog open={cluesOpen} onClose={() => setCluesOpen(false)} title={t('allClues')} variant='sheet' size='lg'>
          <ClueLists layout='columns' onChoose={() => setCluesOpen(false)} />
        </Dialog>
        {dialogs}
      </div>
    )
  }

  // How much of the viewport the grid must leave to the chrome around it (header, heading,
  // toolbar, clue bar, zoom buttons), so it never scrolls away.
  const boardStyle = {
    maxWidth: `min(100%, 56rem, calc((100dvh - 24.25rem) * ${puzzle.width} / ${puzzle.height}))`,
  } as CSSProperties

  return (
    // Wider than the site's other pages: the grid and both clue columns use the whole screen.
    <div className='container-page grid max-w-[104rem] grid-cols-[minmax(0,1fr)_20rem] items-start gap-6 pt-6 xl:grid-cols-[19rem_minmax(0,1fr)_19rem] min-[96rem]:grid-cols-[22rem_minmax(0,1fr)_22rem]'>
      <aside aria-label={t('across')} className='sticky top-20 hidden xl:block'>
        <ClueLists only='across' className='panel thin-scrollbar max-h-[calc(100dvh-7rem)] overflow-y-auto p-4' />
      </aside>

      <div className='flex min-w-0 flex-col gap-3'>
        <div className='flex items-center gap-3'>
          <PuzzleHeading puzzle={puzzle} />
          <Button
            variant='outline'
            size='sm'
            className='ms-auto shrink-0 px-3 sm:px-4'
            onClick={() => setShareOpen(true)}
            aria-label={t('share')}
            icon={<Share2 aria-hidden className='size-5' />}
          >
            <span className='hidden sm:inline'>{t('shareShort')}</span>
          </Button>
          <Button
            variant='primary'
            size='sm'
            className='shrink-0 px-3 sm:px-4'
            onClick={requestNewPuzzle}
            loading={creating}
            aria-label={t('newPuzzle')}
            icon={<Plus aria-hidden className='size-5' />}
          >
            <span className='hidden sm:inline'>{t('newPuzzle')}</span>
          </Button>
        </div>
        {createError ? <CreateErrorAlert error={createError} onRetry={newPuzzle} /> : null}
        <Toolbar />
        <ClueBar />
        <BoardViewport key={puzzle.id} columns={puzzle.width} rows={puzzle.height} className='mx-auto w-full' style={boardStyle}>
          <Grid focusOnOpen />
        </BoardViewport>
      </div>

      <aside aria-label={t('allClues')} className='sticky top-20'>
        <ClueLists className='panel thin-scrollbar max-h-[calc(100dvh-7rem)] overflow-y-auto p-4 xl:hidden' />
        <ClueLists only='down' className='panel thin-scrollbar hidden max-h-[calc(100dvh-7rem)] overflow-y-auto p-4 xl:flex' />
      </aside>
      {dialogs}
    </div>
  )
}
