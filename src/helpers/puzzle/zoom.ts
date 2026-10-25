/**
 * Board zoom as pure geometry, for the gesture code in `hooks/useBoardZoom.ts`.
 *
 * Zoom 1 fits the whole grid in its frame; above it the grid is laid out wider than the frame,
 * which scrolls. While a pinch or a wheel zoom is running, the grid is only *transformed* — no
 * layout per frame — and a `View` says where it is drawn: its top-left corner at (`x`, `y`) in
 * frame pixels (never above 0: minus the scroll), at `scale` times its laid-out size. When the
 * gesture ends the zoom is laid out for real and the frame scrolled to (−`x`, −`y`), so nothing
 * moves on screen.
 */
export const ZOOM_MIN = 1
export const ZOOM_MAX = 3
/** One press of a zoom button. */
export const ZOOM_STEP = 1.25

export type Point = { x: number; y: number }
export type View = Point & { scale: number }

/** The committed zoom, the frame's size and the grid's laid-out size at that zoom. */
export type Frame = { zoom: number; width: number; height: number; contentWidth: number; contentHeight: number }

export const clampZoom = (zoom: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom))

/** Clamped, and pulled onto an end when within a hair of it, so a pinch can land on "fit". */
export const snapZoom = (zoom: number): number => {
  const clamped = clampZoom(zoom)
  if (clamped - ZOOM_MIN < 0.03) return ZOOM_MIN
  if (ZOOM_MAX - clamped < 0.03) return ZOOM_MAX
  return clamped
}

/**
 * The zoom `steps` button presses away (negative zooms out). A press that would stop just short
 * of an end — after a pinch left the zoom between steps — goes all the way.
 */
export const stepZoom = (zoom: number, steps: number): number => {
  const next = zoom * ZOOM_STEP ** steps
  if (next < ZOOM_MIN * 1.1) return ZOOM_MIN
  if (next > ZOOM_MAX / 1.1) return ZOOM_MAX
  return next
}

/** The view of a frame at rest: drawn as laid out, scrolled to `scroll`. */
export const restingView = (scroll: Point): View => ({ scale: 1, x: -scroll.x, y: -scroll.y })

/** The grid point (in laid-out pixels) drawn under `point`. */
export const pointUnder = (view: View, point: Point): Point => ({
  x: (point.x - view.x) / view.scale,
  y: (point.y - view.y) / view.scale,
})

/** An offset that leaves no gap between the grid's edges and the frame's. */
const edge = (offset: number, min: number) => Math.min(0, Math.max(offset, min))

/**
 * The view that draws grid point `anchor` under `point` at `scale` — kept within the zoom range
 * and never pulling an edge of the grid inside the frame.
 */
export const placeAt = (frame: Frame, anchor: Point, point: Point, scale: number): View => {
  const clamped = clampZoom(frame.zoom * scale) / frame.zoom
  return {
    scale: clamped,
    x: edge(point.x - anchor.x * clamped, frame.width - frame.contentWidth * clamped),
    y: edge(point.y - anchor.y * clamped, frame.height - frame.contentHeight * clamped),
  }
}

/** Zoomed by `factor` around `point`: whatever is under it stays there. */
export const zoomAround = (frame: Frame, view: View, point: Point, factor: number): View =>
  placeAt(frame, pointUnder(view, point), point, view.scale * factor)

/** What a view lays out as: the zoom, and the scroll that shows the same part of the grid. */
export const settle = (frame: Frame, view: View): { zoom: number; scroll: Point } => {
  const zoom = snapZoom(frame.zoom * view.scale)
  // Snapping can nudge the scale a little; the scroll follows it.
  const ratio = zoom / (frame.zoom * view.scale)
  return { zoom, scroll: { x: -view.x * ratio, y: -view.y * ratio } }
}

/**
 * The zoom factor of one wheel event over the board — also what a trackpad pinch sends in
 * Chromium and Firefox (with Ctrl). A mouse notch (100 px, or 3 lines) is about one button step;
 * a trackpad's small deltas zoom smoothly.
 */
export const wheelZoomFactor = (deltaY: number, deltaMode: number): number => {
  const pixels = deltaMode === 1 ? deltaY * 16 : deltaMode === 2 ? deltaY * 400 : deltaY
  return 2 ** (-Math.min(50, Math.max(-50, pixels)) / 150)
}
