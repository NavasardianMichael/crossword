import { describe, expect, it } from 'vitest'
import {
  type Frame,
  placeAt,
  pointUnder,
  restingView,
  settle,
  stepZoom,
  wheelZoomFactor,
  ZOOM_MAX,
  ZOOM_MIN,
  zoomAround,
} from '@helpers/puzzle/zoom'

/** A 400 × 300 frame showing the grid at its starting zoom. */
const fitted: Frame = { zoom: 1, width: 400, height: 300, contentWidth: 400, contentHeight: 300 }
/** The same frame at zoom 2, scrolled to (100, 50). */
const zoomed: Frame = { zoom: 2, width: 400, height: 300, contentWidth: 800, contentHeight: 600 }

describe('board zoom', () => {
  it('steps by the button factor and lands exactly on both ends', () => {
    expect(stepZoom(1, 1)).toBeCloseTo(1.25)
    expect(stepZoom(1, -1)).toBe(ZOOM_MIN)
    expect(stepZoom(1.3, -1)).toBe(ZOOM_MIN)
    let zoom = ZOOM_MIN
    for (let i = 0; i < 10; i++) zoom = stepZoom(zoom, 1)
    expect(zoom).toBe(ZOOM_MAX)
  })

  it('keeps the point under the pointer in place', () => {
    const point = { x: 120, y: 80 }
    const view = restingView({ x: 100, y: 50 })
    const before = pointUnder(view, point)
    const after = zoomAround(zoomed, view, point, 1.2)
    expect(after.scale).toBeCloseTo(1.2)
    expect(pointUnder(after, point).x).toBeCloseTo(before.x)
    expect(pointUnder(after, point).y).toBeCloseTo(before.y)
  })

  it('never zooms past the range', () => {
    expect(zoomAround(fitted, restingView({ x: 0, y: 0 }), { x: 200, y: 150 }, 0.5).scale).toBe(1)
    expect(zoomAround(zoomed, restingView({ x: 0, y: 0 }), { x: 200, y: 150 }, 5).scale).toBe(ZOOM_MAX / 2)
  })

  it('never leaves a gap at an edge', () => {
    // Zooming out around the bottom-right corner would pull the grid's top-left into the frame.
    const view = zoomAround(zoomed, restingView({ x: 400, y: 300 }), { x: 400, y: 300 }, 0.6)
    expect(view.x).toBeLessThanOrEqual(0)
    expect(view.y).toBeLessThanOrEqual(0)
    expect(view.x + zoomed.contentWidth * view.scale).toBeGreaterThanOrEqual(zoomed.width)
    expect(view.y + zoomed.contentHeight * view.scale).toBeGreaterThanOrEqual(zoomed.height)
  })

  it('follows the fingers as they move apart and drift', () => {
    const view = restingView({ x: 0, y: 0 })
    const anchor = pointUnder(view, { x: 200, y: 150 })
    const pinched = placeAt(fitted, anchor, { x: 220, y: 160 }, 2)
    expect(pinched).toEqual({ scale: 2, x: 220 - anchor.x * 2, y: 160 - anchor.y * 2 })
  })

  it('settles into a zoom and a scroll that show the same thing', () => {
    expect(settle(fitted, { scale: 2, x: -150, y: -90 })).toEqual({ zoom: 2, scroll: { x: 150, y: 90 } })
    // Back to (almost) the start: snapped to fit, nothing left to scroll.
    const back = settle(zoomed, { scale: 0.505, x: 0, y: 0 })
    expect(back.zoom).toBe(ZOOM_MIN)
    expect(back.scroll.x).toBeCloseTo(0)
    expect(back.scroll.y).toBeCloseTo(0)
  })

  it('turns a wheel notch into about one button step, and a trackpad tick into a nudge', () => {
    expect(wheelZoomFactor(-100, 0)).toBeGreaterThan(1.2)
    expect(wheelZoomFactor(-100, 0)).toBeLessThan(1.3)
    expect(wheelZoomFactor(-3, 1)).toBeCloseTo(wheelZoomFactor(-100, 0), 1)
    expect(wheelZoomFactor(100, 0)).toBeCloseTo(1 / wheelZoomFactor(-100, 0))
    expect(wheelZoomFactor(-2, 0)).toBeLessThan(1.01)
  })
})
