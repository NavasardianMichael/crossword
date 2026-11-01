'use client'

import { useEffect } from 'react'

const EXTRA_ENTRY = 'leaveGuard'

/** The question while a guard is up; null when leaving needs no asking. */
let question: string | null = null

/**
 * For a navigation that is not a link (a router call behind a button or a menu): asks the
 * question of the guard that is up, if any. True when there is nothing to ask or the player agreed.
 */
export const confirmLeave = (): boolean => question === null || window.confirm(question)

const onExtraEntry = (): boolean => Boolean(window.history.state?.[EXTRA_ENTRY])

// Next's own state is copied along, so its router treats the entry as one of its own.
const pushExtraEntry = () => window.history.pushState({ ...window.history.state, [EXTRA_ENTRY]: true }, '', window.location.href)

/**
 * Asks before the page is left while `active`: closing the tab or window, reloading or typing
 * an address gets the browser's own "Leave site?" prompt (its text cannot be changed); an
 * in-app link, the browser's Back to an in-app page, and any `confirmLeave` caller get
 * `message` in a native confirm. Links that open elsewhere (new tab, download, another site)
 * are left alone.
 */
export const useLeaveGuard = (active: boolean, message: string): void => {
  useEffect(() => {
    if (!active) return
    question = message
    const href = window.location.href
    // Set once the player agreed to go Back, so an unload that follows does not ask again.
    let leaving = false

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (leaving) return
      event.preventDefault()
      // Older Chromium and Safari still show the prompt only when this is set.
      event.returnValue = ''
    }

    // Capture on the document runs before React's listener on the root, so a refusal stops the
    // router before it starts.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest?.('a[href]')
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download')) return
      if (anchor.target && anchor.target !== '_self') return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      if (confirmLeave()) return
      event.preventDefault()
      event.stopPropagation()
    }

    // Back to an in-app page never unloads this one, and a popstate cannot be cancelled. So an
    // extra entry for this page goes on top: Back first lands on the page itself, the player is
    // asked there, and the real Back follows once they agree. Not when Back leaves the site —
    // that unloads, and beforeunload asks.
    if (!onExtraEntry() && (typeof navigation === 'undefined' || navigation.canGoBack)) pushExtraEntry()

    const onPopState = () => {
      if (window.location.href !== href || onExtraEntry()) return
      if (window.confirm(message)) {
        leaving = true
        window.history.back()
      } else pushExtraEntry()
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onClick, true)
    return () => {
      question = null
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClick, true)
      // Solved (or emptied) while still on the page: step off the extra entry, so the next Back
      // is not spent on it. Checked a tick later, once a remount (Strict Mode) or a navigation
      // has settled.
      setTimeout(() => {
        if (question === null && window.location.href === href && onExtraEntry()) window.history.back()
      })
    }
  }, [active, message])
}
