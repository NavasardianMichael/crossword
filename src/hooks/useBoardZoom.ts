import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { usePlayStoreBase } from '@store/puzzle/play/store'
import {
  clampZoom,
  type Frame,
  placeAt,
  type Point,
  pointUnder,
  restingView,
  settle,
  stepZoom,
  type View,
  wheelZoomFactor,
  ZOOM_MIN,
  zoomAround,
} from '@helpers/puzzle/zoom'

/** How far (px) a mouse press travels before it is a drag, so a click still selects a cell. */
const DRAG_THRESHOLD = 5
/** A wheel zoom is laid out once the wheel has been still this long. */
const WHEEL_SETTLE_MS = 160
/** How long a button's zoom eases; reset a little longer, so it settles rather than snaps. */
const STEP_EASE_MS = 160
const RESET_EASE_MS = 220

/** Safari's trackpad pinch (and iOS's, which also sends touches). */
type GestureEvent = UIEvent & { scale: number; clientX: number; clientY: number }

type Gesture = {
  kind: 'pinch' | 'gesture' | 'wheel' | 'ease'
  frame: Frame
  /** The frame's scroll and screen box when the gesture began; neither moves until it ends. */
  scroll: Point
  box: DOMRect
  view: View
  /** Pinches keep the grid point that was between the fingers under them. */
  anchor: Point
  distance: number
}

/** A button zoom in flight: `scale` eases from `from` to `to`, keeping `anchor` under `point`. */
type Ease = { from: number; to: number; anchor: Point; point: Point; start: number; duration: number }

const frameOf = (viewport: HTMLElement, content: HTMLElement, zoom: number): Frame => ({
  zoom,
  width: viewport.clientWidth,
  height: viewport.clientHeight,
  contentWidth: content.offsetWidth,
  contentHeight: content.offsetHeight,
})

const scrollOf = (viewport: HTMLElement): Point => ({ x: viewport.scrollLeft, y: viewport.scrollTop })

const local = (box: DOMRect, x: number, y: number): Point => ({ x: x - box.left, y: y - box.top })

