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
  if (!puzzle)
    return pageMetadata({
      path: puzzlePath(id),
      title: t('Play.title'),
      description: t('Seo.puzzleDescription'),
      noIndex: true,
    })

  // What a link preview shows: the kind of puzzle, never a clue or an answer.
  const format = t(`Formats.${puzzle.format}.name`)
  const topic = t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)
  return pageMetadata({
    path: puzzlePath(id),
    title: `${format} · ${topic}`,
    description: t('Seo.sharedPuzzleDescription', {
      format: puzzle.format,
      topic,
      difficulty: t(`Difficulty.${puzzle.difficulty}`),
      size: `${puzzle.width}×${puzzle.height}`,
      words: puzzle.words.length,
    }),
    noIndex: true,
  })
}

export default async function PuzzlePage({ params }: Props) {
  const { id } = await params
  return <PuzzleBoard id={id} initial={await fetchPuzzle(id)} />
}
