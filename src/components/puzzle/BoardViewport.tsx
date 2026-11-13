'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Expand, Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBoardZoom } from '@hooks/useBoardZoom'
import { useCoarsePointer } from '@hooks/useCoarsePointer'
import { cn } from '@helpers/cn'
import { ZOOM_MAX, ZOOM_MIN } from '@helpers/puzzle/zoom'
import { IconButton } from '@components/ui/IconButton'

/**
 * Room around the grid, as a fraction of its width, for the cursor's ring and the tiles' edge —
 * the frame clips. A percentage, so it grows with the zoom and the grid scales as one piece.
 */
const GUTTER = 0.01

/**
 * The zoom buttons' row under the frame: the gap and a 44 px button. On a short touch screen
 * the row is left out — pinch and drag still zoom and pan — and its height goes to the grid.
 */
const ZOOM_ROW = 'var(--zoom-row)'

/**
 * The frame the grid is played in, with − / + / reset under it. At the starting zoom the whole
 * grid fits; zoomed in, it scrolls and pans (see `useBoardZoom` for the gestures).
 *
 * Three layers: the scrolling frame; a layer as wide as the zoom that clips, so a grid drawn
 * larger mid-gesture never stretches the scroll range; and the layer a gesture transforms.
 * The grid inside is passed as `children`, so a zoom change never re-renders it. The frame is
 * always left-to-right — the zoom geometry measures scroll from the left — and the grid sets
 * its own direction.
 *
 * `fit`: as large as the nearest size container (`[container-type:size]`) allows — width and
 * height, the zoom row included where it is shown.
 */
type BoardViewportProps = { columns: number; rows: number; fit?: boolean; style?: CSSProperties; className?: string; children: ReactNode }

export const BoardViewport = ({ columns, rows, fit, style, className, children }: BoardViewportProps) => {
  const t = useTranslations('Play.zoom')
  const coarse = useCoarsePointer()
  const { viewportRef, contentRef, zoom, zoomBy, reset } = useBoardZoom()
  const zoomed = zoom > ZOOM_MIN
  // The frame is exactly as tall as the grid plus its gutter at the starting zoom.
  const frameRows = rows * (1 - 2 * GUTTER) + columns * 2 * GUTTER
  const aspectRatio = `${columns} / ${frameRows}`
  const fitStyle: CSSProperties | undefined = fit ? { width: `min(100cqw, (100cqh - ${ZOOM_ROW}) * ${columns / frameRows})` } : undefined

  return (
    <div className={cn('flex flex-col gap-2 [--zoom-row:3.25rem]', fit && 'short-touch:[--zoom-row:0px]', className)} style={{ ...fitStyle, ...style }}>
      <div
        ref={viewportRef}
        dir='ltr'
        className={cn(
          'no-scrollbar touch-pan-x touch-pan-y',
          zoomed
            ? // Zoomed, the whole grid is a handle — cells included, over their own pointer cursor.
              'cursor-grab overflow-auto overscroll-contain **:cursor-grab data-dragging:cursor-grabbing data-dragging:**:cursor-grabbing'
            : 'overflow-hidden'
        )}
        style={{ aspectRatio }}
      >
        <div className='overflow-clip' style={{ width: `${zoom * 100}%` }}>
          <div ref={contentRef} className='origin-top-left' style={{ padding: `${GUTTER * 100}%` }}>
            {children}
          </div>
        </div>
      </div>

      <div role='group' aria-label={t('label')} className={cn('flex justify-center gap-2', fit && 'short-touch:hidden')}>
        <IconButton
          label={t('out')}
          icon={<Minus aria-hidden className='size-5' />}
          tooltip={!coarse}
          disabled={!zoomed}
          onClick={() => zoomBy(-1)}
        />
        <IconButton
          label={t('in')}
          icon={<Plus aria-hidden className='size-5' />}
          tooltip={!coarse}
          disabled={zoom >= ZOOM_MAX}
          onClick={() => zoomBy(1)}
        />
        <IconButton
          label={t('reset')}
          icon={<Expand aria-hidden className='size-5' />}
          tooltip={!coarse}
          disabled={!zoomed}
          onClick={reset}
        />
      </div>
    </div>
  )
}
