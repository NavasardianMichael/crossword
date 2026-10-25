'use client'

import { useEffect } from 'react'

/**
 * Asks before the page is left while `active`: closing the tab or window, reloading or typing
 * an address gets the browser's own "Leave site?" prompt (its text cannot be changed), and an
 * in-app link — a client-side navigation the browser never sees — gets `message` in a native
 * confirm. Links that open elsewhere (new tab, download, another site) are left alone.
 */
export const useLeaveGuard = (active: boolean, message: string): void => {
  useEffect(() => {
    if (!active) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
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
      if (window.confirm(message)) return
      event.preventDefault()
      event.stopPropagation()
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClick, true)
    }
  }, [active, message])
}
