import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { puzzlePath } from '@constants/routes'
import { fetchPuzzle } from '@helpers/serverData'
import { PuzzleBoard } from '@components/puzzle/PuzzleBoard'

/**
 * A stored puzzle — created here or shared. Rendered per request (the id is open-ended) and
 * kept out of the index: its words are somebody's unseen words, not content. When the API is
 * unreachable the board opens the device's own copy instead.
 */
type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const puzzle = await fetchPuzzle(id)
  const t = await getTranslations()
  const title = puzzle
    ? `${t(`Formats.${puzzle.format}.name`)} · ${t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)}`
    : t('Play.title')
  return pageMetadata({ path: puzzlePath(id), title, description: t('Seo.puzzleDescription'), noIndex: true })
}

export default async function PuzzlePage({ params }: Props) {
  const { id } = await params
  return <PuzzleBoard id={id} initial={await fetchPuzzle(id)} />
}