/** The midpoint between two fingers (on screen) and how far apart they are. */
const fingers = (touches: TouchList) => {
  const a = touches[0]!
  const b = touches[1]!
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
    distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
  }
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Zoom and pan for the board. One finger scrolls it natively, with the browser's own momentum;
 * on top of that:
 * - two fingers, a trackpad pinch or the mouse wheel zoom around the fingers or the pointer —
 *   over the board the wheel zooms rather than scrolls, like a map;
 * - the buttons ease to the next step (or back to fit); quick presses chain from where the
 *   running ease is heading, so they never snap back;
 * - a mouse drags the zoomed grid around (a press that doesn't travel stays a click);
 * - the cell under the cursor is scrolled into view as you type or pick a clue.
 *
 * Every write lands at most once per animation frame. A zoom costs no layout while it runs: the
 * grid is a `will-change` layer that is only transformed, then laid out at the new size once,
 * when the zoom ends (see `helpers/puzzle/zoom`). Cells are sized in container units, so that
 * single width change resizes everything crisply.
 */
export const useBoardZoom = () => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(ZOOM_MIN)
  // The listeners below are attached once and read the zoom from here.
  const zoomRef = useRef(ZOOM_MIN)
  // The buttons drive the same gesture machinery the listeners do.
  const buttonsRef = useRef<{ zoomBy: (steps: number) => void; reset: () => void } | null>(null)

  /** Lays the view out: the new width, then the scroll — in the same frame, so nothing jumps. */
  const commit = useCallback((frame: Frame, view: View) => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return
    const next = settle(frame, view)
    zoomRef.current = next.zoom
    flushSync(() => setZoom(next.zoom))
    content.style.transform = ''
    content.style.willChange = ''
    viewport.scrollTo(next.scroll.x, next.scroll.y)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return

    let gesture: Gesture | null = null
    let ease: Ease | null = null
    let drawRequest = 0
    let wheelTimer: ReturnType<typeof setTimeout> | undefined
    let touching = false

    const begin = (kind: Gesture['kind'], at: Point | null, distance = 0): Gesture => {
      const scroll = scrollOf(viewport)
      const box = viewport.getBoundingClientRect()
      const view = restingView(scroll)
      const anchor = at ? pointUnder(view, local(box, at.x, at.y)) : { x: 0, y: 0 }
      // Its own layer while it moves: scaled by the compositor, redrawn crisp once laid out.
      content.style.willChange = 'transform'
      gesture = { kind, frame: frameOf(viewport, content, zoomRef.current), scroll, box, view, anchor, distance }
      return gesture
    }

    const draw = () => {
      if (!gesture) return
      const { view, scroll } = gesture
      content.style.transform = `translate3d(${view.x + scroll.x}px, ${view.y + scroll.y}px, 0) scale(${view.scale})`
    }

    // At most one transform write per frame, however fast the events come.
    const show = (view: View) => {
      if (!gesture) return
      gesture.view = view
      drawRequest ||= requestAnimationFrame(() => {
        drawRequest = 0
        draw()
      })
    }

    const stop = () => {
      cancelAnimationFrame(drawRequest)
      drawRequest = 0
      clearTimeout(wheelTimer)
      ease = null
      const ended = gesture
      gesture = null
      return ended
    }

    const end = () => {
      const ended = stop()
      if (ended) commit(ended.frame, ended.view)
    }

    // ── The buttons ──
    const tick = (now: number) => {
      drawRequest = 0
      if (!gesture || !ease) return
      const t = Math.min(1, (now - ease.start) / ease.duration)
      gesture.view = placeAt(gesture.frame, ease.anchor, ease.point, ease.from + (ease.to - ease.from) * easeOutCubic(t))
      draw()
      if (t < 1) drawRequest = requestAnimationFrame(tick)
      else end()
    }

    /** Eases to the zoom `target` picks, around the middle of the frame. */
    const easeTo = (target: (from: number) => number, duration: number) => {
      if (gesture && gesture.kind !== 'ease') end()
      const current = gesture ?? begin('ease', null)
      const { frame } = current
      // A press during an ease steps on from where that ease is heading.
      const heading = ease ? frame.zoom * ease.to : zoomRef.current
      const to = clampZoom(target(heading)) / frame.zoom
      const point = { x: frame.width / 2, y: frame.height / 2 }
      const anchor = pointUnder(current.view, point)
      if (prefersStill()) {
        current.view = placeAt(frame, anchor, point, to)
        return end()
      }
      ease = { from: current.view.scale, to, anchor, point, start: performance.now(), duration }
      drawRequest ||= requestAnimationFrame(tick)
    }

    buttonsRef.current = {
      zoomBy: (steps) => easeTo((from) => stepZoom(from, steps), STEP_EASE_MS),
      reset: () => easeTo(() => ZOOM_MIN, RESET_EASE_MS),
    }

    // ── Two fingers ──
    const onTouchStart = (event: TouchEvent) => {
      touching = true
      if (event.touches.length !== 2) {
        // A third finger: settle what the first two did.
        if (gesture?.kind === 'pinch') end()
        return
      }
      end()
      const { x, y, distance } = fingers(event.touches)
      begin('pinch', { x, y }, distance)
    }

    const onTouchMove = (event: TouchEvent) => {
      if (gesture?.kind !== 'pinch' || event.touches.length !== 2) return
      if (!event.cancelable) {
        // The browser was already scrolling when the second finger landed: let it finish.
        stop()
        content.style.transform = ''
        content.style.willChange = ''
        return
      }
      event.preventDefault()
      const { x, y, distance } = fingers(event.touches)
      if (gesture.distance > 0) show(placeAt(gesture.frame, gesture.anchor, local(gesture.box, x, y), distance / gesture.distance))
    }

    const onTouchEnd = (event: TouchEvent) => {
      touching = event.touches.length > 0
      if (gesture?.kind === 'pinch' && event.touches.length < 2) end()
    }

    // ── Safari's trackpad pinch; on iOS the touches above already handle it ──
    const onGestureStart = (event: Event) => {
      event.preventDefault()
      if (touching) return
      end()
      const { clientX, clientY } = event as GestureEvent
      begin('gesture', { x: clientX, y: clientY })
    }

    const onGestureChange = (event: Event) => {
      event.preventDefault()
      if (gesture?.kind !== 'gesture') return
      const { clientX, clientY, scale } = event as GestureEvent
      show(placeAt(gesture.frame, gesture.anchor, local(gesture.box, clientX, clientY), scale))
    }

    const onGestureEnd = (event: Event) => {
      event.preventDefault()
      if (gesture?.kind === 'gesture') end()
    }

    // ── The wheel, and the trackpad pinch of Chromium and Firefox (a wheel with Ctrl) ──
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (gesture?.kind === 'pinch' || gesture?.kind === 'gesture') return
      // The wheel takes over from a button's ease.
      if (gesture?.kind === 'ease') end()
      const current = gesture ?? begin('wheel', null)
      const point = local(current.box, event.clientX, event.clientY)
      show(zoomAround(current.frame, current.view, point, wheelZoomFactor(event.deltaY, event.deltaMode)))
      clearTimeout(wheelTimer)
      wheelTimer = setTimeout(end, WHEEL_SETTLE_MS)
    }

    // ── Dragging with a mouse ──
    let drag: { id: number; start: Point; scroll: Point; to: Point | null; moved: boolean } | null = null
    let scrollRequest = 0
    let swallowClick = false

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || zoomRef.current === ZOOM_MIN) return
      // A drag starts from settled ground: whatever zoom was running lands first.
      end()
      drag = { id: event.pointerId, start: { x: event.clientX, y: event.clientY }, scroll: scrollOf(viewport), to: null, moved: false }
    }

    const endDrag = () => {
      cancelAnimationFrame(scrollRequest)
      scrollRequest = 0
      if (drag?.moved) {
        if (drag.to) viewport.scrollTo(drag.to.x, drag.to.y)
        // The click that follows a drag must not select the cell it ended on.
        swallowClick = true
        setTimeout(() => (swallowClick = false))
        delete viewport.dataset.dragging
      }
      drag = null
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      // Released outside the window before the drag began: there was no pointerup here.
      if (!(event.buttons & 1)) return endDrag()
      const dx = event.clientX - drag.start.x
      const dy = event.clientY - drag.start.y
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
        drag.moved = true
        viewport.setPointerCapture(event.pointerId)
        viewport.dataset.dragging = ''
      }
      // The grid follows the hand exactly, with one scroll write per frame.
      drag.to = { x: drag.scroll.x - dx, y: drag.scroll.y - dy }
      scrollRequest ||= requestAnimationFrame(() => {
        scrollRequest = 0
        if (drag?.to) viewport.scrollTo(drag.to.x, drag.to.y)
      })
    }

    const onPointerUp = (event: PointerEvent) => {
      if (drag && event.pointerId === drag.id) endDrag()
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!swallowClick) return
      swallowClick = false
      event.stopPropagation()
      event.preventDefault()
    }

    // ── Keep the cursor in view ──
    let revealRequest = 0
    const reveal = (cell: number) => {
      if (gesture || drag?.moved || zoomRef.current === ZOOM_MIN) return
      const target = content.querySelector<HTMLElement>(`[data-cell="${cell}"]`)
      if (!target) return
      const box = viewport.getBoundingClientRect()
      const rect = target.getBoundingClientRect()
      const margin = rect.width / 2
      const along = (start: number, end: number, min: number, max: number) =>
        start < min + margin ? start - min - margin : end > max - margin ? end - max + margin : 0
      const left = along(rect.left, rect.right, box.left, box.right)
      const top = along(rect.top, rect.bottom, box.top, box.bottom)
      if (!left && !top) return
      viewport.scrollBy({ left, top, behavior: prefersStill() ? 'instant' : 'smooth' })
    }
    const unsubscribe = usePlayStoreBase.subscribe((state, previous) => {
      if (state.cursor.cell === previous.cursor.cell) return
      cancelAnimationFrame(revealRequest)
      // After the grid has rendered the move.
      revealRequest = requestAnimationFrame(() => reveal(state.cursor.cell))
    })

    const passive = { passive: true }
    const active = { passive: false }
    viewport.addEventListener('touchstart', onTouchStart, passive)
    viewport.addEventListener('touchmove', onTouchMove, active)
    viewport.addEventListener('touchend', onTouchEnd, passive)
    viewport.addEventListener('touchcancel', onTouchEnd, passive)
    viewport.addEventListener('gesturestart', onGestureStart, active)
    viewport.addEventListener('gesturechange', onGestureChange, active)
    viewport.addEventListener('gestureend', onGestureEnd, active)
    viewport.addEventListener('wheel', onWheel, active)
    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', onPointerUp)
    viewport.addEventListener('pointercancel', onPointerUp)
    viewport.addEventListener('click', onClickCapture, true)

    return () => {
      stop()
      buttonsRef.current = null
      cancelAnimationFrame(scrollRequest)
      cancelAnimationFrame(revealRequest)
      unsubscribe()
      content.style.transform = ''
      content.style.willChange = ''
      viewport.removeEventListener('touchstart', onTouchStart)
      viewport.removeEventListener('touchmove', onTouchMove)
      viewport.removeEventListener('touchend', onTouchEnd)
      viewport.removeEventListener('touchcancel', onTouchEnd)
      viewport.removeEventListener('gesturestart', onGestureStart)
      viewport.removeEventListener('gesturechange', onGestureChange)
      viewport.removeEventListener('gestureend', onGestureEnd)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', onPointerUp)
      viewport.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('click', onClickCapture, true)
    }
  }, [commit])

  const zoomBy = useCallback((steps: number) => buttonsRef.current?.zoomBy(steps), [])
  const reset = useCallback(() => buttonsRef.current?.reset(), [])

  return { viewportRef, contentRef, zoom, zoomBy, reset }
}
