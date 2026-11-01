import { DEFAULT_LOCALE } from '@i18n/config'
import { fetchPuzzle } from '@helpers/serverData'
import { renderPuzzleCard, renderSiteCard } from '@helpers/socialCard'

/**
 * `/og/p/<id>.png`: a shared puzzle's link preview — its blank grid, format, topic and size,
 * never a clue or an answer. A stored puzzle never changes, so a crawler may keep the image
 * for good; an unknown id gets the site card, briefly.
 */
const PUZZLE_ID = /^([0-9A-Za-z]{10})\.png$/

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const id = PUZZLE_ID.exec((await params).image)?.[1]
  const puzzle = id ? await fetchPuzzle(id) : null
  if (!puzzle) return renderSiteCard(DEFAULT_LOCALE, { headers: { 'Cache-Control': 'public, max-age=300' } })
  return renderPuzzleCard(puzzle, { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } })
}
