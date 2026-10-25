'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { localePath } from '@i18n/pathname'
import { puzzlePath } from '@constants/routes'
import { trackEvent } from '@helpers/analytics'
import { buildPuzzlePdf, loadPdfFonts, needsArmenian, type PdfLabels } from '@helpers/puzzle/pdf'
import { reportError } from '@helpers/reportError'
import { absoluteUrl } from '@helpers/url'

export type PdfOptions = { letters: boolean; answers: boolean }

/** US and Canadian printers take Letter; everyone else A4. */
const pageSizeFor = (language: string) => (/-(US|CA)$/i.test(language) ? 'letter' : 'a4')

/**
 * Builds the current puzzle as a PDF and opens it in a new tab. The tab is opened at once,
 * inside the click — a tab opened after an `await` is a blocked popup — and shows a short
 * "preparing" note until the PDF replaces it. With popups blocked anyway, the file downloads.
 */
export const usePuzzlePdf = () => {
  const t = useTranslations()
  const puzzle = usePlayStore.use.puzzle()
  const entries = usePlayStore.use.entries()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const openPdf = async (options: PdfOptions): Promise<boolean> => {
    if (!puzzle) return false
    const tab = window.open('', '_blank')
    if (tab) {
      tab.opener = null
      tab.document.title = t('Play.print.preparing')
      tab.document.body.textContent = t('Play.print.preparing')
    }
    setPending(true)
    setError(null)
    try {
      const labels: PdfLabels = {
        title: t(`Formats.${puzzle.format}.name`),
        subtitle: `${t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)} · ${t(`Difficulty.${puzzle.difficulty}`)}`,
        brand: t('Common.appName'),
        across: t('Play.across'),
        down: t('Play.down'),
        answers: t('Play.print.answersTitle'),
        playOnline: t('Play.print.playOnline', { url: absoluteUrl(localePath(puzzle.locale, puzzlePath(puzzle.id))) }),
      }
      const fonts = await loadPdfFonts(needsArmenian({ puzzle, labels }))
      const bytes = await buildPuzzlePdf(
        {
          puzzle,
          labels,
          letters: options.letters ? entries : undefined,
          answers: options.answers,
          pageSize: pageSizeFor(navigator.language),
        },
        fonts
      )
      // Not revoked: the tab may be reloaded, and one PDF's memory is not worth a broken reload.
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
      if (tab && !tab.closed) tab.location.href = url
      else {
        const link = document.createElement('a')
        link.href = url
        link.download = `${puzzle.format}-${puzzle.id}.pdf`
        link.click()
      }
      trackEvent('puzzle_pdf', { format: puzzle.format, ...options })
      return true
    } catch (caught) {
      tab?.close()
      setError(caught)
      reportError(caught, 'puzzle:pdf', { silent: true })
      return false
    } finally {
      setPending(false)
    }
  }

  return { openPdf, pending, error }
}
