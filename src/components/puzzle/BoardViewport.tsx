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
 * The frame the grid is played in, with − / + / reset under it. At the starting zoom the whole
 * grid fits; zoomed in, it scrolls and pans (see `useBoardZoom` for the gestures).
 *
 * Three layers: the scrolling frame; a layer as wide as the zoom that clips, so a grid drawn
 * larger mid-gesture never stretches the scroll range; and the layer a gesture transforms.
 * The grid inside is passed as `children`, so a zoom change never re-renders it.
 */
type BoardViewportProps = { columns: number; rows: number; style?: CSSProperties; className?: string; children: ReactNode }

export const BoardViewport = ({ columns, rows, style, className, children }: BoardViewportProps) => {
  const t = useTranslations('Play.zoom')
  const coarse = useCoarsePointer()
  const { viewportRef, contentRef, zoom, zoomBy, reset } = useBoardZoom()
  const zoomed = zoom > ZOOM_MIN
  // The frame is exactly as tall as the grid plus its gutter at the starting zoom.
  const aspectRatio = `${columns} / ${rows * (1 - 2 * GUTTER) + columns * 2 * GUTTER}`

  return (
    <div className={cn('flex flex-col gap-2', className)} style={style}>
      <div
        ref={viewportRef}
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

      <div role='group' aria-label={t('label')} className='flex justify-center gap-2'>
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
