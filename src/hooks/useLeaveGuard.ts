'use client'

import { useEffect, useId } from 'react'
import { useLeaveGuardStoreBase } from '@store/navigation/guard/store'

/**
 * Asks before the page is left while a puzzle is in progress. Closing the tab, the window or
 * the browser gets the browser's own dialog; links and the back button get ours (`LeaveGuard`).
 */
export const useLeaveGuard = (active: boolean) => {
  const id = useId()
  const setGuard = useLeaveGuardStoreBase((state) => state.setGuard)

  useEffect(() => {
    setGuard(id, active)
    return () => setGuard(id, false)
  }, [id, active, setGuard])
}

/**
 * For a navigation that is not a link (a router call behind a button or a menu): asks the
 * question of the guard that is up, if any. True when there is nothing to ask or the player agreed.
 */
export const confirmLeave = (): Promise<boolean> => useLeaveGuardStoreBase.getState().ask()
